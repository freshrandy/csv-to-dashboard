/**
 * Dashboard Component
 * Main dashboard view that renders metrics visualizations and
 * provides configuration options for the dashboard display.
 *
 * @component
 */
import React, { useState, useEffect, useRef } from "react";
import {
  exportDashboardToPDF,
  exportDashboardLandscape,
  exportVisibleDashboard,
  cleanupAfterExport,
} from "./pdfExport";

// Utility and styling
import Colors from "./Colors";
import PrintStyles from "./PrintStyles";

// Dashboard header and UI controls
import DashboardHeader from "./DashboardHeader";
import MetricsGlossary from "./MetricsGlossary";
import ConfigurationPanel from "./ConfigurationPanel";

// Core metric components
import ActivityMetrics from "./ActivityMetrics";
import AssessmentQualityIndicators from "./AssessmentQualityIndicators";

// Chart components
import StatsTable from "./StatsTable";
import ConversionRateChart from "./ConversionRateChart";
import RegionalPerformanceComparison from "./RegionalPerformanceComparison";
import StatsTableChart from "./StatsTableChart";
import ConversionRateTableChart from "./ConversionRateTableChart";

// Employee-specific components
import TechnicianQualityChart from "./TechnicianQualityChart";
import EmployeePerformanceTable from "./EmployeePerformanceTable";

// Import the enhanced metrics helper functions
import { ensureMetricsFormat } from "./metrics";

// New Installation Card
import InstallationOverviewCard from "./InstallationOverviewCard";

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

/**
 * Dashboard Component
 * Renders the main dashboard with metrics and configurable components
 *
 * @param {Object} props - Component props
 * @param {Object} props.metrics - Metrics data to display
 * @param {string} props.activeFilterGroup - Currently active filter group key
 * @param {Object} props.filterGroups - Available filter groups
 * @param {Function} props.onChangeFilter - Handler for filter changes
 * @param {Function} props.onDownloadJson - Handler for JSON download
 * @param {Function} props.onResetApp - Handler to reset the application
 * @param {Function} props.onExportPDF - Optional external PDF export handler
 * @returns {React.ReactElement|null} The dashboard or null if no metrics available
 */
const Dashboard = ({
  metrics,
  activeFilterGroup,
  filterGroups,
  onChangeFilter,
  onDownloadJson,
  onResetApp,
  onExportPDF,
}) => {
  // Enhanced metrics state - our single source of truth
  const [enhancedMetrics, setEnhancedMetrics] = useState(null);

  // Load configuration from localStorage or use default
  const [dashboardConfig, setDashboardConfig] = useState(() => {
    const savedConfig = localStorage.getItem("dashboard-config");
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          // New installation component
          installationOverview: true,

          // Main components
          activityMetrics: true,
          statsTable: true,
          weeklyProgress: true,
          conversionRateChart: true,
          regionalPerformance: true,
          qualityIndicators: true,
          employeeTable: true,
          qualityChart: true,

          // Individual activity metric cards
          totalScans: true,
          uniqueVisits: true,
          activeEmployees: true,
          conversionRate: true,
          nodesInstalled: true,
          nodesRecommended: true,
          installRatio: true,
          avgRoomsTested: true,
          multiFloorRate: true,
        };
  });

  // State for PDF export
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState("landscape");

  // Reference to the dashboard content div
  const dashboardContentRef = useRef(null);

  /**
   * Enhance metrics when they change
   */
  useEffect(() => {
    if (metrics) {
      // Use the metrics.js helper to ensure we have all required data
      const enhanced = ensureMetricsFormat(metrics);
      setEnhancedMetrics(enhanced);
    }
  }, [metrics]);

  // UI state controls
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState(() => {
    const configs = localStorage.getItem("dashboard-saved-configs");
    return configs ? JSON.parse(configs) : [];
  });
  const [configName, setConfigName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showMetricsGlossary, setShowMetricsGlossary] = useState(false);
  const [speedTestThreshold, setSpeedTestThreshold] = useState(50);

  // Use the enhanced metrics if available, otherwise fall back to original
  const currentMetrics = enhancedMetrics || metrics;

  /**
   * Save configuration to localStorage when it changes
   */
  useEffect(() => {
    localStorage.setItem("dashboard-config", JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  /**
   * Toggle a single component's visibility
   *
   * @param {string} componentId - ID of the component to toggle
   */
  const toggleComponent = (componentId) => {
    setDashboardConfig((prev) => ({
      ...prev,
      [componentId]: !prev[componentId],
    }));
  };

  /**
   * Handle PDF export
   *
   * @param {string} exportType - Type of export to perform (landscape, portrait, visible-only)
   * @returns {Promise<void>}
   */
  const handleExportPDF = async (exportType = "landscape") => {
    setIsExporting(true);
    setExportType(exportType);

    try {
      let success = false;

      switch (exportType) {
        case "landscape":
          success = await exportDashboardLandscape("dashboard-content");
          break;
        case "portrait":
          success = await exportDashboardToPDF("dashboard-content");
          break;
        case "visible-only":
          success = await exportVisibleDashboard();
          break;
        default:
          success = await exportDashboardLandscape("dashboard-content");
          break;
      }
    } catch (error) {
      // Silently handle errors in production
    } finally {
      // Clean up the document after export is complete
      cleanupAfterExport("dashboard-content");
      setIsExporting(false);
    }
  };

  /**
   * Apply a preset configuration
   *
   * @param {string} presetName - Name of the preset to apply
   */
  const applyPreset = (presetName) => {
    switch (presetName) {
      case "showAll":
        setDashboardConfig({
          installationOverview: true,
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
          installationOverview: true,
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
          installationOverview: true,
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
          installationOverview: true,
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

  /**
   * Save current configuration with provided name
   *
   * @param {string} configName - Name for the saved configuration
   */
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

  /**
   * Load a saved configuration
   *
   * @param {number} index - Index of the configuration to load
   */
  const loadSavedConfiguration = (index) => {
    const config = savedConfigs[index];
    if (config && config.config) {
      setDashboardConfig(config.config);
    }
  };

  /**
   * Delete a saved configuration
   *
   * @param {number} index - Index of the configuration to delete
   */
  const deleteSavedConfiguration = (index) => {
    setSavedConfigs((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("dashboard-saved-configs", JSON.stringify(updated));
      return updated;
    });
  };

  // Exit early if no metrics
  if (!currentMetrics) return null;

  // Extract data from metrics
  const { summary, metrics: metricsData } = currentMetrics;

  // Employee Table Function
  const employeeTableData = currentMetrics.rawData || [];

  /**
   * Check if the data has employee information
   *
   * @returns {boolean} True if the data has employee information
   */
  const hasEmployeeData = () => {
    if (
      !currentMetrics ||
      !currentMetrics.rawData ||
      currentMetrics.rawData.length === 0
    ) {
      return false;
    }

    // Check if the data has an "Employee Email" column with valid data
    const hasEmployeeColumn = currentMetrics.rawData.some((row) => {
      return (
        row.hasOwnProperty("Employee Email") || row.hasOwnProperty("Employee")
      );
    });

    // Check if there are actual employee emails in the data
    const hasEmployeeValues = currentMetrics.rawData.some((row) => {
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

  /**
   * Calculate date range from the filtered data
   *
   * @returns {string} Formatted date range
   */
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
  const preparedBy = "Randy Panté | RouteThis Professional Services";

  // Use pre-calculated metrics from the enhanced metrics object
  const installationMetrics = currentMetrics.metrics.installation;
  const performanceMetrics = currentMetrics.metrics.performance;
  const conversionMetrics = currentMetrics.metrics.conversion;
  const employeeMetrics = currentMetrics.metrics.employees;
  const activeEmployeesCount = employeeMetrics.activeCount;
  const regionalData = conversionMetrics.regionalData || [];

  // Get or calculate multi-floor assessment metrics
  const floorAssessments = currentMetrics.metrics.performance
    .floorAssessments || {
    multiFloorPercentage: 0,
    singleFloorPercentage: 0,
  };

  // Activity metrics - Use pre-calculated from enhanced metrics
  const activityMetrics = {
    uniqueVisits: summary.uniqueHomes,
    totalScans: summary.totalEntries,
    accessPoints: {
      installed: installationMetrics.totalNodesInstalled,
      recommended: installationMetrics.totalNodesRecommended,
      percentage: parseFloat(installationMetrics.installationRate),
    },
    conversionRate: {
      value: parseFloat(conversionMetrics.homeConversionRate),
      homes:
        currentMetrics.metrics.installation.totalNodesInstalled > 0
          ? summary.totalEntries
          : 0,
      total: summary.uniqueHomes,
    },
    avgRooms: parseFloat(performanceMetrics.averageRoomsTested),
    multiFloorRate: floorAssessments.multiFloorPercentage,
    speedTestSuccessRate: parseFloat(performanceMetrics.speedTestSuccessRate),
    activeEmployees: activeEmployeesCount,
  };

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

  // Multi-Floor Assessment data
  const floorData = [
    {
      name: "Multi-Floor Assessments",
      value: parseFloat(floorAssessments.multiFloorPercentage.toFixed(1)),
      color: Colors.secondary[500],
    },
    {
      name: "Single-Floor Assessments",
      value: parseFloat(floorAssessments.singleFloorPercentage.toFixed(1)),
      color: Colors.gray[200],
    },
  ];

  return (
    <div
      className="p-6 w-full bg-gray-50 flex"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Include PrintStyles component for print/PDF styling */}
      <PrintStyles />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          showConfigPanel ? "mr-64" : ""
        }`}
      >
        {/* DashboardHeader with class for print styling */}
        <div className="dashboard-header">
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
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
          />
        </div>

        {/* Dashboard content with ID and ref for PDF export */}
        <div
          id="dashboard-content"
          ref={dashboardContentRef}
          className="flex flex-col gap-6"
        >
          {/* Activity Metrics */}
          {dashboardConfig.activityMetrics && (
            <ActivityMetrics
              metrics={currentMetrics}
              config={dashboardConfig}
            />
          )}

          {/* Installation Overview */}
          {dashboardConfig.installationOverview && (
            <InstallationOverviewCard
              completedCertifications={
                metrics?.summary?.statusDistribution?.Complete || 0
              }
              nodesRecommended={
                metrics?.metrics?.installation?.totalNodesRecommended || 0
              }
              nodesInstalled={
                metrics?.metrics?.installation?.totalNodesInstalled || 0
              }
              installationRatio={parseFloat(
                metrics?.metrics?.installation?.installationRate || 0
              )}
            />
          )}

          {/* Stats Table */}
          {dashboardConfig.statsTable && (
            <StatsTable metrics={currentMetrics} />
          )}

          {/* Weekly Progress Chart - Using Enhanced Stats Table Data */}
          {dashboardConfig.weeklyProgress &&
            currentMetrics?.metrics?.temporal?.formattedWeeklyData && (
              <StatsTableChart metrics={currentMetrics} colors={Colors} />
            )}

          {/* Conversion Rate Chart - Using Enhanced Stats Table Data */}
          {dashboardConfig.conversionRateChart &&
            currentMetrics?.metrics?.temporal?.weeklyDataWithConversion && (
              <ConversionRateTableChart
                metrics={currentMetrics}
                colors={Colors}
              />
            )}

          {/* Regional Performance */}
          {dashboardConfig.regionalPerformance && (
            <RegionalPerformanceComparison
              metrics={currentMetrics}
              colors={Colors}
            />
          )}

          {/* Assessment Quality Indicators */}
          {dashboardConfig.qualityIndicators && (
            <AssessmentQualityIndicators
              metrics={currentMetrics}
              speedTestData={speedTestData}
              floorData={floorData}
              colors={Colors}
              speedTestThreshold={speedTestThreshold}
              onSpeedTestThresholdChange={(newThreshold) => {
                setSpeedTestThreshold(newThreshold);
              }}
            />
          )}

          {/* Employee Performance Table */}
          {hasEmployeeData() && dashboardConfig.employeeTable && (
            <div className="mt-8">
              <EmployeePerformanceTable
                metrics={currentMetrics}
                dateRange={dateRange}
              />
            </div>
          )}

          {/* Quality metrics */}
          {currentMetrics.qualityCohort &&
            hasEmployeeData() &&
            dashboardConfig.qualityChart && (
              <div className="mt-8">
                <TechnicianQualityChart
                  cohortData={currentMetrics.qualityCohort}
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
                Please enable at least one component from the configuration
                panel to visualize your data.
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

        {/* Loading overlay for when export is in progress */}
        {isExporting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
                <div>
                  <p className="text-lg">Generating PDF...</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This may take a few moments. Please don't close this window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
