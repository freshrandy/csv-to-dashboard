import React from "react";
import Colors from "./Colors";
import FilterIndicator from "./FilterIndicator";
// import TooltipToggle from "./TooltipToggle"; // Import the tooltip toggle component, turned off temporarily

const DashboardHeader = ({
  clientName = "Certify Analysis",
  dateRange,
  activeFilterGroup,
  filterGroups,
  onChangeFilter,
  onOpenGlossary,
  onToggleConfig,
  onDownloadJson,
  onResetApp,
}) => {
  // Background gradient style using updated color system
  const headerStyle = {
    background: Colors.gradients.primary,
    borderRadius: "0 0 16px 16px",
  };

  return (
    <div className="mb-8">
      {/* Header with enhanced gradient styling */}
      <div className="rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-white" style={headerStyle}>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{clientName} Dashboard</h1>
            <div className="flex items-center space-x-3">
              {/* Button Group 1: Main Actions */}
              <div className="flex space-x-2">
                {/* Export Data Button */}
                <button
                  onClick={onDownloadJson}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm rounded-lg transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export JSON
                </button>

                {/* New Analysis Button */}
                <button
                  onClick={onResetApp}
                  className="px-4 py-2 bg-white hover:bg-opacity-90 text-blue-600 text-sm rounded-lg transition-all flex items-center font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  New Analysis
                </button>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-white bg-opacity-20"></div>

              {/* Button Group 2: Dashboard Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={onChangeFilter}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm rounded-lg transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Data Filter
                </button>

                <button
                  onClick={onToggleConfig}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm rounded-lg transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Layout
                </button>

                <button
                  onClick={onOpenGlossary}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm rounded-lg transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
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
                  Help
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="opacity-90">{dateRange}</p>
            <div className="text-xs text-white text-opacity-80">
              Dashboard Generated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Add Filter Indicator if we have an active filter that isn't 'all' */}
      {activeFilterGroup && activeFilterGroup !== "all" && (
        <FilterIndicator
          activeFilter={activeFilterGroup}
          filterGroups={filterGroups}
          onChangeFilter={onChangeFilter}
        />
      )}
    </div>
  );
};

export default DashboardHeader;
