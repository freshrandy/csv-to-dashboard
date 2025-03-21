import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const TechnicianQualityChart = ({ cohortData }) => {
  const { weeklyData, employeeMetrics, teamStats } = cohortData;

  // State for target score toggle and value
  const [showTargetLine, setShowTargetLine] = useState(false);
  const [targetScore, setTargetScore] = useState(0.75); // Default to 75%

  // Dynamically filter weekly data based on the maximum date from actual data
  const filterWeeklyData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    // Find the maximum date from the date range in teamStats
    const findMaxDate = () => {
      if (teamStats && teamStats.dateRange) {
        const dateRangeParts = teamStats.dateRange.split(" - ");
        if (dateRangeParts.length > 1) {
          try {
            return new Date(dateRangeParts[1]);
          } catch (e) {
            console.warn("Could not parse date range end date:", e);
          }
        }
      }

      // Fallback to current date minus one day if no valid date found
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return today;
    };

    const maxDate = findMaxDate();
    console.log(
      "TechnicianQualityChart: Maximum date from data:",
      maxDate.toISOString().split("T")[0]
    );

    // Filter weeks based on the maximum date
    return data.filter((week) => {
      // Check if the week label exists
      if (!week.week) return false;

      // Parse the week dates to determine if this week should be included
      try {
        const dateParts = week.week.split(" - ");
        if (dateParts.length === 2) {
          // Extract end date of the week
          const endDateStr = dateParts[1];
          // Add the current year since it's missing in the label
          const currentYear = new Date().getFullYear();
          const endDate = new Date(`${endDateStr} ${currentYear}`);

          // Skip weeks where the end date is after our max date
          if (endDate > maxDate) {
            console.log(
              `Skipping week ${week.week} as it extends beyond max date`
            );
            return false;
          }
        }
      } catch (e) {
        console.warn("Error parsing week dates:", e);
        // If there's an error parsing, we'll include the week to be safe
        return true;
      }

      return true;
    });
  };

  // Apply our filter to weekly data
  const filteredWeeklyData = filterWeeklyData(weeklyData);

  // Filter out test users with @routethis.com emails
  const filteredEmployeeMetrics = Object.entries(employeeMetrics)
    .filter(([email]) => !email.includes("@routethis.com"))
    .reduce((acc, [email, metrics]) => {
      acc[email] = metrics;
      return acc;
    }, {});

  // Get all technicians sorted by installation count
  const techEmails = Object.entries(filteredEmployeeMetrics)
    .sort((a, b) => b[1].totalInstallations - a[1].totalInstallations)
    .map(([email]) => email);

  // State to track which technicians are visible
  const [visibleTechs, setVisibleTechs] = useState(
    techEmails.reduce((acc, email) => {
      acc[email] = false; // All technicians OFF by default
      return acc;
    }, {})
  );

  // Define colors for consistent styling
  const colors = {
    teamAvg: "#7F7F7F",
    targetScore: "#00BA69",
    technicians: {
      // Assign colors to each technician
      ...techEmails.reduce((acc, email, index) => {
        const colorOptions = [
          "#8884d8",
          "#82ca9d",
          "#ffc658",
          "#ff8042",
          "#0088fe",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
        ];
        acc[email] = colorOptions[index % colorOptions.length];
        return acc;
      }, {}),
    },
  };

  // Get technician display names
  const technicianNames = techEmails.reduce((acc, email) => {
    acc[email] = filteredEmployeeMetrics[email].displayName;
    return acc;
  }, {});

  // Show all technicians
  const showAllTechnicians = () => {
    const newVisibility = {};
    techEmails.forEach((email) => {
      newVisibility[email] = true;
    });
    setVisibleTechs(newVisibility);
  };

  // Hide all technicians
  const hideAllTechnicians = () => {
    const newVisibility = {};
    techEmails.forEach((email) => {
      newVisibility[email] = false;
    });
    setVisibleTechs(newVisibility);
  };

  // Toggle single technician
  const toggleTechnician = (email) => {
    setVisibleTechs((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  // Custom tooltip to show both quality score and installation count
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-bold text-sm mb-2">{label}</p>
          {payload.map((entry, index) => {
            // Extract technician name from dataKey if it's a technician metric
            const isInstallCount = entry.dataKey.includes("_count");
            if (isInstallCount) return null; // Skip count entries, we'll handle them with the score

            let displayName = entry.dataKey;
            let count = 0;

            // Handle team average separately
            if (entry.dataKey === "teamAvg") {
              displayName = "Team Average";
            } else {
              // Skip if this technician is toggled off
              if (!visibleTechs[entry.dataKey]) return null;

              // For technician metrics, get the display name and count
              displayName = technicianNames[entry.dataKey] || entry.dataKey;

              // Find the corresponding count entry
              const countPayload = payload.find(
                (p) => p.dataKey === `${entry.dataKey}_count`
              );
              count = countPayload ? countPayload.value : 0;
            }

            return (
              <div
                key={`tooltip-${index}`}
                className="flex justify-between items-center mb-1"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 mr-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{displayName}:</span>
                </div>
                <span className="font-medium ml-2">
                  {entry.value !== null ? (
                    <>
                      {(entry.value * 100).toFixed(0)}%
                      {count > 0 && (
                        <span className="text-gray-500 text-xs ml-1">
                          ({count} certificates)
                        </span>
                      )}
                    </>
                  ) : (
                    "No data"
                  )}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Get trend indicator
  const getTrendIndicator = (trend) => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "strong-up":
        return "⬆️";
      case "strong-down":
        return "⬇️";
      default:
        return "➡️";
    }
  };

  // Handle target score changes
  const handleTargetScoreChange = (e) => {
    const value = parseFloat(e.target.value) / 100;
    setTargetScore(Math.min(1, Math.max(0, value)));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Employee Quality Of Install Over Time 📈
      </h2>

      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-gray-500">Team Average</span>
              <div className="font-medium">
                {(teamStats.avgQualityScore * 100).toFixed(0)}%
              </div>
            </div>

            {/* Target Score Controls */}
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-gray-500">Target Score</span>
              <div className="flex items-center mt-1">
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
                  value={(targetScore * 100).toFixed(0)}
                  onChange={handleTargetScoreChange}
                  disabled={!showTargetLine}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                />
                <span className="ml-1 text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* Technician toggles with Show All / Hide All buttons */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Show/Hide Employees ({techEmails.length} total):
              </h3>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                  onClick={showAllTechnicians}
                >
                  Show All
                </button>
                <button
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
                  onClick={hideAllTechnicians}
                >
                  Hide All
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded">
              {techEmails.map((email) => (
                <button
                  key={`toggle-${email}`}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    visibleTechs[email]
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                  onClick={() => toggleTechnician(email)}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{
                        backgroundColor: colors.technicians[email],
                        opacity: visibleTechs[email] ? 1 : 0.3,
                      }}
                    />
                    {technicianNames[email]}
                    {visibleTechs[email] ? " ✓" : " ⨯"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredWeeklyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            data={filteredWeeklyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />

            {/* Y-axis for quality score (0-1 scale) */}
            <YAxis
              yAxisId="left"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              tick={{ fontSize: 12 }}
              label={{
                value: "Quality Score",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />

            {/* Y-axis for installation count */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, "dataMax + 5"]}
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              label={{
                value: "Installation Count",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Custom Target quality score reference line (only when toggled on) */}
            {showTargetLine && (
              <ReferenceLine
                yAxisId="left"
                y={targetScore}
                stroke={colors.targetScore}
                strokeDasharray="3 3"
                label={{
                  value: `Target (${(targetScore * 100).toFixed(0)}%)`,
                  position: "insideBottomRight",
                  fill: colors.targetScore,
                  fontSize: 12,
                }}
              />
            )}

            {/* Team average line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="teamAvg"
              name="Team Average"
              stroke={colors.teamAvg}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />

            {/* Lines for each technician's quality score */}
            {techEmails.map(
              (email) =>
                visibleTechs[email] && (
                  <Line
                    key={`line-${email}`}
                    yAxisId="left"
                    type="monotone"
                    dataKey={email}
                    name={technicianNames[email]}
                    stroke={colors.technicians[email]}
                    strokeWidth={2}
                    connectNulls={true}
                    dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                    activeDot={{ r: 7 }}
                  />
                )
            )}

            {/* Bars for installation counts */}
            {techEmails.map(
              (email) =>
                visibleTechs[email] && (
                  <Bar
                    key={`bar-${email}`}
                    yAxisId="right"
                    dataKey={`${email}_count`}
                    name={`${technicianNames[email]} Installs`}
                    fill={colors.technicians[email]}
                    opacity={0.3}
                    maxBarSize={20}
                    stackId="installations"
                  />
                )
            )}
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No data available for the selected date range
          </p>
        </div>
      )}

      {/* Display which employees are currently being shown */}
      <div className="mt-4 text-sm text-gray-500">
        <p>
          Currently showing{" "}
          {Object.values(visibleTechs).filter((v) => v).length} of{" "}
          {techEmails.length} employees.
        </p>
      </div>
    </div>
  );
};

export default TechnicianQualityChart;
