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
              {/* Add Configuration Button */}
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
                Future Configure Function
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
