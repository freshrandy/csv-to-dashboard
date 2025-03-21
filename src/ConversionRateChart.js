import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Colors from "./Colors";

/**
 * Improved Conversion Rate Chart Component with Dual-Axis Visualization
 * Shows conversion rate bars with volume metrics on a secondary axis
 * Uses the same calculation logic as metrics.js for consistency
 */
const ConversionRateChart = ({ rawData, metrics, colors }) => {
  // State for chart data
  const [weeklyData, setWeeklyData] = useState([]);

  // State for target line toggle and value
  const [showTargetLine, setShowTargetLine] = useState(false);
  const [targetConversion, setTargetConversion] = useState(50);

  // State for which volume metric to display
  const [volumeMetric, setVolumeMetric] = useState("completed");

  // Generate weekly data on component mount or when rawData changes
  useEffect(() => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      setWeeklyData([]);
      return;
    }

    // Get weekly distribution directly from metrics if available
    if (
      metrics &&
      metrics.metrics &&
      metrics.metrics.temporal &&
      metrics.metrics.temporal.weeklyDistribution
    ) {
      processWeeklyDistribution(metrics.metrics.temporal.weeklyDistribution);
    } else {
      // Otherwise, calculate it using the same logic as metrics.js
      calculateWeeklyData(rawData);
    }
  }, [rawData, metrics]);

  // Process weekly distribution from metrics
  const processWeeklyDistribution = (weeklyDistribution) => {
    if (!weeklyDistribution || Object.keys(weeklyDistribution).length === 0) {
      setWeeklyData([]);
      return;
    }

    // Get the regional conversion data to help calculate conversion rates for each week
    const regionData = metrics.metrics.conversion?.regionalData || {};

    // Convert the weekly distribution object to an array
    const weeklyArray = Object.entries(weeklyDistribution).map(
      ([weekKey, count]) => {
        // Split the week key (e.g., "2025-W01")
        const [year, weekCode] = weekKey.split("-");
        const weekNum = parseInt(weekCode.substring(1));

        // Format the week label
        const weekLabel = formatWeekRange(year, weekNum);

        // Filter raw data to get entries for this week
        const weekEntries = rawData.filter((entry) => {
          if (!entry["Date "] && !entry.Date) return false;

          try {
            const entryDate = new Date(entry["Date "] || entry.Date);
            if (isNaN(entryDate)) return false;

            const entryWeekKey = getWeekKey(entryDate);
            return entryWeekKey === weekKey;
          } catch (e) {
            return false;
          }
        });

        // Calculate installations (total mesh nodes installed this week)
        const installations = weekEntries.reduce((total, entry) => {
          return total + (parseInt(entry["Mesh Nodes Installed"]) || 0);
        }, 0);

        // Calculate unique homes
        const uniqueAddresses = new Set();
        weekEntries.forEach((entry) => {
          if (entry.Address) {
            const addressKey = `${entry.Address}, ${entry.City || ""}, ${
              entry["State/Province"] || ""
            }`;
            uniqueAddresses.add(addressKey);
          }
        });
        const uniqueHomes = uniqueAddresses.size || Math.round(count * 0.75); // Fallback if no addresses

        // Calculate conversion rate (installations / certifications)
        // This follows the same logic as in metrics.js conversion calculation
        const conversion = count > 0 ? (installations / count) * 100 : 0;

        return {
          week: weekLabel,
          weekKey: weekKey, // Keep for sorting
          completed: count,
          installations: installations,
          uniqueHomes: uniqueHomes,
          conversion: parseFloat(conversion.toFixed(1)),
        };
      }
    );

    // Sort by week key
    const sortedData = weeklyArray.sort((a, b) =>
      a.weekKey.localeCompare(b.weekKey)
    );

    // Remove the week key from the final output
    const finalData = sortedData.map(({ weekKey, ...rest }) => rest);

    setWeeklyData(finalData);
  };

  // Calculate weekly data from raw data using the same method as metrics.js
  const calculateWeeklyData = (data) => {
    try {
      // Group by week
      const weeklyGroups = {};
      const uniqueHomesWeekly = {};
      const installationsWeekly = {};

      data.forEach((row) => {
        const dateField = row["Date"] || row["Date "];
        if (!dateField) return;

        try {
          const date = new Date(dateField);
          if (isNaN(date)) return;

          // Get weekly key using the same method as metrics.js
          const weekKey = getWeekKey(date);

          // Count certifications
          weeklyGroups[weekKey] = (weeklyGroups[weekKey] || 0) + 1;

          // Count installations
          const nodesInstalled = parseInt(row["Mesh Nodes Installed"]) || 0;
          installationsWeekly[weekKey] =
            (installationsWeekly[weekKey] || 0) + nodesInstalled;

          // Count unique homes using address
          if (row.Address) {
            const addressKey = `${row.Address}, ${row.City || ""}, ${
              row["State/Province"] || ""
            }`;
            if (!uniqueHomesWeekly[weekKey]) {
              uniqueHomesWeekly[weekKey] = new Set();
            }
            uniqueHomesWeekly[weekKey].add(addressKey);
          }
        } catch (e) {
          console.error("Error processing date", e);
        }
      });

      // Create the weekly data array
      const weeklyArray = Object.keys(weeklyGroups).map((weekKey) => {
        // Split the week key
        const [year, weekCode] = weekKey.split("-");
        const weekNum = parseInt(weekCode.substring(1));

        // Format the week label
        const weekLabel = formatWeekRange(year, weekNum);

        // Get total installations for this week
        const installations = installationsWeekly[weekKey] || 0;

        // Get unique homes for this week
        const uniqueHomes = uniqueHomesWeekly[weekKey]
          ? uniqueHomesWeekly[weekKey].size
          : 0;

        // Calculate conversion using the same formula as in metrics.js
        const scans = weeklyGroups[weekKey];
        const conversion = scans > 0 ? (installations / scans) * 100 : 0;

        return {
          week: weekLabel,
          weekKey: weekKey,
          completed: scans,
          installations: installations,
          uniqueHomes: uniqueHomes,
          conversion: parseFloat(conversion.toFixed(1)),
        };
      });

      // Sort by week key
      const sortedData = weeklyArray.sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
      );

      // Remove the week key from the final output
      const finalData = sortedData.map(({ weekKey, ...rest }) => rest);

      setWeeklyData(finalData);
    } catch (error) {
      console.error("Error calculating weekly data:", error);
      setWeeklyData([]);
    }
  };

  /**
   * Get week key in YYYY-Www format (e.g., "2025-W01")
   * Uses the same method as metrics.js
   */
  const getWeekKey = (date) => {
    const getWeekNumber = (d) => {
      const date = new Date(d.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      const week1 = new Date(date.getFullYear(), 0, 4);
      return (
        1 +
        Math.round(
          ((date.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7
        )
      );
    };

    const weekNum = getWeekNumber(date);
    return `${date.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
  };

  /**
   * Format week range for display (e.g., "Jan 1 - Jan 7")
   */
  const formatWeekRange = (year, weekNum) => {
    // Calculate the date of the first day of the week (Monday)
    // Create a date for Jan 4 of the year (which is always in week 1)
    const jan4 = new Date(parseInt(year), 0, 4);

    // Get to the Monday of week 1
    const firstMonday = new Date(jan4);
    firstMonday.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1);

    // Calculate first day of the requested week
    const firstDay = new Date(firstMonday);
    firstDay.setDate(firstMonday.getDate() + (weekNum - 1) * 7);

    // Calculate last day of the week (Sunday)
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);

    // Format the dates
    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    return `${formatDate(firstDay)} - ${formatDate(lastDay)}`;
  };

  // Make sure we have valid data to work with
  const validData = Array.isArray(weeklyData) && weeklyData.length > 0;

  // Custom tooltip to show both conversion and volume metrics
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded text-sm">
          <p className="font-bold mb-1">{label}</p>

          {/* Conversion Rate */}
          <div className="flex items-center mb-1">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: colors.electricBlue }}
            ></div>
            <p className="text-gray-700">
              Conversion:{" "}
              <span className="font-medium">{data.conversion}%</span>
            </p>
          </div>

          {/* Scan Volume */}
          <div className="flex items-center mb-1">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: colors.teal }}
            ></div>
            <p className="text-gray-700">
              Certifications:{" "}
              <span className="font-medium">{data.completed}</span>
            </p>
          </div>

          {/* Installations */}
          <div className="flex items-center mb-1">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: colors.jade }}
            ></div>
            <p className="text-gray-700">
              Mesh Nodes:{" "}
              <span className="font-medium">{data.installations}</span>
            </p>
          </div>

          {/* Unique Homes (if available) */}
          {data.uniqueHomes && (
            <div className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: "#9333ea" }}
              ></div>
              <p className="text-gray-700">
                Unique Homes:{" "}
                <span className="font-medium">{data.uniqueHomes}</span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Find max value for volume metrics to set appropriate scale for second y-axis
  const getMaxVolumeValue = () => {
    if (!validData) return 100;

    return Math.max(
      ...weeklyData.map((week) =>
        Math.max(
          week.completed || 0,
          week.installations || 0,
          week.uniqueHomes || 0
        )
      )
    );
  };

  // Calculate appropriate domain for right axis (volume metrics)
  const maxVolume = getMaxVolumeValue();
  // Add 20% padding to the max value to avoid bars hitting the top
  const volumeDomain = [0, Math.ceil(maxVolume * 1.2)];

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2
          className="text-xl font-bold mb-2 sm:mb-0"
          style={{ color: Colors.ash }}
        >
          Conversion Rate Trend 📈
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Volume Metric Selector */}
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">
              Show Volume:
            </label>
            <select
              value={volumeMetric}
              onChange={(e) => setVolumeMetric(e.target.value)}
              className="p-1 text-xs border border-gray-300 rounded"
            >
              <option value="completed">Certifications</option>
              <option value="installations">Mesh Nodes</option>
              <option value="uniqueHomes">Unique Homes</option>
            </select>
          </div>

          {/* Target Line Controls - Only show if we have data */}
          {validData && (
            <div className="flex items-center mt-2 sm:mt-0">
              <label className="mr-2 text-sm font-medium text-gray-700">
                Target Line:
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setShowTargetLine(!showTargetLine)}
                  className={`px-2 py-1 text-xs rounded-md mr-2 ${
                    showTargetLine
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {showTargetLine ? "On" : "Off"}
                </button>
                <input
                  type="number"
                  value={targetConversion}
                  onChange={(e) =>
                    setTargetConversion(
                      Math.max(0, Math.min(100, Number(e.target.value)))
                    )
                  }
                  disabled={!showTargetLine}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                />
                <span className="ml-1 text-sm text-gray-500">%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart description */}
      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
        <p className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          This chart shows both conversion rate (bars/left axis) and volume
          metrics (line/right axis) together. Low volume periods may show high
          conversion rates but should be interpreted with caution.
        </p>
      </div>

      <div className="h-96">
        {validData ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={weeklyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />

              {/* Left Y-axis for conversion rate (percentage) */}
              <YAxis
                yAxisId="left"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 10 }}
                label={{
                  value: "Conversion Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />

              {/* Right Y-axis for volume metrics (count) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={volumeDomain}
                tick={{ fontSize: 10 }}
                label={{
                  value: "Volume",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Conversion Rate Bars - Left Axis */}
              <Bar
                yAxisId="left"
                dataKey="conversion"
                name="Conversion %"
                fill={colors.electricBlue}
                radius={[4, 4, 0, 0]}
              />

              {/* Volume Line - Right Axis */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={volumeMetric}
                name={
                  volumeMetric === "completed"
                    ? "Certifications"
                    : volumeMetric === "installations"
                    ? "Mesh Nodes"
                    : "Unique Homes"
                }
                stroke={
                  volumeMetric === "completed"
                    ? colors.teal
                    : volumeMetric === "installations"
                    ? colors.jade
                    : "#9333ea"
                } // Purple for unique homes
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />

              {/* Target line for conversion rate */}
              {showTargetLine && (
                <ReferenceLine
                  yAxisId="left"
                  y={targetConversion}
                  stroke="#10B981"
                  strokeDasharray="3 3"
                  label={{
                    position: "right",
                    value: `Target: ${targetConversion}%`,
                    fill: "#10B981",
                    fontSize: 12,
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No data available for the selected date range
            </p>
          </div>
        )}
      </div>

      {validData && (
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div
              className="w-3 h-3 mr-1 rounded-full"
              style={{ backgroundColor: colors.electricBlue }}
            ></div>
            <span>
              Conversion Rate (percentage of certifications resulting in
              installations)
            </span>
          </div>
          <div className="flex items-center">
            <div
              className="w-3 h-3 mr-1 rounded-full"
              style={{
                backgroundColor:
                  volumeMetric === "completed"
                    ? colors.teal
                    : volumeMetric === "installations"
                    ? colors.jade
                    : "#9333ea",
              }}
            ></div>
            <span>
              Volume (
              {volumeMetric === "completed"
                ? "Total Certifications"
                : volumeMetric === "installations"
                ? "Mesh Nodes Installed"
                : "Unique Homes Assessed"}
              )
            </span>
          </div>
        </div>
      )}
      {validData && (
        <div className="mt-3 text-xs text-gray-500">
          <p>
            Note: Weekly data is calculated using the same method as in the
            metrics.js file to ensure consistency.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversionRateChart;
