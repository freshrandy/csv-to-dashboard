import React from "react";
import WeeklyProgressChart from "./WeeklyProgressChart";
import TechnicianQualityChart from "./TechnicianQualityChart";
import EmployeePerformanceTable from "./EmployeePerformanceTable";
import EmployeeQualityCohortTable from "./EmployeeQualityCohortTable";
import ConversionRateChart from "./ConversionRateChart";
import RegionalPerformanceComparison from "./RegionalPerformanceComparison";
import AssessmentQualityIndicators from "./AssessmentQualityIndicators";
import ActivityMetrics from "./ActivityMetrics";

const Dashboard = ({ metrics }) => {
  // Exit early if no metrics
  if (!metrics) return null;

  // Extract data from metrics
  const { summary, metrics: metricsData } = metrics;

  // Fix 2025-03-11, possible spaghetti
  const employeeTableData =
    metrics && metrics.rawData
      ? metrics.rawData.filter(
          (row) =>
            !row["Employee Email"] ||
            !row["Employee Email"].includes("@routethis.com")
        )
      : [];

  // Check if we have address data
  const hasAddresses = summary.hasAddresses;

  // Determine terminology based on data
  const locationTerm = hasAddresses ? "Home" : "Assessment";
  const locationTermPlural = hasAddresses ? "Homes" : "Assessments";

  // Brand Colors
  const colors = {
    teal: "#58DBB9", // Primary
    jade: "#4EBAA1", // Secondary
    ash: "#3D4550", // Background dark
    electricBlue: "#0066FF", // Accent
    digitalYellow: "#D6FC51", // Accent
    slate: "#20242A", // Background darker
    cloudGrey: "#EEF2F6", // Background light
  };

  // Client info based on data analysis
  const clientName = "Certify Analysis"; // Could be customized with state input
  const dateRange = summary.dateRange;
  const preparedBy = "Randy Panté";

  // Activity metrics - Pulled from metrics data
  const activityMetrics = {
    uniqueVisits: summary.uniqueHomes,
    totalScans: summary.totalEntries,
    accessPoints: {
      installed: metricsData.installation.totalNodesInstalled,
      recommended: metricsData.installation.totalNodesRecommended,
      percentage: parseFloat(metricsData.installation.installationRate),
    },
    conversionRate: {
      value: parseFloat(metricsData.conversion.homeConversionRate),
      homes: Math.round(
        (summary.uniqueHomes *
          parseFloat(metricsData.conversion.homeConversionRate)) /
          100
      ),
      total: summary.uniqueHomes,
    },
    avgRooms: parseFloat(metricsData.performance.averageRoomsTested),
    multiFloorRate: 35.0, // Placeholder - not directly available in our metrics
    speedTestSuccessRate: parseFloat(
      metricsData.performance.speedTestSuccessRate
    ),
    // Revenue impact section removed
  };

  // Format week keys into readable date ranges
  const formatWeekLabel = (weekKey) => {
    // Parse the year and week number from the key (e.g., "2025-W01")
    const [year, weekCode] = weekKey.split("-");
    const weekNum = parseInt(weekCode.substring(1));

    // Create a date for the first day of the year
    const firstDayOfYear = new Date(parseInt(year), 0, 1);

    // Calculate the first day of the week
    // Week 1 is the week with January 4th in it per ISO
    const firstDayOfWeek = new Date(firstDayOfYear);
    firstDayOfWeek.setDate(
      firstDayOfYear.getDate() +
        (4 - firstDayOfYear.getDay()) +
        (weekNum - 1) * 7
    );

    // Calculate the last day of the week (6 days later)
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
  };

  // Weekly Data
  const weeklyData = (() => {
    const weeklyDistribution = metricsData.temporal.weeklyDistribution;

    // If we don't have weekly data, return an empty array
    if (!weeklyDistribution || Object.keys(weeklyDistribution).length === 0) {
      return [];
    }

    // Process the real weekly data
    const processedData = [];

    // Dynamically determine the maximum date from the summary or raw data
    const findMaxDate = () => {
      // Try to extract from the date range in the summary
      if (summary.dateRange) {
        const dateRangeParts = summary.dateRange.split(" to ");
        if (dateRangeParts.length > 1) {
          try {
            return new Date(dateRangeParts[1]);
          } catch (e) {
            console.warn("Could not parse date range end date:", e);
          }
        }
      }

      // If that doesn't work, find the maximum date in the raw data
      if (metrics.rawData && metrics.rawData.length > 0) {
        let maxDate = new Date(0); // Start with oldest possible date

        metrics.rawData.forEach((entry) => {
          const dateStr = entry["Date "] || entry.Date;
          if (dateStr) {
            try {
              const entryDate = new Date(dateStr);
              if (!isNaN(entryDate) && entryDate > maxDate) {
                maxDate = entryDate;
              }
            } catch (e) {
              // Skip invalid dates
            }
          }
        });

        if (maxDate.getTime() > 0) {
          return maxDate;
        }
      }

      // Fallback to current date minus one day if no valid dates found
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return today;
    };

    const maxDate = findMaxDate();
    console.log("Maximum date from data:", maxDate.toISOString().split("T")[0]);

    // Sort the week keys to ensure chronological order
    const sortedWeeks = Object.keys(weeklyDistribution).sort();

    // Use the raw data that's already available in metrics
    const rawData = metrics.rawData || [];

    // Process each week
    sortedWeeks.forEach((weekKey) => {
      // Get the week label
      const weekLabel = formatWeekLabel(weekKey);

      // Parse the week dates to determine if this week should be included
      try {
        const dateParts = weekLabel.split(" - ");
        if (dateParts.length === 2) {
          // Extract end date of the week
          const endDateStr = dateParts[1];
          // Add the current year since it's missing in the label
          const currentYear = new Date().getFullYear();
          const endDate = new Date(`${endDateStr} ${currentYear}`);

          // Skip weeks where the end date is after our max date
          if (endDate > maxDate) {
            console.log(
              `Skipping week ${weekLabel} as it extends beyond max date`
            );
            return;
          }
        }
      } catch (e) {
        console.warn("Error parsing week dates:", e);
        // If there's an error parsing, we'll include the week to be safe
      }

      // Get the number of scans for this week
      const scans = weeklyDistribution[weekKey];

      // For installations and unique homes, let's use real data if available
      let installations = 0;
      let uniqueHomes = 0;

      // Use the already-calculated conversion rate
      const avgConversionRate =
        parseFloat(metricsData.conversion.homeConversionRate) / 100;

      // If raw data is available, use it for more accurate calculations
      if (rawData && rawData.length > 0) {
        // Get entries for this week from the raw data
        const weekData = rawData.filter((entry) => {
          if (!entry["Date "] && !entry.Date) return false;
          const entryDate = new Date(entry["Date "] || entry.Date);
          if (isNaN(entryDate)) return false; // Skip invalid dates

          // Skip data after max date
          if (entryDate > maxDate) return false;

          const [year, weekCode] = weekKey.split("-");
          const weekNum = parseInt(weekCode.substring(1));
          return (
            getWeekNumber(entryDate) === weekNum &&
            entryDate.getFullYear().toString() === year
          );
        });

        // Count actual installations (mesh nodes > 0)
        installations = weekData.filter(
          (entry) =>
            entry["Mesh Nodes Installed"] && entry["Mesh Nodes Installed"] > 0
        ).length;

        // Count unique addresses for this week if we have address data
        if (summary.hasAddresses) {
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
        // If raw data is not available, use calculations based on the avg conversion rate
        installations = Math.round(scans * avgConversionRate);
        uniqueHomes = Math.round(scans * 0.8);
      }

      // Calculate conversion rate
      const conversion = scans > 0 ? (installations / scans) * 100 : 0;

      // Create the week data point
      processedData.push({
        week: weekLabel,
        completed: scans,
        installations: installations,
        conversion: parseFloat(conversion.toFixed(1)),
        uniqueHomes: uniqueHomes,
      });
    });

    return processedData;
  })();

  // Helper function to get ISO week number from a date - add if it doesn't exist already
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

  // Regional Performance Data - from metrics
  const regionalData = [];

  // Check if we have the enhanced region data from our metrics.js update
  if (metricsData.conversion.regionalData) {
    console.log("Using actual region data from metrics");

    Object.entries(metricsData.conversion.regionalData).forEach(
      ([region, data]) => {
        regionalData.push({
          name: region,
          certifications: data.certifications,
          installations: data.installations,
          conversion: parseFloat(data.conversionRate),
        });
      }
    );
  } else {
    console.log("Falling back to estimates based on conversion rates");

    // Fall back to using the conversion rates
    Object.entries(metricsData.conversion.regionalConversion).forEach(
      ([region, rate]) => {
        // Default values if not available
        const conversionRate = parseFloat(rate);
        const certifications = Math.round(50 + Math.random() * 50); // 50-100 range
        const installations = Math.round(
          (certifications * conversionRate) / 100
        );

        regionalData.push({
          name: region,
          certifications,
          installations,
          conversion: conversionRate,
        });
      }
    );
  }

  // Sort by certifications (highest first)
  regionalData.sort((a, b) => b.certifications - a.certifications);

  // Speed Test Performance
  const speedTestData = [
    {
      name: "Above 80% of Plan",
      value: parseFloat(metricsData.performance.speedTestSuccessRate),
      color: colors.jade,
    },
    {
      name: "Below 80% of Plan",
      value: 100 - parseFloat(metricsData.performance.speedTestSuccessRate),
      color: "#EF4444",
    },
  ];

  // Multi-Floor Assessment
  const floorData = [
    {
      name: "Multi-Floor Assessments",
      value: 35.0, // Placeholder - not directly available in our metrics
      color: colors.electricBlue,
    },
    { name: "Single-Floor Assessments", value: 65.0, color: colors.cloudGrey },
  ];

  // Background gradient style
  const gradientBg = {
    background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.electricBlue} 100%)`,
    opacity: 0.95,
  };

  return (
    <div
      className="p-6 w-full bg-gray-50"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Header with gradient background */}
      <div className="rounded-lg shadow-lg mb-8" style={{ overflow: "hidden" }}>
        <div className="p-6 text-white" style={gradientBg}>
          <div className="mb-2">
            <h1 className="text-3xl font-bold">{clientName} Dashboard</h1>
          </div>
          <p className="opacity-90">{dateRange}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Activity Metrics Section - Using the ActivityMetrics component */}
        <ActivityMetrics
          metrics={activityMetrics}
          hasAddresses={hasAddresses}
          colors={colors}
        />

        {/* Weekly Progress Chart */}
        <WeeklyProgressChart weeklyData={weeklyData} />

        {/* Conversion Rate Chart */}
        <ConversionRateChart weeklyData={weeklyData} colors={colors} />

        {/* Regional Performance - Now using the componentized version */}
        <RegionalPerformanceComparison
          regionalData={regionalData}
          colors={colors}
        />

        {/* Assessment Quality Indicators - */}
        {/*<AssessmentQualityIndicators
          speedTestData={speedTestData}
          floorData={floorData}
          colors={colors}
        />*/}
      </div>

      {/* Employee Performance Table */}
      <div className="mt-8">
        <EmployeePerformanceTable data={employeeTableData} />
      </div>

      {/* Quality metrics */}
      {metrics.qualityCohort && (
        <div className="mt-8">
          <TechnicianQualityChart cohortData={metrics.qualityCohort} />
        </div>
      )}

      {/* Employee Quality Cohort Analysis */}
      {/* 
      {metrics.rawData && (
        <div className="mt-8">
          <EmployeeQualityCohortTable csvData={employeeTableData} />
        </div>
      )}
      */}

      {/* Footer with gradient */}
      <div
        className="mt-8 p-4 rounded-lg text-white text-center"
        style={gradientBg}
      >
        <div className="text-center">
          <span>Dashboard by {preparedBy}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
