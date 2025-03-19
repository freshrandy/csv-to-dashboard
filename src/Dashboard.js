import React, { useState, useEffect } from "react";

// Utility and styling
import Colors from "./Colors";

// Dashboard header and UI controls
import DashboardHeader from "./DashboardHeader";
import MetricsGlossary from "./MetricsGlossary";
import ConfigurationPanel from "./ConfigurationPanel";

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

/**
 * Gets the ISO week number for a date
 * Follows the ISO 8601 standard where weeks start on Monday and the first week
 * of the year contains the first Thursday of that year
 * @param {Date} date - JavaScript Date object
 * @returns {number} ISO week number (1-53)
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
 * This may be different from the date's year for dates in early January
 * or late December
 * @param {Date} date - JavaScript Date object
 * @returns {number} ISO year
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
 * @param {Date} date - JavaScript Date object
 * @returns {string} Week key
 */
function getISOWeekKey(date) {
  const year = getISOYear(date);
  const week = getISOWeek(date);
  return `${year}-W${week.toString().padStart(2, "0")}`;
}

/**
 * Format week range for display (e.g., "Jan 1 - Jan 7")
 * @param {string} weekKey - ISO week key in format "YYYY-Www"
 * @returns {string} Formatted date range
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

const Dashboard = ({
  metrics,
  activeFilterGroup,
  filterGroups,
  onChangeFilter,
  onDownloadJson,
  onResetApp,
}) => {
  // Load configuration from localStorage or use default
  const [dashboardConfig, setDashboardConfig] = useState(() => {
    const savedConfig = localStorage.getItem("dashboard-config");
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          activityMetrics: true,
          uniqueVisits: true,
          totalScans: true,
          employeePerformance: true,
          weeklyProgress: true,
          conversionRate: true,
          regionalPerformance: true,
          qualityIndicators: true,
          employeeTable: true,
          qualityChart: true,
        };
  });

  // State to control if config panel is visible
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Add state for saved configurations
  const [savedConfigs, setSavedConfigs] = useState(() => {
    const configs = localStorage.getItem("dashboard-saved-configs");
    return configs ? JSON.parse(configs) : [];
  });

  // State for configuration name input
  const [configName, setConfigName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // State for metrics glossary modal
  const [showMetricsGlossary, setShowMetricsGlossary] = useState(false);

  // Assessment Quality slider
  const [speedTestThreshold, setSpeedTestThreshold] = useState(80);

  // Save configuration to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dashboard-config", JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  // Toggle a single component
  const toggleComponent = (componentId) => {
    setDashboardConfig((prev) => ({
      ...prev,
      [componentId]: !prev[componentId],
    }));
  };

  // Apply a preset configuration
  const applyPreset = (presetName) => {
    switch (presetName) {
      case "showAll":
        setDashboardConfig({
          activityMetrics: true,
          uniqueVisits: true,
          totalScans: true,
          employeePerformance: true,
          weeklyProgress: true,
          conversionRate: true,
          regionalPerformance: true,
          qualityIndicators: true,
          employeeTable: true,
          qualityChart: true,
        });
        break;
      case "minimal":
        setDashboardConfig({
          activityMetrics: true,
          uniqueVisits: true,
          totalScans: true,
          employeePerformance: false,
          weeklyProgress: true,
          conversionRate: true,
          regionalPerformance: false,
          qualityIndicators: false,
          employeeTable: false,
          qualityChart: false,
        });
        break;
      case "conversionFocus":
        setDashboardConfig({
          activityMetrics: true,
          uniqueVisits: true,
          totalScans: true,
          employeePerformance: false,
          weeklyProgress: false,
          conversionRate: true,
          regionalPerformance: true,
          qualityIndicators: true,
          employeeTable: false,
          qualityChart: false,
        });
        break;
      case "employeeFocus":
        setDashboardConfig({
          activityMetrics: true,
          uniqueVisits: false,
          totalScans: false,
          employeePerformance: true,
          weeklyProgress: false,
          conversionRate: false,
          regionalPerformance: false,
          qualityIndicators: false,
          employeeTable: true,
          qualityChart: true,
        });
        break;
      default:
        break;
    }
  };

  // Save current configuration
  const saveCurrentConfiguration = (configName) => {
    const newConfig = {
      name: configName,
      date: new Date().toLocaleDateString(),
      config: dashboardConfig,
    };

    setSavedConfigs((prev) => {
      const updated = [...prev, newConfig];
      localStorage.setItem("dashboard-saved-configs", JSON.stringify(updated));
      return updated;
    });
  };

  // Load a saved configuration
  const loadSavedConfiguration = (index) => {
    const config = savedConfigs[index];
    if (config && config.config) {
      setDashboardConfig(config.config);
    }
  };

  // Delete a saved configuration
  const deleteSavedConfiguration = (index) => {
    setSavedConfigs((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("dashboard-saved-configs", JSON.stringify(updated));
      return updated;
    });
  };

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

  // Weekly Data with fixed implementation using improved ISO week calculation
  const weeklyData = (() => {
    console.log("Generating weekly data with improved ISO week calculations");

    // Initialize distribution structure
    const weeklyDistribution = {};

    // Build distribution from filtered data with improved ISO week calculation
    employeeTableData.forEach((row) => {
      const dateStr = row["Date "] || row.Date;
      if (!dateStr) return;

      try {
        const entryDate = new Date(dateStr);
        if (isNaN(entryDate)) return;

        // Get week key using the improved ISO function
        const weekKey = getISOWeekKey(entryDate);

        // Add to distribution
        weeklyDistribution[weekKey] = (weeklyDistribution[weekKey] || 0) + 1;
      } catch (e) {
        console.warn("Error processing date:", dateStr, e);
      }
    });

    // If we don't have weekly data, return an empty array
    if (Object.keys(weeklyDistribution).length === 0) {
      console.warn("No weekly data found");
      return [];
    }

    // Find actual min and max dates in the filtered raw data
    let minDate = new Date("2099-12-31");
    let maxDate = new Date("1970-01-01");

    employeeTableData.forEach((entry) => {
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

    console.log(
      `Actual date range: ${minDate.toISOString()} to ${maxDate.toISOString()}`
    );

    // Process each week
    const processedData = [];

    // Get the min and max week keys to limit our processing range
    const minWeekKey = getISOWeekKey(minDate);
    const maxWeekKey = getISOWeekKey(maxDate);

    console.log(`Week range: ${minWeekKey} to ${maxWeekKey}`);
    console.log(`Active weeks: ${Object.keys(weeklyDistribution).join(", ")}`);

    // Only process weeks where we have data
    Object.keys(weeklyDistribution).forEach((weekKey) => {
      // Skip if week key is outside our range
      if (weekKey < minWeekKey || weekKey > maxWeekKey) {
        console.warn(`Skipping out-of-range week: ${weekKey}`);
        return;
      }

      // Get the week label using our improved formatter
      const weekLabel = formatWeekRange(weekKey);

      // Get entries for this week using our consistent ISO function
      const weekData = employeeTableData.filter((entry) => {
        if (!entry["Date "] && !entry.Date) return false;

        try {
          const entryDate = new Date(entry["Date "] || entry.Date);
          if (isNaN(entryDate)) return false; // Skip invalid dates

          const entryWeekKey = getISOWeekKey(entryDate);
          return entryWeekKey === weekKey;
        } catch (e) {
          return false; // Skip entries with date parsing issues
        }
      });

      // Skip if no data for this week
      if (weekData.length === 0) {
        console.warn(`No data for week ${weekKey} after filtering`);
        return;
      }

      // Calculate metrics
      const scans = weekData.length;

      // Count actual installations (mesh nodes > 0)
      const installations = weekData.reduce((total, entry) => {
        return total + (parseInt(entry["Mesh Nodes Installed"]) || 0);
      }, 0);

      // Calculate unique homes
      let uniqueHomes = 0;

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

      // Calculate conversion rate
      const conversion = scans > 0 ? (installations / scans) * 100 : 0;

      // Add to processed data
      processedData.push({
        week: weekLabel,
        weekKey: weekKey, // Keep for sorting
        completed: scans,
        installations: installations,
        conversion: parseFloat(conversion.toFixed(1)),
        uniqueHomes: uniqueHomes,
      });
    });

    console.log(`Generated ${processedData.length} weekly data points`);

    // Final safety check - don't include weeks outside our date range
    const filteredData = processedData.filter((item) => {
      const [year, weekCode] = item.weekKey.split("-");
      const weekNum = parseInt(weekCode.substring(1));

      // Calculate the Sunday date for this week
      const jan4 = new Date(parseInt(year), 0, 4);
      const firstMonday = new Date(jan4);
      firstMonday.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1);
      const weekSunday = new Date(firstMonday);
      weekSunday.setDate(firstMonday.getDate() + (weekNum - 1) * 7 + 6);

      // Check if this week's end date is after our max date
      if (weekSunday > maxDate) {
        console.warn(
          `Filtering out future week ${
            item.week
          } ending on ${weekSunday.toISOString()}`
        );
        return false;
      }

      return true;
    });

    if (filteredData.length !== processedData.length) {
      console.log(
        `Filtered out ${
          processedData.length - filteredData.length
        } future weeks`
      );
    }

    // Sort by week key and remove the key from the final output
    return filteredData
      .sort((a, b) => a.weekKey.localeCompare(b.weekKey))
      .map((item) => {
        const { weekKey, ...rest } = item;
        return rest;
      });
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
      className="p-6 w-full bg-gray-50 flex"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          showConfigPanel ? "mr-64" : ""
        }`}
      >
        {/* DashboardHeader */}
        <DashboardHeader
          clientName={clientName}
          dateRange={dateRange}
          activeFilterGroup={activeFilterGroup}
          filterGroups={filterGroups}
          onChangeFilter={onChangeFilter}
          onOpenGlossary={() => setShowMetricsGlossary(true)}
          onToggleConfig={() => setShowConfigPanel(!showConfigPanel)}
          onDownloadJson={onDownloadJson}
          onResetApp={onResetApp}
        />

        <div className="flex flex-col gap-6">
          {/* Activity Metrics */}
          {dashboardConfig.activityMetrics && (
            <ActivityMetrics
              metrics={activityMetrics}
              hasAddresses={hasAddresses}
            />
          )}

          {/* Weekly Progress Chart */}
          {dashboardConfig.weeklyProgress && (
            <WeeklyProgressChart weeklyData={weeklyData} />
          )}

          {/* Conversion Rate Chart */}
          {dashboardConfig.conversionRate && (
            <ConversionRateChart weeklyData={weeklyData} colors={Colors} />
          )}

          {/* Regional Performance */}
          {dashboardConfig.regionalPerformance && (
            <RegionalPerformanceComparison
              regionalData={regionalData}
              colors={Colors}
            />
          )}

          {/* Assessment Quality Indicators */}
          {dashboardConfig.qualityIndicators && (
            <AssessmentQualityIndicators
              speedTestData={speedTestData}
              floorData={floorData}
              colors={Colors}
              speedTestThreshold={speedTestThreshold}
              onSpeedTestThresholdChange={(newThreshold) => {
                setSpeedTestThreshold(newThreshold);
              }}
            />
          )}
        </div>

        {/* Employee Performance Table */}
        {hasEmployeeData() && dashboardConfig.employeeTable && (
          <div className="mt-8">
            <EmployeePerformanceTable
              data={employeeTableData}
              dateRange={dateRange}
            />
          </div>
        )}

        {/* Quality metrics */}
        {metrics.qualityCohort &&
          hasEmployeeData() &&
          dashboardConfig.qualityChart && (
            <div className="mt-8">
              <TechnicianQualityChart
                cohortData={metrics.qualityCohort}
                filteredData={employeeTableData}
                dateRange={dateRange}
              />
            </div>
          )}

        {/* No components message when all are hidden */}
        {!Object.values(dashboardConfig).some((value) => value) && (
          <div className="bg-white p-8 rounded-lg shadow text-center my-8">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Components Selected
            </h3>
            <p className="text-gray-500 mb-4">
              Please enable at least one component from the configuration panel
              to visualize your data.
            </p>
            <button
              onClick={() => applyPreset("showAll")}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
            >
              Show All Components
            </button>
          </div>
        )}

        {/* Footer with gradient */}
        <div
          className="mt-8 p-4 rounded-lg text-white text-center"
          style={{ background: Colors.gradients.primary }}
        >
          <div className="text-center">
            <span>Dashboard by {preparedBy}</span>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div
        className={`fixed top-0 right-0 h-full transform transition-transform duration-300 ease-in-out z-20 ${
          showConfigPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ConfigurationPanel
          config={dashboardConfig}
          onToggleComponent={toggleComponent}
          onApplyPreset={applyPreset}
          onClose={() => setShowConfigPanel(false)}
          savedConfigs={savedConfigs}
          onSaveConfig={saveCurrentConfiguration}
          onLoadConfig={loadSavedConfiguration}
          onDeleteConfig={deleteSavedConfiguration}
          configName={configName}
          onConfigNameChange={setConfigName}
          showSaveDialog={showSaveDialog}
          onToggleSaveDialog={() => setShowSaveDialog(!showSaveDialog)}
        />
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
