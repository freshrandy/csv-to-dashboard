// Updated WeeklyProgressChart.js to handle empty or undefined data

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
import Colors from "./Colors";

/**
 * Weekly Progress Chart Component
 * Displays bar chart of weekly scan and installation activity with toggleable metrics
 */
const WeeklyProgressChart = ({ weeklyData }) => {
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
      label: "Unique Homes Assessed",
    },
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
              <Tooltip />
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

export default WeeklyProgressChart;
