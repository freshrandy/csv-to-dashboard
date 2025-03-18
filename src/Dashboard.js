// React core import
import React, { useState } from "react";

// Utility and styling
import Colors from "./Colors";

// Dashboard header and UI controls
import DashboardHeader from "./DashboardHeader";
import MetricsGlossary from "./MetricsGlossary";

// Core metric components
import ActivityMetrics from "./ActivityMetrics";
import AssessmentQualityIndicators from "./AssessmentQualityIndicators";

// Chart components
import WeeklyProgressChart from "./WeeklyProgressChart";
import ConversionRateChart from "./ConversionRateChart";
import RegionalPerformanceComparison from "./RegionalPerformanceComparison";

// Employee-specific components
import TechnicianQualityChart from "./TechnicianQualityChart";
import EmployeePerformanceTable from "./EmployeePerformanceTable";

const Dashboard = ({
  metrics,
  activeFilterGroup,
  filterGroups,
  onChangeFilter,
}) => {
  // Assessment Quality slider, move to somewhere more logical after.
  const [speedTestThreshold, setSpeedTestThreshold] = useState(80); // Default to 80%

  // Add state for metrics glossary modal
  const [showMetricsGlossary, setShowMetricsGlossary] = useState(false);

  // Exit early if no metrics
  if (!metrics) return null;

  // Extract data from metrics
  const { summary, metrics: metricsData } = metrics;

  // Employee Table Function
  const employeeTableData =
    metrics && metrics.rawData
      ? metrics.rawData.filter(
          (row) =>
            !row["Employee Email"] ||
            !row["Employee Email"].includes("@routethis.com")
        )
      : [];

  // Function to check if the data has employee information
  // Moved out of calculateInstallationMetrics to make it accessible
  const hasEmployeeData = () => {
    if (!metrics || !metrics.rawData || metrics.rawData.length === 0) {
      return false;
    }

    // Check if the data has an "Employee Email" column with valid data
    const hasEmployeeColumn = metrics.rawData.some((row) => {
      return (
        row.hasOwnProperty("Employee Email") || row.hasOwnProperty("Employee")
      );
    });

    // Check if there are actual employee emails in the data
    const hasEmployeeValues = metrics.rawData.some((row) => {
      const email = row["Employee Email"] || row["Employee"];
      return (
        email && typeof email === "string" && !email.includes("@routethis.com")
      );
    });

    return hasEmployeeColumn && hasEmployeeValues;
  };

  // Check if we have address data
  const hasAddresses = summary.hasAddresses;

  // Determine terminology based on data
  const locationTerm = hasAddresses ? "Home" : "Assessment";
  const locationTermPlural = hasAddresses ? "Homes" : "Assessments";

  // Calculate date range from the filtered data
  const calculateActualDateRange = () => {
    if (!employeeTableData || employeeTableData.length === 0) {
      return summary.dateRange || "No date data";
    }

    let minDate = new Date("2099-12-31");
    let maxDate = new Date("1970-01-01");

    employeeTableData.forEach((row) => {
      const dateStr = row["Date "] || row.Date;
      if (dateStr) {
        try {
          const entryDate = new Date(dateStr);
          if (!isNaN(entryDate)) {
            if (entryDate < minDate) minDate = entryDate;
            if (entryDate > maxDate) maxDate = entryDate;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });

    // Make sure we have valid dates
    if (minDate > maxDate) {
      return summary.dateRange || "No date data";
    }

    // Format the dates
    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return `${formatDate(minDate)} to ${formatDate(maxDate)}`;
  };

  // Calculate the actual date range from filtered data
  const actualDateRange = calculateActualDateRange();

  // Client info based on data analysis
  const clientName = "Certify Analysis"; // Could be customized with state input
  const dateRange = actualDateRange; // Use actual date range from filtered data
  const preparedBy = "Randy Panté";

  // Count active employees (unique employees in filtered data)
  const countActiveEmployees = () => {
    if (!employeeTableData || employeeTableData.length === 0) {
      return 0;
    }

    const uniqueEmployees = new Set();
    employeeTableData.forEach((row) => {
      if (
        row["Employee Email"] &&
        !row["Employee Email"].includes("@routethis.com")
      ) {
        uniqueEmployees.add(row["Employee Email"]);
      }
    });

    return uniqueEmployees.size;
  };

  const activeEmployeesCount = countActiveEmployees();

  // Recalculate installation metrics from filtered data
  const calculateInstallationMetrics = () => {
    let totalNodesRecommended = 0;
    let totalNodesInstalled = 0;
    let assessmentsWithInstalls = 0;

    // Count unique addresses/assessments
    const uniqueAssessments = new Set();

    employeeTableData.forEach((row) => {
      // Count nodes
      if (row["Mesh Nodes Recommended"]) {
        totalNodesRecommended += row["Mesh Nodes Recommended"];
      }

      if (row["Mesh Nodes Installed"]) {
        totalNodesInstalled += row["Mesh Nodes Installed"];
      }

      // Count entries with installations
      if (row["Mesh Nodes Installed"] && row["Mesh Nodes Installed"] > 0) {
        assessmentsWithInstalls++;
      }

      // Track unique assessments
      if (hasAddresses && row.Address) {
        const addressKey = `${row.Address}, ${row.City || ""}, ${
          row["State/Province"] || ""
        }`;
        uniqueAssessments.add(addressKey);
      } else {
        // Use other identifying info if addresses not available
        const dateStr = row["Date"] || row["Date "] || "";
        const date = new Date(dateStr);
        const formattedDate = !isNaN(date)
          ? date.toISOString().split("T")[0]
          : dateStr;
        const assessmentKey = `${formattedDate}|${row.City || ""}|${
          row["State/Province"] || ""
        }|${row["Quality of Install Score"] || ""}`;
        uniqueAssessments.add(assessmentKey);
      }
    });

    // Calculate conversion rate
    const totalAssessments = uniqueAssessments.size;
    const homeConversionRate =
      totalAssessments > 0
        ? (assessmentsWithInstalls / totalAssessments) * 100
        : 0;

    // Calculate installation rate
    const installationRate =
      totalNodesRecommended > 0
        ? (totalNodesInstalled / totalNodesRecommended) * 100
        : 0;

    return {
      totalNodesRecommended,
      totalNodesInstalled,
      installationRate,
      assessmentsWithInstalls,
      totalAssessments,
      homeConversionRate,
    };
  };

  const installationMetrics = calculateInstallationMetrics();

  // Calculate performance metrics from filtered data
  const calculatePerformanceMetrics = () => {
    let totalRoomsTested = 0;
    let totalExpectedSpeed = 0;
    let totalActualSpeed = 0;
    let speedTestCount = 0;
    let successfulSpeedTests = 0;
    let totalQualityScore = 0;
    let qualityScoreCount = 0;

    employeeTableData.forEach((row) => {
      if (row["Rooms Tested"]) {
        totalRoomsTested += row["Rooms Tested"];
      }

      if (row["Expected Speed"] && row["Actual Speed"]) {
        totalExpectedSpeed += row["Expected Speed"];
        totalActualSpeed += row["Actual Speed"];
        speedTestCount++;

        // Use dynamic threshold instead of hardcoded 80%
        if (
          row["Actual Speed"] >=
          (speedTestThreshold / 100) * row["Expected Speed"]
        ) {
          successfulSpeedTests++;
        }
      }

      if (
        row["Quality of Install Score"] !== null &&
        row["Quality of Install Score"] !== undefined
      ) {
        totalQualityScore += row["Quality of Install Score"];
        qualityScoreCount++;
      }
    });

    // Calculate averages
    const avgRoomsTested =
      employeeTableData.length > 0
        ? totalRoomsTested / employeeTableData.length
        : 0;
    const speedTestSuccessRate =
      speedTestCount > 0
        ? parseFloat(((successfulSpeedTests / speedTestCount) * 100).toFixed(1))
        : 0;
    const avgQualityScore =
      qualityScoreCount > 0 ? totalQualityScore / qualityScoreCount : 0;

    return {
      avgRoomsTested,
      speedTestSuccessRate,
      avgQualityScore,
    };
  };

  const performanceMetrics = calculatePerformanceMetrics();

  // Calculate multi-floor assessment metrics
  const calculateMultiFloorAssessments = () => {
    if (!employeeTableData || employeeTableData.length === 0) {
      return {
        multiFloorCount: 0,
        singleFloorCount: 0,
        multiFloorPercentage: 0,
        singleFloorPercentage: 0,
      };
    }

    let multiFloorCount = 0;
    let singleFloorCount = 0;

    employeeTableData.forEach((row) => {
      // Check if this assessment covered multiple floors
      // Assuming an assessment is multi-floor if Levels Tested > 1 (or Total Levels > 1 as backup)
      if (
        (row["Levels Tested"] && row["Levels Tested"] > 1) ||
        (row["Total Levels"] && row["Total Levels"] > 1)
      ) {
        multiFloorCount++;
      } else {
        singleFloorCount++;
      }
    });

    const total = multiFloorCount + singleFloorCount;

    // Round the percentages to 1 decimal place within the function
    const multiFloorPercentage =
      total > 0 ? parseFloat(((multiFloorCount / total) * 100).toFixed(1)) : 0;

    const singleFloorPercentage =
      total > 0 ? parseFloat(((singleFloorCount / total) * 100).toFixed(1)) : 0;

    return {
      multiFloorCount,
      singleFloorCount,
      multiFloorPercentage,
      singleFloorPercentage,
    };
  };

  // Calculate regional statistics from filtered data - with handling for missing regions
  const calculateRegionalData = () => {
    // Group by region
    const regionGroups = {};

    // Track total counts for verification
    let totalCertifications = 0;
    let totalInstallations = 0;

    employeeTableData.forEach((row) => {
      // Normalize region name, using "Unknown Region" if not specified
      const region = row["State/Province"]
        ? row["State/Province"]
        : "Unknown Region";

      // Initialize region if doesn't exist
      if (!regionGroups[region]) {
        regionGroups[region] = {
          certifications: 0,
          installations: 0,
        };
      }

      // Count certification
      regionGroups[region].certifications++;
      totalCertifications++;

      // Count installation
      if (row["Mesh Nodes Installed"]) {
        const nodesInstalled = row["Mesh Nodes Installed"] || 0;
        regionGroups[region].installations += nodesInstalled;
        totalInstallations += nodesInstalled;
      }
    });

    // Calculate conversion rates and create final data
    const regionData = Object.entries(regionGroups).map(([name, data]) => {
      return {
        name,
        certifications: data.certifications,
        installations: data.installations,
        conversion:
          data.certifications > 0
            ? (data.installations / data.certifications) * 100
            : 0,
      };
    });

    // Sort by certifications (highest first)
    const sortedData = regionData.sort(
      (a, b) => b.certifications - a.certifications
    );

    // Log verification totals
    console.log(`Regional data verification: 
    - Total entries in filtered data: ${employeeTableData.length}
    - Total certifications counted: ${totalCertifications}
    - Total installations counted: ${totalInstallations}
    - Should match installations metric: ${installationMetrics.assessmentsWithInstalls}`);

    return sortedData;
  };

  const regionalData = calculateRegionalData();

  // Activity metrics - Recalculated from filtered data
  const activityMetrics = {
    uniqueVisits: installationMetrics.totalAssessments,
    totalScans: employeeTableData.length,
    accessPoints: {
      installed: installationMetrics.totalNodesInstalled,
      recommended: installationMetrics.totalNodesRecommended,
      percentage: parseFloat(installationMetrics.installationRate.toFixed(2)),
    },
    conversionRate: {
      value: parseFloat(installationMetrics.homeConversionRate.toFixed(2)),
      homes: installationMetrics.assessmentsWithInstalls,
      total: installationMetrics.totalAssessments,
    },
    avgRooms: parseFloat(performanceMetrics.avgRoomsTested.toFixed(2)),
    multiFloorRate: 35.0, // Placeholder - not directly available in our metrics
    speedTestSuccessRate: parseFloat(
      performanceMetrics.speedTestSuccessRate.toFixed(2)
    ),
    activeEmployees: activeEmployeesCount, // Use actual count from filtered data
  };

  /**
   * Improved utility function to format week range for display
   * Updated to handle all possible week keys
   */
  function formatWeekLabel(weekKey) {
    try {
      // Parse year and week from the key (e.g., "2025-W01")
      const [year, weekCode] = weekKey.split("-");
      if (!year || !weekCode) {
        return weekKey; // Return original if can't parse
      }

      const weekNum = parseInt(weekCode.substring(1));
      if (isNaN(weekNum)) {
        return weekKey; // Return original if week is not a number
      }

      // Create a date object for Jan 1 of the year
      const janFirst = new Date(parseInt(year), 0, 1);

      // Calculate first day of the week (Monday)
      // Get to the first Monday of the year
      const firstMonday = new Date(
        parseInt(year),
        0,
        1 + ((8 - janFirst.getDay()) % 7)
      );

      // Calculate first day of the requested week
      const firstDayOfWeek = new Date(firstMonday);
      firstDayOfWeek.setDate(firstMonday.getDate() + (weekNum - 1) * 7);

      // Calculate last day of the week (Sunday)
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

      // Format the dates
      const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      };

      return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
    } catch (error) {
      console.warn(`Error formatting week label for ${weekKey}:`, error);
      return weekKey; // Return original on error
    }
  }

  /**
   * Helper function to get ISO week number from a date
   */
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

  /**
   * Gets the ISO week and year for a date
   */
  function getWeekYear(date) {
    // Create a new date object for the Thursday in this week
    // (weeks are defined by ISO as having Thursday as the 4th day)
    const thursdayDate = new Date(date);
    thursdayDate.setDate(date.getDate() + (4 - (date.getDay() || 7)));

    // Get the year for that Thursday
    const year = thursdayDate.getFullYear();

    // Get the week number
    const firstThursday = new Date(year, 0, 4); // First Thursday of the year
    const weekNum =
      1 +
      Math.round(
        ((thursdayDate - firstThursday) / 86400000 -
          ((thursdayDate.getDay() + 6) % 7) / 7 +
          ((firstThursday.getDay() + 6) % 7) / 7) /
          7
      );

    return { year, week: weekNum };
  }

  // Weekly Data with fixed implementation to include all dates
  const weeklyData = (() => {
    // Initialize distribution structure
    const weeklyDistribution = {};

    // Build distribution from filtered data
    employeeTableData.forEach((row) => {
      const dateStr = row["Date "] || row.Date;
      if (!dateStr) return;

      try {
        const entryDate = new Date(dateStr);
        if (isNaN(entryDate)) return;

        // Get week key
        const weekInfo = getWeekYear(entryDate);
        const weekKey = `${weekInfo.year}-W${weekInfo.week
          .toString()
          .padStart(2, "0")}`;

        // Add to distribution
        weeklyDistribution[weekKey] = (weeklyDistribution[weekKey] || 0) + 1;
      } catch (e) {
        // Skip invalid dates
      }
    });

    // If we don't have weekly data, return an empty array
    if (Object.keys(weeklyDistribution).length === 0) {
      return [];
    }

    // Process the real weekly data
    const processedData = [];

    // Use the raw data that's already available in metrics
    const rawData = employeeTableData || [];

    // Find actual min and max dates in the filtered raw data
    let minDate = new Date("2099-12-31");
    let maxDate = new Date("1970-01-01");

    rawData.forEach((entry) => {
      const dateStr = entry["Date "] || entry.Date;
      if (dateStr) {
        try {
          const entryDate = new Date(dateStr);
          if (!isNaN(entryDate)) {
            if (entryDate < minDate) minDate = entryDate;
            if (entryDate > maxDate) maxDate = entryDate;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });

    // Make sure we have valid dates
    if (minDate > maxDate) {
      console.warn("No valid dates found in data");
      return [];
    }

    // Get the ISO week and year for min and max dates
    const startWeekInfo = getWeekYear(minDate);
    const endWeekInfo = getWeekYear(maxDate);

    // Generate all week keys between start and end
    const allWeekKeys = [];
    let currentYear = startWeekInfo.year;
    let currentWeek = startWeekInfo.week;

    while (
      currentYear < endWeekInfo.year ||
      (currentYear === endWeekInfo.year && currentWeek <= endWeekInfo.week)
    ) {
      allWeekKeys.push(
        `${currentYear}-W${currentWeek.toString().padStart(2, "0")}`
      );

      // Move to next week
      currentWeek++;
      if (currentWeek > 52) {
        currentWeek = 1;
        currentYear++;
      }
    }

    // Sort the week keys to ensure chronological order
    const sortedWeeks = [
      ...new Set([...Object.keys(weeklyDistribution), ...allWeekKeys]),
    ].sort();

    // Process each week
    sortedWeeks.forEach((weekKey) => {
      // Get the week label
      const weekLabel = formatWeekLabel(weekKey);

      // Get the number of scans for this week from the distribution, or default to 0
      const scans = weeklyDistribution[weekKey] || 0;

      // For installations and unique homes, use real data
      let installations = 0;
      let uniqueHomes = 0;

      // Process raw data for this week directly
      if (rawData && rawData.length > 0) {
        // Get entries for this week from the raw data
        const weekData = rawData.filter((entry) => {
          if (!entry["Date "] && !entry.Date) return false;

          try {
            const entryDate = new Date(entry["Date "] || entry.Date);
            if (isNaN(entryDate)) return false; // Skip invalid dates

            const entryWeekInfo = getWeekYear(entryDate);
            const entryWeekKey = `${entryWeekInfo.year}-W${entryWeekInfo.week
              .toString()
              .padStart(2, "0")}`;

            return entryWeekKey === weekKey;
          } catch (e) {
            return false; // Skip entries with date parsing issues
          }
        });

        // Count actual installations (mesh nodes > 0)
        installations = weekData.reduce((total, entry) => {
          return total + (entry["Mesh Nodes Installed"] || 0);
        }, 0);

        // Count unique addresses for this week if we have address data
        if (hasAddresses) {
          const uniqueAddresses = new Set();
          weekData.forEach((entry) => {
            if (entry.Address) {
              const addressKey = `${entry.Address}, ${entry.City || ""}, ${
                entry["State/Province"] || ""
              }`;
              uniqueAddresses.add(addressKey);
            }
          });
          uniqueHomes = uniqueAddresses.size;
        } else {
          // If no address data, estimate based on scans
          uniqueHomes = Math.round(scans * 0.8);
        }
      } else {
        // Fallback calculation if raw data isn't available
        const avgConversionRate = installationMetrics.homeConversionRate / 100;
        installations = Math.round(scans * avgConversionRate);
        uniqueHomes = Math.round(scans * 0.8);
      }

      // Calculate conversion rate
      const conversion = scans > 0 ? (installations / scans) * 100 : 0;

      // Only include weeks that actually have data
      if (scans > 0 || installations > 0 || uniqueHomes > 0) {
        // Create the week data point
        processedData.push({
          week: weekLabel,
          completed: scans,
          installations: installations,
          conversion: parseFloat(conversion.toFixed(1)),
          uniqueHomes: uniqueHomes,
        });
      }
    });

    return processedData;
  })();

  // Speed Test Performance
  const speedTestData = [
    {
      name: `Above ${speedTestThreshold}% of Plan`,
      value: performanceMetrics.speedTestSuccessRate,
      color: Colors.primary[400],
    },
    {
      name: `Below ${speedTestThreshold}% of Plan`,
      value: parseFloat(
        (100 - performanceMetrics.speedTestSuccessRate).toFixed(1)
      ),
      color: Colors.status.error,
    },
  ];

  // Multi-Floor Assessment - get real data from calculation
  const floorAssessments = calculateMultiFloorAssessments();
  const floorData = [
    {
      name: "Multi-Floor Assessments",
      value: parseFloat(floorAssessments.multiFloorPercentage.toFixed(1)),
      color: Colors.secondary[500], // Use our new color system
    },
    {
      name: "Single-Floor Assessments",
      value: parseFloat(floorAssessments.singleFloorPercentage.toFixed(1)),
      color: Colors.gray[200], // Use our new color system
    },
  ];

  return (
    <div
      className="p-6 w-full bg-gray-50"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Use our new DashboardHeader component */}
      <DashboardHeader
        clientName={clientName}
        dateRange={dateRange}
        activeFilterGroup={activeFilterGroup}
        filterGroups={filterGroups}
        onChangeFilter={onChangeFilter}
        onOpenGlossary={() => setShowMetricsGlossary(true)}
        hasEmployeeData={hasEmployeeData()}
      />

      <div className="flex flex-col gap-6">
        {/* ActivityMetrics component with enhanced styling */}
        <ActivityMetrics
          metrics={activityMetrics}
          hasAddresses={hasAddresses}
        />

        {/* Weekly Progress Chart - will gradually update this component */}
        <WeeklyProgressChart weeklyData={weeklyData} />

        {/* Conversion Rate Chart - now using Colors directly */}
        <ConversionRateChart weeklyData={weeklyData} colors={Colors} />

        {/* Regional Performance - using Colors directly */}
        <RegionalPerformanceComparison
          regionalData={regionalData}
          colors={Colors}
        />

        {/* Assessment Quality Indicators - using Colors directly */}
        <AssessmentQualityIndicators
          speedTestData={speedTestData}
          floorData={floorData}
          colors={Colors}
          speedTestThreshold={speedTestThreshold}
          onSpeedTestThresholdChange={(newThreshold) => {
            setSpeedTestThreshold(newThreshold);
            // Recalculate metrics with new threshold
            // This will cause performanceMetrics and speedTestData to update
          }}
        />
      </div>

      {/* Employee Performance Table */}
      {hasEmployeeData() ? (
        <div className="mt-8">
          <EmployeePerformanceTable
            data={employeeTableData}
            dateRange={dateRange}
          />
        </div>
      ) : (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Employee Performance Table Not Available
              </h3>
              <p className="text-sm text-gray-600">
                Employee performance rankings could not be displayed because the
                uploaded CSV file doesn't contain employee data. To view
                employee performance metrics, please upload a CSV file that
                includes an "Employee Email" column with valid employee emails.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quality metrics */}
      {metrics.qualityCohort && hasEmployeeData() ? (
        <div className="mt-8">
          <TechnicianQualityChart
            cohortData={metrics.qualityCohort}
            filteredData={employeeTableData}
            dateRange={dateRange}
          />
        </div>
      ) : metrics.qualityCohort ? (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Employee Quality Data Not Available
              </h3>
              <p className="text-sm text-gray-600">
                Employee quality metrics could not be displayed because the
                uploaded CSV file doesn't contain employee data. To view
                employee performance charts, please upload a CSV file that
                includes an "Employee Email" column with valid employee emails.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer with gradient using our new color system */}
      <div
        className="mt-8 p-4 rounded-lg text-white text-center"
        style={{ background: Colors.gradients.primary }}
      >
        <div className="text-center">
          <span>Dashboard by {preparedBy}</span>
        </div>
      </div>

      {/* Metrics Glossary Modal */}
      <MetricsGlossary
        isOpen={showMetricsGlossary}
        onClose={() => setShowMetricsGlossary(false)}
      />
    </div>
  );
};

export default Dashboard;
