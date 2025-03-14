import React, { useState } from "react";

/**
 * Enhanced ActivityMetrics Component
 * Displays key activity metrics with improved visual design and show/hide toggles
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

  // State to track visibility of cards
  const [visibleCards, setVisibleCards] = useState({
    uniqueVisits: true,
    totalScans: true,
    avgRooms: true,
    speedTest: true,
    accessPoints: true,
    conversionRate: true,
  });

  // Toggle visibility of a specific card
  const toggleCardVisibility = (cardKey) => {
    setVisibleCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

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

  // Helper to render card toggle button
  const renderToggleButton = (cardKey, isVisible) => (
    <button
      onClick={() => toggleCardVisibility(cardKey)}
      className="text-gray-400 hover:text-gray-600 focus:outline-none"
      title={isVisible ? "Hide" : "Show"}
    >
      {isVisible ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </button>
  );

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

      {/* Metric cards grid with improved spacing and shadows */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Unique Visits Card */}
          {visibleCards.uniqueVisits && (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Unique {locationTermPlural}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    Total
                  </span>
                  {renderToggleButton(
                    "uniqueVisits",
                    visibleCards.uniqueVisits
                  )}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.teal }}
                >
                  {metrics.uniqueVisits}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {hasAddresses ? "unique addresses" : "distinct assessments"}
                </div>
              </div>
            </div>
          )}
          {!visibleCards.uniqueVisits && (
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Unique {locationTermPlural}
              </span>
              {renderToggleButton("uniqueVisits", visibleCards.uniqueVisits)}
            </div>
          )}

          {/* Total Scans Card */}
          {visibleCards.totalScans && (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Scans Completed
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                    All
                  </span>
                  {renderToggleButton("totalScans", visibleCards.totalScans)}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.electricBlue }}
                >
                  {metrics.totalScans}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  inc. incomplete
                </div>
              </div>
            </div>
          )}
          {!visibleCards.totalScans && (
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Scans Completed</span>
              {renderToggleButton("totalScans", visibleCards.totalScans)}
            </div>
          )}

          {/* Avg Rooms Card */}
          {visibleCards.avgRooms && (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Avg. Rooms / {locationTerm}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                    Mean
                  </span>
                  {renderToggleButton("avgRooms", visibleCards.avgRooms)}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.jade }}
                >
                  {metrics.avgRooms}
                </div>
                <div className="text-xs text-gray-500 mb-1">rooms tested</div>
              </div>
            </div>
          )}
          {!visibleCards.avgRooms && (
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Avg. Rooms / {locationTerm}
              </span>
              {renderToggleButton("avgRooms", visibleCards.avgRooms)}
            </div>
          )}

          {/* Speed Test Card */}
          {visibleCards.speedTest && (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Speed Test Success
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                    % Success
                  </span>
                  {renderToggleButton("speedTest", visibleCards.speedTest)}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.teal }}
                >
                  {metrics.speedTestSuccessRate}%
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {">"} 80% of plan
                </div>
              </div>
            </div>
          )}
          {!visibleCards.speedTest && (
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Speed Test Success</span>
              {renderToggleButton("speedTest", visibleCards.speedTest)}
            </div>
          )}
        </div>

        {/* Progress Bar Metrics - with improved presentation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Access Points Installation */}
          {visibleCards.accessPoints && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
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
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    ({metrics.accessPoints.installed}/
                    {metrics.accessPoints.recommended})
                  </span>
                  {renderToggleButton(
                    "accessPoints",
                    visibleCards.accessPoints
                  )}
                </div>
              </div>
              {renderProgressBar(
                metrics.accessPoints.percentage,
                colors.jade,
                "h-3"
              )}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Installed vs Recommended</span>
              </div>
            </div>
          )}
          {!visibleCards.accessPoints && (
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Access Points Installation
              </span>
              {renderToggleButton("accessPoints", visibleCards.accessPoints)}
            </div>
          )}

          {/* Conversion Rate */}
          {visibleCards.conversionRate && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
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
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    ({metrics.conversionRate.homes}/
                    {metrics.conversionRate.total})
                  </span>
                  {renderToggleButton(
                    "conversionRate",
                    visibleCards.conversionRate
                  )}
                </div>
              </div>
              {renderProgressBar(
                metrics.conversionRate.value,
                colors.electricBlue,
                "h-3"
              )}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{locationTermPlural} with installations</span>
              </div>
            </div>
          )}
          {!visibleCards.conversionRate && (
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {locationTerm} Conversion Rate
              </span>
              {renderToggleButton(
                "conversionRate",
                visibleCards.conversionRate
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityMetrics;
