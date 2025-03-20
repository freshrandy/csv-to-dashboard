import React, { useState, useMemo } from "react";
import Colors from "./Colors";

/**
 * Stats Table Component
 * Displays key statistics in both daily and weekly views
 * Uses pre-calculated data from metrics.js
 *
 * @param {Object} props
 * @param {Object} props.metrics - Processed metrics data from metrics.js
 */
const StatsTable = ({ metrics }) => {
  // State for view toggle
  const [timeView, setTimeView] = useState("daily");

  // Extract data from metrics object
  const hasData = metrics && 
    metrics.metrics && 
    metrics.metrics.temporal;

  const hasAddresses = metrics?.summary?.hasAddresses || false;
  const dailyStats = hasData ? metrics.metrics.temporal.dailyStats || [] : [];
  const weeklyStats = hasData ? metrics.metrics.temporal.weeklyStats || [] : [];
  const uniqueHomesTotal = metrics?.summary?.uniqueHomes || 0;

  // Determine if we have data to display
  const hasNoData = !hasData || (dailyStats.length === 0 && weeklyStats.length === 0);

  // Calculate totals for the current view
  const getTotals = () => {
    const stats = timeView === "daily" ? dailyStats : weeklyStats;

    return {
      certifications: stats.reduce(
        (sum, item) => sum + item.certifications,
        0
      ),
      meshNodesInstalled: stats.reduce(
        (sum, item) => sum + item.meshNodesInstalled,
        0
      ),
      // For uniqueHomes, we use the overall total from metrics
      uniqueHomes: uniqueHomesTotal,
    };
  };

  const totals = getTotals();

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: Colors.ash }}>
          Certification Statistics Summary 📊
        </h2>

        {/* Toggle between daily and weekly views */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
              timeView === "daily"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTimeView("daily")}
          >
            Daily
          </button>
          <button
            className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
              timeView === "weekly"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTimeView("weekly")}
          >
            Weekly
          </button>
        </div>
      </div>

      {hasNoData ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">
            No data available for statistics display
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {timeView === "daily" ? "Date" : "Week"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mesh Nodes Installed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group relative cursor-help">
                  <div className="flex items-center">Unique Homes</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(timeView === "daily" ? dailyStats : weeklyStats)
                .slice(0, 10)
                .map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {timeView === "daily"
                        ? item.displayDate
                        : item.displayWeek}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.certifications}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.meshNodesInstalled}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.uniqueHomes}
                    </td>
                  </tr>
                ))}

              {/* Summary row */}
              <tr className="bg-blue-50">
                <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                  {totals.certifications}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                  {totals.meshNodesInstalled}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                  {totals.uniqueHomes}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Showing the 10 most recent {timeView === "daily" ? "days" : "weeks"}.
          The total row summarizes all{" "}
          {(timeView === "daily" ? dailyStats : weeklyStats).length}{" "}
          {timeView === "daily" ? "days" : "weeks"} of data.
        </p>
      </div>
    </div>
  );
};

export default StatsTable;