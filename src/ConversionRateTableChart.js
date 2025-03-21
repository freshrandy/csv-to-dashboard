import React, { useState } from "react";
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
 * Uses data directly from metrics.js for consistency
 *
 * @param {Object} props
 * @param {Object} props.metrics - Processed metrics data from metrics.js
 * @param {Object} props.colors - Object containing color definitions for styling
 */
const ConversionRateChart = ({ metrics, colors }) => {
  // Extract the weekly data with conversion rates from metrics
  const weeklyData = metrics?.metrics?.temporal?.weeklyDataWithConversion || [];

  // State for target line toggle and value
  const [showTargetLine, setShowTargetLine] = useState(false);
  const [targetConversion, setTargetConversion] = useState(50);

  // State for which volume metric to display
  const [volumeMetric, setVolumeMetric] = useState("completed");

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
    </div>
  );
};

export default ConversionRateChart;
