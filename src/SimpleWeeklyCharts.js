import React from "react";
import {
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * SimpleWeeklyCharts Component
 * A lightweight chart component that directly uses metrics.js output data
 */
const SimpleWeeklyCharts = ({ metrics, colors }) => {
  // Default colors if not provided
  const defaultColors = {
    teal: "#58DBB9",
    jade: "#4EBAA1",
    electricBlue: "#0066FF",
    ash: "#3D4550",
  };

  // Use provided colors or fallback to defaults
  const chartColors = colors || defaultColors;

  // Check if we have the required data
  if (!metrics || !metrics.metrics || !metrics.metrics.temporal) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
        No weekly data available
      </div>
    );
  }

  // Get the formatted weekly data
  let weeklyData = [];

  // Try to get the pre-formatted data
  if (
    metrics.metrics.temporal.formattedWeeklyData &&
    metrics.metrics.temporal.formattedWeeklyData.length > 0
  ) {
    weeklyData = metrics.metrics.temporal.formattedWeeklyData;
  }
  // Otherwise, try to format it from the weeklyDistribution
  else if (metrics.metrics.temporal.weeklyDistribution) {
    // This would need the formatWeeklyDataForChart function from metrics.js
    console.log("Weekly data not pre-formatted. Using raw distribution.");
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
        Weekly data requires formatting. Check your metrics.js implementation.
      </div>
    );
  }

  // If still no data, show a message
  if (weeklyData.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
        No weekly data available
      </div>
    );
  }

  // Get data with conversion rates
  let weeklyDataWithConversion = [];

  // Try to get pre-calculated conversion data
  if (
    metrics.metrics.temporal.weeklyDataWithConversion &&
    metrics.metrics.temporal.weeklyDataWithConversion.length > 0
  ) {
    weeklyDataWithConversion =
      metrics.metrics.temporal.weeklyDataWithConversion;
  }
  // Otherwise, calculate it
  else {
    weeklyDataWithConversion = weeklyData.map((week) => {
      const conversion =
        week.completed > 0 ? (week.installations / week.completed) * 100 : 0;

      return {
        ...week,
        conversion: parseFloat(conversion.toFixed(1)),
      };
    });
  }

  return (
    <div className="space-y-8">
      {/* Weekly Progress Chart */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: chartColors.ash }}
        >
          Weekly Progress 📅
        </h2>

        <div className="h-64">
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

              <Bar
                dataKey="completed"
                name="Certifications"
                fill={chartColors.teal}
              />
              <Bar
                dataKey="installations"
                name="Mesh Nodes Installed"
                fill={chartColors.jade}
              />
              <Bar
                dataKey="uniqueHomes"
                name="Unique Homes"
                fill={chartColors.electricBlue}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Rate Chart */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: chartColors.ash }}
        >
          Conversion Rate Trend 📈
        </h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={weeklyDataWithConversion}
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
                domain={[0, "auto"]}
                tick={{ fontSize: 10 }}
                label={{
                  value: "Volume",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />

              <Tooltip />
              <Legend />

              {/* Conversion Rate Bars - Left Axis */}
              <Bar
                yAxisId="left"
                dataKey="conversion"
                name="Conversion %"
                fill={chartColors.electricBlue}
                radius={[4, 4, 0, 0]}
              />

              {/* Volume Line - Right Axis */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="completed"
                name="Certifications"
                stroke={chartColors.teal}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SimpleWeeklyCharts;
