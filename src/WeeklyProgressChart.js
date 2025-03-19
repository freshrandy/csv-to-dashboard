import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Colors from "./Colors";

/**
 * Weekly Progress Chart Component
 * Displays bar chart of weekly scan and installation activity with toggleable metrics
 * Uses the EXACT same calculation logic as metrics.js for consistency
 */
const WeeklyProgressChart = ({ rawData, metrics }) => {
  // State for chart data
  const [weeklyData, setWeeklyData] = useState([]);

  // State to track which metrics are visible
  const [visibleMetrics, setVisibleMetrics] = useState({
    completed: true,
    installations: true,
    uniqueHomes: true,
  });

  // Generate weekly data on component mount or when rawData or metrics changes
  useEffect(() => {
    console.log("WeeklyProgressChart: Processing data with updated logic");

    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      console.log("WeeklyProgressChart: No raw data available");
      setWeeklyData([]);
      return;
    }

    // APPROACH 1: Use metrics.temporal data directly if available (most accurate)
    if (
      metrics &&
      metrics.metrics &&
      metrics.metrics.temporal &&
      metrics.metrics.temporal.weeklyDistribution
    ) {
      console.log("WeeklyProgressChart: Using metrics.temporal data directly");
      processMetricsData(metrics);
      return;
    }

    // APPROACH 2: Calculate from raw data using same logic as metrics.js
    console.log("WeeklyProgressChart: Calculating from raw data");
    calculateWeeklyData(rawData);
  }, [rawData, metrics]);

  // Process direct metrics data (preferred approach for accuracy)
  const processMetricsData = (metrics) => {
    try {
      console.log("WeeklyProgressChart: Processing metrics data directly");

      // Get weekly distributions
      const weeklyDistribution = metrics.metrics.temporal.weeklyDistribution;

      // We need to get the same data for installations and unique homes
      // Since these might not be directly available in the metrics, we'll calculate them

      // Get regional data which contains conversion information
      const regionalData = metrics.metrics.conversion?.regionalData || {};

      // Initialize structures for tracking installations and unique homes
      const installationsWeekly = {};
      const uniqueHomesWeekly = {};

      // Calculate installations and unique homes per week from raw data
      // This ensures consistency with metrics.js calculations
      rawData.forEach((entry) => {
        const dateField = entry["Date"] || entry["Date "];
        if (!dateField) return;

        try {
          const date = new Date(dateField);
          if (isNaN(date)) return;

          // Get weekly key using the EXACT same method as metrics.js
          const weekKey = getWeekKeyMetrics(date);

          // Count installations (Mesh Nodes Installed)
          // IMPORTANT: Cast to integer exactly as in metrics.js
          const nodesInstalled = parseInt(entry["Mesh Nodes Installed"]) || 0;
          installationsWeekly[weekKey] =
            (installationsWeekly[weekKey] || 0) + nodesInstalled;

          // Track unique homes using the exact same composite key as metrics.js
          if (!uniqueHomesWeekly[weekKey]) {
            uniqueHomesWeekly[weekKey] = new Set();
          }

          // Create unique address key exactly as in metrics.js
          if (entry.Address) {
            const addressKey = `${entry.Address.trim()}, ${(
              entry.City || ""
            ).trim()}, ${(entry["State/Province"] || "").trim()}`;
            uniqueHomesWeekly[weekKey].add(addressKey);
          }
        } catch (e) {
          console.error("WeeklyProgressChart: Error processing date", e);
        }
      });

      // Convert the weekly distribution object to chart data array
      const weeklyArray = Object.entries(weeklyDistribution).map(
        ([weekKey, count]) => {
          // Format the week label for display
          const weekLabel = formatWeekLabel(weekKey);

          // Get installations for this week
          const installations = installationsWeekly[weekKey] || 0;

          // Get unique homes count
          const uniqueHomes = uniqueHomesWeekly[weekKey]
            ? uniqueHomesWeekly[weekKey].size
            : 0;

          return {
            week: weekLabel,
            weekKey: weekKey, // Keep for sorting
            completed: count,
            installations: installations,
            uniqueHomes: uniqueHomes,
          };
        }
      );

      // Sort by week key for chronological order
      const sortedData = [...weeklyArray].sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
      );

      // Remove the week key from the final output
      const finalData = sortedData.map(({ weekKey, ...rest }) => rest);

      console.log("WeeklyProgressChart: Processed metrics data", finalData);
      setWeeklyData(finalData);
    } catch (error) {
      console.error(
        "WeeklyProgressChart: Error processing metrics data:",
        error
      );
      // Fall back to raw data calculation
      calculateWeeklyData(rawData);
    }
  };

  // Calculate weekly data from raw data using EXACT same methods as metrics.js
  const calculateWeeklyData = (data) => {
    try {
      console.log("WeeklyProgressChart: Calculating from raw data");

      // Group by week exactly as in metrics.js
      const weeklyGroups = {};
      const installationsWeekly = {};
      const uniqueHomesWeekly = {};

      // Filter data to match metrics.js (remove @routethis.com emails, etc.)
      const filteredData = data.filter((row) => {
        // Skip routethis.com email addresses
        if (
          row["Employee Email"] &&
          typeof row["Employee Email"] === "string" &&
          row["Employee Email"].includes("@routethis.com")
        ) {
          return false;
        }
        return true;
      });

      // Process each entry
      filteredData.forEach((row) => {
        const dateField = row["Date"] || row["Date "];
        if (!dateField) return;

        try {
          const date = new Date(dateField);
          if (isNaN(date)) return;

          // Get weekly key using the EXACT same method as metrics.js
          const weekKey = getWeekKeyMetrics(date);

          // Count certifications (each row is one)
          weeklyGroups[weekKey] = (weeklyGroups[weekKey] || 0) + 1;

          // Count installations (Mesh Nodes Installed)
          // Parse as integer exactly as metrics.js does
          const nodesInstalled = parseInt(row["Mesh Nodes Installed"]) || 0;
          installationsWeekly[weekKey] =
            (installationsWeekly[weekKey] || 0) + nodesInstalled;

          // Track unique homes
          if (!uniqueHomesWeekly[weekKey]) {
            uniqueHomesWeekly[weekKey] = new Set();
          }

          // Use exact same address key generation as metrics.js
          if (row.Address) {
            // Trim whitespace as metrics.js would do
            const addressKey = `${row.Address.trim()}, ${(
              row.City || ""
            ).trim()}, ${(row["State/Province"] || "").trim()}`;
            uniqueHomesWeekly[weekKey].add(addressKey);
          }
        } catch (e) {
          console.error("WeeklyProgressChart: Error processing date", e);
        }
      });

      // Convert to array format for the chart
      const weeklyArray = Object.keys(weeklyGroups).map((weekKey) => {
        // Format week label
        const weekLabel = formatWeekLabel(weekKey);

        return {
          week: weekLabel,
          weekKey: weekKey,
          completed: weeklyGroups[weekKey],
          installations: installationsWeekly[weekKey] || 0,
          uniqueHomes: uniqueHomesWeekly[weekKey]
            ? uniqueHomesWeekly[weekKey].size
            : 0,
        };
      });

      // Sort by week key
      const sortedData = [...weeklyArray].sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
      );

      // Remove the week key from the final output
      const finalData = sortedData.map(({ weekKey, ...rest }) => rest);

      console.log("WeeklyProgressChart: Calculated weekly data", finalData);
      setWeeklyData(finalData);
    } catch (error) {
      console.error(
        "WeeklyProgressChart: Error calculating weekly data:",
        error
      );
      setWeeklyData([]);
    }
  };

  /**
   * Get week key in YYYY-Www format (e.g., "2025-W01")
   * Uses the EXACT same method as metrics.js
   */
  const getWeekKeyMetrics = (date) => {
    // Copy the exact function from metrics.js to ensure consistency
    const getWeekNumber = (d) => {
      const date = new Date(d.getTime());
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      // January 4 is always in week 1
      const week1 = new Date(date.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week1
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
   * Format week label from week key for display
   */
  const formatWeekLabel = (weekKey) => {
    // Split the week key (e.g., "2025-W01")
    const [year, weekCode] = weekKey.split("-");
    const weekNum = parseInt(weekCode.substring(1));

    try {
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
    } catch (e) {
      console.error("Error formatting week label:", e);
      return weekKey; // Fall back to the raw week key
    }
  };

  // Toggle visibility of a metric
  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  // Make sure we have valid data to work with
  const validData = Array.isArray(weeklyData) && weeklyData.length > 0;

  // Define colors and labels for each metric
  const metricConfig = {
    completed: {
      color: Colors.teal,
      label: "Certifications",
    },
    installations: {
      color: Colors.jade,
      label: "Mesh Nodes Installed",
    },
    uniqueHomes: {
      color: Colors.electricBlue,
      label: "Unique Homes",
    },
  };

  // Custom tooltip with detailed information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded text-sm">
          <p className="font-bold mb-1">{label}</p>

          {/* Display metrics that are visible */}
          {visibleMetrics.completed && (
            <div className="flex items-center mb-1">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: metricConfig.completed.color }}
              ></div>
              <p className="text-gray-700">
                {metricConfig.completed.label}:{" "}
                <span className="font-medium">{data.completed}</span>
              </p>
            </div>
          )}

          {visibleMetrics.installations && (
            <div className="flex items-center mb-1">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: metricConfig.installations.color }}
              ></div>
              <p className="text-gray-700">
                {metricConfig.installations.label}:{" "}
                <span className="font-medium">{data.installations}</span>
              </p>
            </div>
          )}

          {visibleMetrics.uniqueHomes && (
            <div className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: metricConfig.uniqueHomes.color }}
              ></div>
              <p className="text-gray-700">
                {metricConfig.uniqueHomes.label}:{" "}
                <span className="font-medium">{data.uniqueHomes}</span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Weekly Progress 📅
      </h2>

      {/* Metric toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(metricConfig).map(([metric, config]) => (
          <button
            key={`toggle-${metric}`}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              visibleMetrics[metric]
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
            onClick={() => toggleMetric(metric)}
          >
            <div className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{
                  backgroundColor: config.color,
                  opacity: visibleMetrics[metric] ? 1 : 0.3,
                }}
              />
              {config.label}
              {visibleMetrics[metric] ? " ✓" : " ⨯"}
            </div>
          </button>
        ))}
      </div>

      <div className="h-64">
        {validData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Only render the bars for visible metrics */}
              {visibleMetrics.completed && (
                <Bar
                  dataKey="completed"
                  name={metricConfig.completed.label}
                  fill={metricConfig.completed.color}
                />
              )}

              {visibleMetrics.installations && (
                <Bar
                  dataKey="installations"
                  name={metricConfig.installations.label}
                  fill={metricConfig.installations.color}
                />
              )}

              {visibleMetrics.uniqueHomes && (
                <Bar
                  dataKey="uniqueHomes"
                  name={metricConfig.uniqueHomes.label}
                  fill={metricConfig.uniqueHomes.color}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No data available for the selected date range
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>
          Note: Weekly data is calculated using the same method as in the
          metrics.js file to ensure consistency.
        </p>
      </div>
    </div>
  );
};

export default WeeklyProgressChart;
