// Updated ConversionRateChart.js to handle empty or undefined data

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
  ReferenceLine,
} from "recharts";
import Colors from "./Colors";

/**
 * Conversion Rate Chart Component
 * Displays bar chart of weekly conversion rate data with target line functionality
 *
 * @param {Array} weeklyData - Array of weekly data points containing conversion rates
 * @param {Object} colors - Object containing color definitions for styling
 */
const ConversionRateChart = ({ weeklyData, colors }) => {
  // State for target line toggle and value
  const [showTargetLine, setShowTargetLine] = useState(false);
  const [targetConversion, setTargetConversion] = useState(50);

  // Make sure we have valid data to work with
  const validData = Array.isArray(weeklyData) && weeklyData.length > 0;

  // Custom tooltip to show both raw values and percentages
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded text-sm">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-gray-700">
            Conversion: <span className="font-medium">{data.conversion}%</span>
          </p>
          <p className="text-gray-700">
            Installs: <span className="font-medium">{data.installations}</span>
          </p>
          <p className="text-gray-700">
            Scans: <span className="font-medium">{data.completed}</span>
          </p>
          {data.uniqueHomes && (
            <p className="text-gray-700">
              Unique Homes:{" "}
              <span className="font-medium">{data.uniqueHomes}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
          Conversion Rate Trend 📈
        </h2>

        {/* Target Line Controls - Only show if we have data */}
        {validData && (
          <div className="flex items-center">
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

      <div className="h-64">
        {validData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Simple bar chart with original blue color */}
              <Bar
                dataKey="conversion"
                name="Conversion %"
                fill={colors.electricBlue}
              />

              {/* Target line */}
              {showTargetLine && (
                <ReferenceLine
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

export default ConversionRateChart;
