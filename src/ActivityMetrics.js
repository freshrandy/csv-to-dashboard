import React from "react";
import Colors from "./Colors";
import MetricCard from "./MetricCard"; // Using our updated MetricCard component

/**
 * Enhanced ActivityMetrics Component
 * Displays key activity metrics with improved visual design using the updated color system
 */
const ActivityMetrics = ({ metrics, hasAddresses }) => {
  // Determine terminology based on data
  const locationTerm = hasAddresses ? "Home" : "Assessment";
  const locationTermPlural = hasAddresses ? "Homes" : "Assessments";

  // Helper to render a progress bar
  const renderProgressBar = (
    value,
    colorScheme = "primary",
    height = "h-2"
  ) => {
    let barColor;
    switch (colorScheme) {
      case "primary":
        barColor = Colors.primary[400];
        break;
      case "secondary":
        barColor = Colors.secondary[500];
        break;
      case "success":
        barColor = Colors.status.success;
        break;
      case "warning":
        barColor = Colors.status.warning;
        break;
      case "error":
        barColor = Colors.status.error;
        break;
      default:
        barColor = Colors.primary[400];
    }

    return (
      <div className={`${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-in-out`}
          style={{
            width: `${value}%`,
            backgroundColor: barColor,
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {/* Header with background color */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: Colors.gray[100] }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold" style={{ color: Colors.gray[700] }}>
            Activity Metrics
          </h2>
          <div className="text-sm text-gray-500 font-medium">
            {metrics.totalScans} Total Scans
          </div>
        </div>
      </div>

      {/* Section titles and metrics */}
      <div className="p-5">
        {/* SECTION: Volume Metrics */}
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: Colors.gray[700] }}
        >
          Volume Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Using our updated MetricCard component without icons and trends */}
          <MetricCard
            title={`Unique ${locationTermPlural}`}
            value={metrics.uniqueVisits}
            subtitle={
              hasAddresses ? "unique addresses" : "distinct assessments"
            }
            colorScheme="primary"
          />

          <MetricCard
            title="Scans Completed"
            value={metrics.totalScans}
            subtitle="inc. incomplete"
            colorScheme="secondary"
          />
        </div>

        {/* SECTION: Employee Metrics */}
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: Colors.gray[700] }}
        >
          Employee Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Active Personnel"
            value={metrics.activeEmployees}
            subtitle="employees"
            colorScheme="primary"
          />

          <MetricCard
            title="Avg. Scans / Employee"
            value={(metrics.totalScans / metrics.activeEmployees).toFixed(1)}
            subtitle="scans"
            colorScheme="secondary"
          />

          <MetricCard
            title={`Avg. ${locationTermPlural} / Employee`}
            value={(metrics.uniqueVisits / metrics.activeEmployees).toFixed(1)}
            subtitle={locationTermPlural.toLowerCase()}
            colorScheme="success"
          />

          <MetricCard
            title={`Avg. Rooms / ${locationTerm}`}
            value={metrics.avgRooms}
            subtitle="rooms tested"
            colorScheme="info"
          />
        </div>

        {/* SECTION: Installation Metrics */}
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: Colors.gray[700] }}
        >
          Installation Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Access Points Installation */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Access Points Installation
              </span>
              <div className="flex items-center">
                <span
                  className="text-lg font-bold mr-1"
                  style={{ color: Colors.primary[400] }}
                >
                  {metrics.accessPoints.percentage}%
                </span>
                <span className="text-sm font-medium text-gray-600">
                  ({metrics.accessPoints.installed}/
                  {metrics.accessPoints.recommended})
                </span>
              </div>
            </div>
            {renderProgressBar(
              metrics.accessPoints.percentage,
              "primary",
              "h-4"
            )}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Installed vs Recommended</span>
              <span className="font-medium">
                {metrics.accessPoints.installed} installed
              </span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                {locationTerm} Conversion Rate
              </span>
              <div className="flex items-center">
                <span
                  className="text-lg font-bold mr-1"
                  style={{ color: Colors.secondary[500] }}
                >
                  {metrics.conversionRate.value}%
                </span>
                <span className="text-sm font-medium text-gray-600">
                  ({metrics.conversionRate.homes}/{metrics.conversionRate.total}
                  )
                </span>
              </div>
            </div>
            {renderProgressBar(
              metrics.conversionRate.value,
              "secondary",
              "h-4"
            )}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{locationTermPlural} with Access Points (%)</span>
              <span className="font-medium">
                {metrics.conversionRate.homes} converted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityMetrics;
