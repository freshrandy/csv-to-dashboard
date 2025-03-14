import React from "react";

/**
 * Enhanced ActivityMetrics Component
 * Displays key activity metrics with improved visual design
 *
 * @param {Object} props
 * @param {Object} props.metrics - Object containing activity metrics data
 * @param {boolean} props.hasAddresses - Whether address data is available
 * @param {Object} props.colors - Brand color scheme for styling
 */
const ActivityMetrics = ({ metrics, hasAddresses, colors }) => {
  // Determine terminology based on data
  const locationTerm = hasAddresses ? "Home" : "Assessment";
  const locationTermPlural = hasAddresses ? "Homes" : "Assessments";

  // Helper to render a progress bar
  const renderProgressBar = (value, color, height = "h-2") => (
    <div className={`${height} bg-gray-200 rounded-full overflow-hidden`}>
      <div
        className={`${height} rounded-full transition-all duration-500 ease-in-out`}
        style={{
          width: `${value}%`,
          backgroundColor: color,
        }}
      ></div>
    </div>
  );

  // Calculate number of active employees (employees with at least 1 scan)
  const activeEmployees = metrics.activeEmployees || 12; // Use actual data or fallback

  // Calculate averages per employee
  const avgScansPerEmployee = metrics.totalScans
    ? (metrics.totalScans / activeEmployees).toFixed(1)
    : 0;
  const avgHomesPerEmployee = metrics.uniqueVisits
    ? (metrics.uniqueVisits / activeEmployees).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with background color */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: colors.cloudGrey }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold" style={{ color: colors.ash }}>
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
        <h3 className="text-lg font-medium mb-3" style={{ color: colors.ash }}>
          Volume Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Unique Visits Card */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-gray-600">
                Unique {locationTermPlural}
              </p>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                Total
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div
                className="text-4xl font-bold"
                style={{ color: colors.teal }}
              >
                {metrics.uniqueVisits}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {hasAddresses ? "unique addresses" : "distinct assessments"}
              </div>
            </div>
          </div>

          {/* Total Scans Card */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-gray-600">
                Scans Completed
              </p>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                All
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div
                className="text-4xl font-bold"
                style={{ color: colors.electricBlue }}
              >
                {metrics.totalScans}
              </div>
              <div className="text-sm text-gray-500 mb-1">inc. incomplete</div>
            </div>
          </div>
        </div>

        {/* SECTION: Employee Metrics */}
        <h3 className="text-lg font-medium mb-3" style={{ color: colors.ash }}>
          Employee Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Employees Card */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-gray-600">
                Active Personnel
              </p>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                With Scans
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div
                className="text-4xl font-bold"
                style={{ color: colors.teal }}
              >
                {activeEmployees}
              </div>
              <div className="text-sm text-gray-500 mb-1">employees</div>
            </div>
          </div>

          {/* Average Scans Per Employee Card */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-gray-600">
                Avg. Scans / Employee
              </p>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                Mean
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div
                className="text-4xl font-bold"
                style={{ color: colors.electricBlue }}
              >
                {avgScansPerEmployee}
              </div>
              <div className="text-sm text-gray-500 mb-1">scans</div>
            </div>
          </div>

          {/* Average Homes Per Employee Card */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-gray-600">
                Avg. {locationTermPlural} / Employee
              </p>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                Mean
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div
                className="text-4xl font-bold"
                style={{ color: colors.jade }}
              >
                {avgHomesPerEmployee}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {locationTermPlural.toLowerCase()}
              </div>
            </div>
          </div>

          {/* Avg Rooms Card */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-gray-600">
                Avg. Rooms / {locationTerm}
              </p>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                Mean
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div
                className="text-4xl font-bold"
                style={{ color: colors.jade }}
              >
                {metrics.avgRooms}
              </div>
              <div className="text-sm text-gray-500 mb-1">rooms tested</div>
            </div>
          </div>
        </div>

        {/* SECTION: Installation Metrics */}
        <h3 className="text-lg font-medium mb-3" style={{ color: colors.ash }}>
          Installation Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Access Points Installation */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Access Points Installation
              </span>
              <div className="flex items-center">
                <span
                  className="text-lg font-bold mr-1"
                  style={{ color: colors.jade }}
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
              colors.jade,
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
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                {locationTerm} Conversion Rate
              </span>
              <div className="flex items-center">
                <span
                  className="text-lg font-bold mr-1"
                  style={{ color: colors.electricBlue }}
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
              colors.electricBlue,
              "h-4"
            )}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{locationTermPlural} with installations</span>
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
