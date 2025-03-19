import React, { useState, useMemo } from "react";
import Colors from "./Colors";

/**
 * Stats Table Component
 * Displays key statistics in both daily and weekly views
 *
 * @param {Object} props
 * @param {Array} props.data - Raw data from CSV
 * @param {boolean} props.hasAddresses - Whether data contains address information
 */
const StatsTable = ({ data, hasAddresses }) => {
  // State for view toggle
  const [timeView, setTimeView] = useState("daily");

  // Process metrics data when component mounts or when data changes
  const { dailyStats, weeklyStats } = useMemo(() => {
    if (!data || !data.length) {
      return { dailyStats: [], weeklyStats: [] };
    }

    // Utility functions for date handling
    const getDateString = (dateObj) => {
      return dateObj.toISOString().split("T")[0];
    };

    /**
     * Gets the ISO week number for a date
     */
    function getISOWeek(date) {
      // Create a copy of the date to avoid modifying the original
      const d = new Date(date.getTime());

      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));

      // Get first day of year
      const yearStart = new Date(d.getFullYear(), 0, 1);

      // Calculate full weeks to nearest Thursday
      const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

      return weekNum;
    }

    /**
     * Gets the ISO year for a date - the year that "owns" the week
     */
    function getISOYear(date) {
      // Create a copy of the date to avoid modifying the original
      const d = new Date(date.getTime());

      // Get the day and month
      const month = d.getMonth();
      const day = d.getDate();

      // If it's the beginning of January, check if it belongs to the previous year's last week
      if (month === 0 && day < 4) {
        // If the Thursday of this week is in the previous year, use that year
        const thuOffset = 4 - (d.getDay() || 7); // Days until Thursday
        const thu = new Date(d.getTime());
        thu.setDate(day + thuOffset);
        return thu.getFullYear();
      }

      // If it's the end of December, check if it belongs to next year's first week
      if (month === 11 && day >= 29) {
        // If the Thursday of this week is in the next year, use that year
        const thuOffset = 4 - (d.getDay() || 7); // Days until Thursday
        const thu = new Date(d.getTime());
        thu.setDate(day + thuOffset);
        return thu.getFullYear();
      }

      // For all other cases, use the calendar year
      return d.getFullYear();
    }

    /**
     * Gets the ISO week key in YYYY-Www format (e.g., "2025-W01")
     */
    function getISOWeekKey(date) {
      const year = getISOYear(date);
      const week = getISOWeek(date);
      return `${year}-W${week.toString().padStart(2, "0")}`;
    }

    /**
     * Format week range for display (e.g., "Jan 1 - Jan 7")
     */
    function formatWeekRange(weekKey) {
      // Parse year and week from the key (e.g., "2025-W01")
      const [year, weekCode] = weekKey.split("-");
      const weekNum = parseInt(weekCode.substring(1));

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
    }

    // Initialize data structures
    const dailyMap = new Map();
    const weeklyMap = new Map();
    const uniqueHomesByDay = new Map();
    const uniqueHomesByWeek = new Map();

    // Process each row in the data
    data.forEach((row) => {
      // Get the date string - handle both "Date " and "Date" columns
      const dateStr = row["Date "] || row.Date;
      if (!dateStr) return;

      try {
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return; // Skip invalid dates

        // Get date key and week key
        const dateKey = getDateString(dateObj);
        const weekKey = getISOWeekKey(dateObj);

        // Initialize collections if they don't exist
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, {
            date: dateKey,
            displayDate: dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            certifications: 0,
            meshNodesInstalled: 0,
            uniqueHomes: 0,
          });
          uniqueHomesByDay.set(dateKey, new Set());
        }

        if (!weeklyMap.has(weekKey)) {
          weeklyMap.set(weekKey, {
            week: weekKey,
            displayWeek: formatWeekRange(weekKey),
            certifications: 0,
            meshNodesInstalled: 0,
            uniqueHomes: 0,
          });
          uniqueHomesByWeek.set(weekKey, new Set());
        }

        // Update certification counts
        dailyMap.get(dateKey).certifications++;
        weeklyMap.get(weekKey).certifications++;

        // Update mesh nodes installed
        const meshNodes = parseInt(row["Mesh Nodes Installed"]) || 0;
        dailyMap.get(dateKey).meshNodesInstalled += meshNodes;
        weeklyMap.get(weekKey).meshNodesInstalled += meshNodes;

        // Update unique homes tracking - Use the exact method from Dashboard.js
        if (hasAddresses && row.Address) {
          // Use address as unique identifier
          const addressKey = `${row.Address}, ${row.City || ""}, ${
            row["State/Province"] || ""
          }`;
          uniqueHomesByDay.get(dateKey).add(addressKey);
          uniqueHomesByWeek.get(weekKey).add(addressKey);
        } else {
          // Alternative method without addresses
          const dateStr = row["Date "] || row.Date || "";
          const date = new Date(dateStr);
          const formattedDate = !isNaN(date)
            ? date.toISOString().split("T")[0]
            : dateStr;
          const assessmentKey = `${formattedDate}|${row.City || ""}|${
            row["State/Province"] || ""
          }|${row["Quality of Install Score"] || ""}`;
          uniqueHomesByDay.get(dateKey).add(assessmentKey);
          uniqueHomesByWeek.get(weekKey).add(assessmentKey);
        }
      } catch (error) {
        console.error("Error processing date:", error);
      }
    });

    // Update unique homes counts
    for (const [dateKey, uniqueHomes] of uniqueHomesByDay.entries()) {
      dailyMap.get(dateKey).uniqueHomes = uniqueHomes.size;
    }

    for (const [weekKey, uniqueHomes] of uniqueHomesByWeek.entries()) {
      weeklyMap.get(weekKey).uniqueHomes = uniqueHomes.size;
    }

    // Convert to arrays and sort by date (most recent first)
    const dailyArray = Array.from(dailyMap.values()).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const weeklyArray = Array.from(weeklyMap.values()).sort((a, b) =>
      b.week.localeCompare(a.week)
    );

    return {
      dailyStats: dailyArray,
      weeklyStats: weeklyArray,
    };
  }, [data, hasAddresses]);

  // Check if we have data
  const hasNoData =
    !data ||
    data.length === 0 ||
    (dailyStats.length === 0 && weeklyStats.length === 0);

  // Calculate total unique homes across all data for comparison
  const totalUniqueHomes = useMemo(() => {
    if (!data || data.length === 0) return 0;

    const uniqueHomes = new Set();
    data.forEach((row) => {
      if (hasAddresses && row.Address) {
        const addressKey = `${row.Address}, ${row.City || ""}, ${
          row["State/Province"] || ""
        }`;
        uniqueHomes.add(addressKey);
      } else {
        const dateStr = row["Date "] || row.Date || "";
        const date = new Date(dateStr);
        const formattedDate = !isNaN(date)
          ? date.toISOString().split("T")[0]
          : dateStr;
        const assessmentKey = `${formattedDate}|${row.City || ""}|${
          row["State/Province"] || ""
        }|${row["Quality of Install Score"] || ""}`;
        uniqueHomes.add(assessmentKey);
      }
    });

    return uniqueHomes.size;
  }, [data, hasAddresses]);

  // Calculate totals for the current view
  const getTotals = () => {
    const stats = timeView === "daily" ? dailyStats : weeklyStats;

    // For weekly view, we need to recalculate total unique homes across all weeks
    // as simply summing the weekly values would double-count homes that appear in multiple weeks
    if (timeView === "weekly" && data && data.length > 0) {
      // Create a single Set of all unique homes across all data
      const allUniqueHomes = new Set();

      data.forEach((row) => {
        if (hasAddresses && row.Address) {
          const addressKey = `${row.Address}, ${row.City || ""}, ${
            row["State/Province"] || ""
          }`;
          allUniqueHomes.add(addressKey);
        } else {
          const dateStr = row["Date "] || row.Date || "";
          const date = new Date(dateStr);
          const formattedDate = !isNaN(date)
            ? date.toISOString().split("T")[0]
            : dateStr;
          const assessmentKey = `${formattedDate}|${row.City || ""}|${
            row["State/Province"] || ""
          }|${row["Quality of Install Score"] || ""}`;
          allUniqueHomes.add(assessmentKey);
        }
      });

      return {
        certifications: stats.reduce(
          (sum, item) => sum + item.certifications,
          0
        ),
        meshNodesInstalled: stats.reduce(
          (sum, item) => sum + item.meshNodesInstalled,
          0
        ),
        uniqueHomes: allUniqueHomes.size, // Total unique homes across all data
      };
    }

    return {
      certifications: stats.reduce((sum, item) => sum + item.certifications, 0),
      meshNodesInstalled: stats.reduce(
        (sum, item) => sum + item.meshNodesInstalled,
        0
      ),
      // We don't sum unique homes for daily view as this would double-count
      uniqueHomes:
        timeView === "daily"
          ? "−" // Em dash indicates not applicable
          : stats.reduce((sum, item) => sum + item.uniqueHomes, 0),
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
                  {totalUniqueHomes}
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
