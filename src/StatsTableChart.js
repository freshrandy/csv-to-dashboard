import React, { useState } from "react";
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

/**
 * StatsTableChart Component
 * A chart that uses the data directly from the stats table calculations
 * to ensure consistent visualization
 */
const StatsTableChart = ({ weeklyData, colors }) => {
  // State to track which metrics are visible
  const [visibleMetrics, setVisibleMetrics] = useState({
    completed: true,
    installations: true,
    uniqueHomes: true,
  });

  // Toggle visibility of a metric
  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  // Make sure we have valid data to work with
  const validData =
    weeklyData && Array.isArray(weeklyData) && weeklyData.length > 0;

  // Define colors and labels for each metric
  const metricConfig = {
    completed: {
      color: colors?.teal || "#58DBB9",
      label: "Certifications",
    },
    installations: {
      color: colors?.jade || "#4EBAA1",
      label: "Mesh Nodes Installed",
    },
    uniqueHomes: {
      color: colors?.electricBlue || "#0066FF",
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
    <div className="bg-white p-5 rounded-lg shadow-md mb-6">
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: colors?.ash || "#3D4550" }}
      >
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
    </div>
  );
};

export default StatsTableChart;
