import Papa from "papaparse";

/**
 * Generate employee cohort analysis for quality metrics with custom date ranges
 * @param {Array|string} csvData - Parsed CSV data array or CSV string
 * @param {Array} cohorts - Array of cohort objects with { id, label, startDate, endDate }
 * @returns {Object} Processed cohort data for visualization
 */
export function generateEmployeeCohortAnalysis(csvData, cohorts) {
  // Parse the CSV data if provided as a string
  let data;
  if (typeof csvData === "string") {
    const parsedResult = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      trimHeaders: true,
    });
    data = parsedResult.data;
  } else {
    data = csvData; // Assume already parsed
  }

  // If no cohorts specified, return empty data
  if (!cohorts || cohorts.length === 0) {
    return {
      chartData: [],
      cohorts: [],
      summaryStats: {
        totalEmployees: 0,
        totalCohorts: 0,
        averageEmployeesPerCohort: 0,
        dateRange: "No date range",
      },
    };
  }

  // Function to get ISO week number from a date
  function getWeekNumber(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }

  // Format date to get the week key (e.g., "2025-W01")
  function getWeekKey(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const week = getWeekNumber(d);
    return `${year}-W${week.toString().padStart(2, "0")}`;
  }

  // Step 1: Group employees into cohorts based on their first scan within the cohort date range
  const cohortEmployees = {};
  const employeeData = {};
  const employeeCohorts = {}; // Map to track which cohort(s) each employee belongs to

  // Initialize cohorts in our tracking objects
  cohorts.forEach((cohort) => {
    cohortEmployees[cohort.id] = [];
  });

  // First scan through all data to collect employee scans
  data.forEach((row) => {
    // Skip rows without necessary data
    if (
      !row["Employee Email"] ||
      !row["Date "] ||
      row["Quality of Install Score"] === undefined
    )
      return;

    const email = row["Employee Email"];
    const date = new Date(row["Date "]);

    if (isNaN(date.getTime())) return; // Skip invalid dates

    // Store all employee data for later processing
    if (!employeeData[email]) {
      employeeData[email] = [];
    }

    employeeData[email].push({
      date: date,
      qualityScore: row["Quality of Install Score"],
      weekKey: getWeekKey(date),
    });
  });

  // Now assign employees to cohorts based on their first scan date
  Object.entries(employeeData).forEach(([email, scans]) => {
    // Sort scans chronologically
    const sortedScans = [...scans].sort((a, b) => a.date - b.date);

    // Check each cohort to see if this employee belongs in it
    cohorts.forEach((cohort) => {
      const cohortStartDate = new Date(cohort.startDate);
      const cohortEndDate = new Date(cohort.endDate);

      // Check if the employee's first scan falls within this cohort's date range
      const firstScanInRange = sortedScans.find(
        (scan) => scan.date >= cohortStartDate && scan.date <= cohortEndDate
      );

      if (firstScanInRange) {
        // Add this employee to the cohort
        cohortEmployees[cohort.id].push(email);

        // Track which cohort(s) this employee belongs to
        if (!employeeCohorts[email]) {
          employeeCohorts[email] = [];
        }
        employeeCohorts[email].push({
          cohortId: cohort.id,
          firstScanDate: firstScanInRange.date,
        });
      }
    });
  });

  // Step 2: Calculate weekly quality scores for each cohort
  const cohortWeeksSinceProgress = [];

  // Process each cohort
  cohorts.forEach((cohort) => {
    const employeesInCohort = cohortEmployees[cohort.id];

    // Skip if no employees in this cohort
    if (!employeesInCohort || employeesInCohort.length === 0) return;

    // Process each employee in this cohort
    employeesInCohort.forEach((email) => {
      // Find which specific entry in employeeCohorts matches our current cohort
      const cohortEntry = employeeCohorts[email].find(
        (entry) => entry.cohortId === cohort.id
      );
      if (!cohortEntry) return;

      const firstScanDate = cohortEntry.firstScanDate;

      // Process each scan for this employee
      employeeData[email].forEach((scan) => {
        // Calculate weeks since first scan (0 = first week)
        const weeksSince = Math.floor(
          (scan.date - firstScanDate) / (7 * 24 * 60 * 60 * 1000)
        );

        if (weeksSince >= 0) {
          // Only include data from cohort start onwards
          // Find or create entry
          let entry = cohortWeeksSinceProgress.find(
            (e) => e.cohort === cohort.id && e.weeksSince === weeksSince
          );

          if (!entry) {
            entry = {
              cohort: cohort.id,
              cohortLabel: cohort.label,
              weeksSince: weeksSince,
              scores: [],
              employees: new Set(),
              scanCount: 0,
            };
            cohortWeeksSinceProgress.push(entry);
          }

          entry.scores.push(scan.qualityScore);
          entry.employees.add(email);
          entry.scanCount++;
        }
      });
    });
  });

  // Calculate averages for the weeks-since-joining data
  cohortWeeksSinceProgress.forEach((entry) => {
    if (entry.scores.length > 0) {
      entry.avgQualityScore =
        entry.scores.reduce((sum, score) => sum + score, 0) /
        entry.scores.length;
    } else {
      entry.avgQualityScore = null;
    }
    entry.employeeCount = entry.employees.size;
    // Convert Set to Array count
    entry.employees = entry.employees.size;
    // Remove raw scores array
    delete entry.scores;
  });

  // Get enhanced cohort information
  const enhancedCohorts = cohorts.map((cohort) => {
    const employeeCount = cohortEmployees[cohort.id]?.length || 0;

    // Get the most recent data point for this cohort to show the latest score
    const latestData = cohortWeeksSinceProgress
      .filter((entry) => entry.cohort === cohort.id)
      .sort((a, b) => b.weeksSince - a.weeksSince)[0];

    return {
      id: cohort.id,
      label: cohort.label,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      employeeCount: employeeCount,
      latestScore: latestData ? latestData.avgQualityScore : null,
      maxWeekTracked: latestData ? latestData.weeksSince : 0,
    };
  });

  // Group all cohorts and their progress by weeks since joining
  const cohortProgressByWeek = {};

  cohortWeeksSinceProgress.forEach((entry) => {
    if (!cohortProgressByWeek[entry.weeksSince]) {
      cohortProgressByWeek[entry.weeksSince] = {};
    }

    cohortProgressByWeek[entry.weeksSince][entry.cohort] = {
      avgQualityScore: entry.avgQualityScore,
      employeeCount: entry.employeeCount,
      scanCount: entry.scanCount,
    };
  });

  // Transform into chart data format
  const chartData = Object.entries(cohortProgressByWeek)
    .map(([weeksSince, cohorts]) => {
      const dataPoint = {
        weeksSince: parseInt(weeksSince),
        weeksSinceLabel:
          parseInt(weeksSince) === 0 ? "Start" : `Week ${weeksSince}`,
      };

      // Add each cohort's score for this week
      Object.entries(cohorts).forEach(([cohort, data]) => {
        dataPoint[cohort] = data.avgQualityScore;
        // Also add employee count for reference
        dataPoint[`${cohort}_count`] = data.employeeCount;
        dataPoint[`${cohort}_scans`] = data.scanCount;
      });

      return dataPoint;
    })
    .sort((a, b) => a.weeksSince - b.weeksSince);

  // Calculate summary stats
  const allEmployees = new Set();
  Object.values(cohortEmployees).forEach((employees) => {
    employees.forEach((email) => allEmployees.add(email));
  });

  const totalEmployees = allEmployees.size;
  const totalCohorts = enhancedCohorts.filter(
    (c) => c.employeeCount > 0
  ).length;

  // Determine overall date range
  let minDate = null;
  let maxDate = null;

  enhancedCohorts.forEach((cohort) => {
    const startDate = new Date(cohort.startDate);
    const endDate = new Date(cohort.endDate);

    if (!minDate || startDate < minDate) minDate = startDate;
    if (!maxDate || endDate > maxDate) maxDate = endDate;
  });

  // Final cohort analysis data
  return {
    chartData: chartData,
    cohorts: enhancedCohorts,
    summaryStats: {
      totalEmployees: totalEmployees,
      totalCohorts: totalCohorts,
      averageEmployeesPerCohort:
        totalCohorts > 0 ? totalEmployees / totalCohorts : 0,
      dateRange:
        minDate && maxDate
          ? `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`
          : "No date range",
    },
  };
}
