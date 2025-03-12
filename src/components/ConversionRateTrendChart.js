import React from "react";
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
import Colors from "../theme/Colors";

/**
 * Conversion Rate Trend Chart Component
 * Displays bar chart of weekly conversion rates over time
 */
const ConversionRateTrendChart = ({ weeklyData }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4" style={{ color: Colors.ash }}>
        Conversion Rate Trend 📈
      </h2>
      <div className="h-64">
        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, "Conversion"]} />
              <Legend />
              <Bar
                dataKey="conversion"
                name="Conversion %"
                fill={Colors.electricBlue}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Insufficient data for conversion trend visualization
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionRateTrendChart;
