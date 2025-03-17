import React from "react";
import Colors from "./Colors";
import FilterIndicator from "./FilterIndicator";
import TooltipToggle from "./TooltipToggle"; // Import the tooltip toggle component

/**
 * Enhanced Dashboard Header Component
 * Using the updated color system and improved styling
 */
const DashboardHeader = ({
  clientName = "Certify Analysis",
  dateRange,
  activeFilterGroup,
  filterGroups,
  onChangeFilter,
  onOpenGlossary,
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
              {/* Add the tooltip toggle */}
              <TooltipToggle />

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
                Metrics Glossary
              </button>
              <button
                onClick={onChangeFilter}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm rounded-lg transition-all"
              >
                Change Filter
              </button>
            </div>
          </div>
          <p className="opacity-90">{dateRange}</p>
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
