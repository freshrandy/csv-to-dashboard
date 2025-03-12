import Papa from "papaparse";

/**
 * Generate cohort analysis data for technician quality metrics
 * @param {string} csvData - CSV data as a string
 * @returns {Object} Processed cohort data for visualization
 */
export function generateQualityMetricsCohort(csvData) {
  // Parse the CSV data
  const parsedData = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const data = parsedData.data;

  // Group by week and employee
  const weeklyData = processWeeklyData(data);

  // Get employee metrics
  const employeeMetrics = calculateEmployeeMetrics(data, weeklyData);

  // Get team stats
  const teamStats = calculateTeamStats(data, employeeMetrics);

  return {
    weeklyData,
    employeeMetrics,
    teamStats,
  };
}

/**
 * Process data to group by week and technician
 */
function processWeeklyData(data) {
  // Group data by week
  const weekGroups = groupBy(data, (row) => {
    if (!row["Date "]) return "unknown";
    const date = new Date(row["Date "]);
    return getWeekKey(date);
  });

  // Format the data for the chart
  const weeklyData = Object.entries(weekGroups)
    .map(([weekKey, rows]) => {
      // Skip unknown week
      if (weekKey === "unknown") return null;

      // Get week label for display
      const weekLabel = formatWeekRange(weekKey);

      // Calculate team average for this week
      const qualityScores = rows
        .filter(
          (row) =>
            row["Quality of Install Score"] !== null &&
            row["Quality of Install Score"] !== undefined
        )
        .map((row) => row["Quality of Install Score"]);

      const teamAvg =
        qualityScores.length > 0 ? calculateAverage(qualityScores) : null;

      // Group by employee
      const employeeGroups = groupBy(rows, "Employee Email");

      // Initial data object with just week and team info
      const weekData = {
        week: weekLabel,
        weekKey,
        teamAvg: teamAvg,
      };

      // Add employee-specific data
      Object.entries(employeeGroups).forEach(([email, empRows]) => {
        if (!email) return; // Skip empty emails

        // Calculate average quality score for this employee this week
        const empScores = empRows
          .filter(
            (row) =>
              row["Quality of Install Score"] !== null &&
              row["Quality of Install Score"] !== undefined
          )
          .map((row) => row["Quality of Install Score"]);

        const avgScore =
          empScores.length > 0 ? calculateAverage(empScores) : null;

        // Add to week data object
        weekData[email] = avgScore;
        weekData[`${email}_count`] = empRows.length;
      });

      return weekData;
    })
    .filter(Boolean); // Remove null entries

  // Sort by week
  return sortBy(weeklyData, "weekKey");
}

/**
 * Calculate metrics for each employee
 */
function calculateEmployeeMetrics(data, weeklyData) {
  // Group all data by employee
  const employeeGroups = groupBy(data, "Employee Email");

  // Calculate metrics for each employee
  const employeeMetrics = {};

  Object.entries(employeeGroups).forEach(([email, rows]) => {
    if (!email) return; // Skip empty emails

    // Count total installations
    const totalInstallations = rows.length;

    // Calculate average score
    const scores = rows
      .filter(
        (row) =>
          row["Quality of Install Score"] !== null &&
          row["Quality of Install Score"] !== undefined
      )
      .map((row) => row["Quality of Install Score"]);

    const avgScore = scores.length > 0 ? calculateAverage(scores) : 0;

    // Calculate improvement (first week to last week)
    const employeeWeekData = weeklyData
      .filter((week) => week[email] !== null && week[email] !== undefined)
      .sort((a, b) => a.weekKey.localeCompare(b.weekKey));

    let improvement = 0;
    let trendDirection = "neutral";

    if (employeeWeekData.length >= 2) {
      const firstScore = employeeWeekData[0][email];
      const lastScore = employeeWeekData[employeeWeekData.length - 1][email];

      // Calculate percentage improvement
      if (firstScore > 0) {
        improvement = ((lastScore - firstScore) / firstScore) * 100;
      } else if (lastScore > 0) {
        improvement = 100; // If started at 0, any improvement is 100%
      }

      // Determine trend direction
      if (improvement >= 10) trendDirection = "strong-up";
      else if (improvement > 0) trendDirection = "up";
      else if (improvement <= -10) trendDirection = "strong-down";
      else if (improvement < 0) trendDirection = "down";
    }

    // Store employee metrics
    employeeMetrics[email] = {
      totalInstallations,
      avgScore,
      improvement,
      trendDirection,
      displayName: formatEmployeeName(email),
    };
  });

  return employeeMetrics;
}

/**
 * Calculate overall team statistics
 */
function calculateTeamStats(data, employeeMetrics) {
  // Total installations
  const totalInstallations = data.length;

  // Overall team average
  const scores = data
    .filter(
      (row) =>
        row["Quality of Install Score"] !== null &&
        row["Quality of Install Score"] !== undefined
    )
    .map((row) => row["Quality of Install Score"]);

  const avgQualityScore = scores.length > 0 ? calculateAverage(scores) : 0;

  // Find top performers (by average score)
  const topPerformers = Object.entries(employeeMetrics)
    .filter(([_, metrics]) => metrics.totalInstallations >= 5) // Min 5 installations
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, 3)
    .map(([email, metrics]) => ({
      email,
      name: metrics.displayName,
      avgScore: metrics.avgScore,
      installCount: metrics.totalInstallations,
    }));

  // Find most improved
  const mostImproved = Object.entries(employeeMetrics)
    .filter(([_, metrics]) => metrics.totalInstallations >= 5) // Min 5 installations
    .sort((a, b) => b[1].improvement - a[1].improvement)
    .slice(0, 3)
    .map(([email, metrics]) => ({
      email,
      name: metrics.displayName,
      improvement: metrics.improvement,
      installCount: metrics.totalInstallations,
    }));

  return {
    totalInstallations,
    avgQualityScore,
    topPerformers,
    mostImproved,
    dateRange: getDateRange(data),
  };
}

/* Utility Functions to replace lodash */

/**
 * Group array by key
 */
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const keyValue = typeof key === "function" ? key(item) : item[key];
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    result[keyValue].push(item);
    return result;
  }, {});
}

/**
 * Calculate average of array
 */
function calculateAverage(array) {
  const sum = array.reduce((total, value) => total + value, 0);
  return sum / array.length;
}

/**
 * Sort array by key
 */
function sortBy(array, key) {
  return [...array].sort((a, b) => {
    const valueA = typeof key === "function" ? key(a) : a[key];
    const valueB = typeof key === "function" ? key(b) : b[key];
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  });
}

/**
 * Utility function to get week key from date
 */
function getWeekKey(date) {
  const year = date.getFullYear();

  // Find the first day of the year
  const firstDayOfYear = new Date(year, 0, 1);

  // Calculate days since first day of year
  const daysSinceFirstDay = Math.floor((date - firstDayOfYear) / 86400000);

  // Calculate week number
  const weekNum = Math.ceil(
    (daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7
  );

  return `${year}-W${weekNum.toString().padStart(2, "0")}`;
}

/**
 * Utility function to format week range for display
 */
function formatWeekRange(weekKey) {
  // Parse year and week from the key (e.g., "2025-W01")
  const [year, weekCode] = weekKey.split("-");
  const weekNum = parseInt(weekCode.substring(1));

  // Create a date object for Jan 1 of the year
  const janFirst = new Date(parseInt(year), 0, 1);

  // Calculate first day of the week
  const daysToFirstWeekday = (8 - janFirst.getDay()) % 7; // Days to first Monday
  const firstDayOfFirstWeek = new Date(janFirst);
  firstDayOfFirstWeek.setDate(janFirst.getDate() + daysToFirstWeekday);

  // Calculate first day of the requested week
  const firstDayOfWeek = new Date(firstDayOfFirstWeek);
  firstDayOfWeek.setDate(firstDayOfFirstWeek.getDate() + (weekNum - 1) * 7);

  // Calculate last day of the week (6 days after first day)
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  // Format the dates
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
}

/**
 * Utility function to format employee name
 */
function formatEmployeeName(email) {
  if (!email) return "Unknown";

  const namePart = email.split("@")[0];
  const nameParts = namePart.split(".");

  if (nameParts.length >= 2) {
    return `${
      nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
    } ${nameParts[1].charAt(0).toUpperCase()}.`;
  }

  return namePart;
}

/**
 * Utility to get date range from data
 */
function getDateRange(data) {
  const dates = data
    .filter((row) => row["Date "])
    .map((row) => new Date(row["Date "]));

  if (dates.length === 0) return "No date data";

  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
}
