import React from "react";
import Colors from "./Colors";

const FilterIndicator = ({ activeFilter, filterGroups, onChangeFilter }) => {
  if (!activeFilter || activeFilter === "all" || !filterGroups) return null;

  const filterInfo = filterGroups[activeFilter];
  if (!filterInfo) return null;

  // Format employee names for display
  const formatEmployeeName = (email) => {
    if (!email) return "Unknown";

    const namePart = email.split("@")[0];
    const nameParts = namePart.split(".");

    if (nameParts.length >= 2) {
      return `${
        nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
      } ${nameParts[1].charAt(0).toUpperCase()}.`;
    }

    return namePart;
  };

  // Get employee names (limit to first 3 plus a count for the rest)
  const employeeCount = filterInfo.employees?.length || 0;
  const employeeNames = (filterInfo.employees || [])
    .slice(0, 3)
    .map(formatEmployeeName);
  const additionalCount = Math.max(0, employeeCount - 3);

  return (
    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Filtered Dashboard View
          </h3>
          <div className="mt-1 text-sm text-blue-700">
            <p>
              <span className="font-medium">{filterInfo.name}:</span>{" "}
              {filterInfo.description}
            </p>
            {employeeCount > 0 ? (
              <p className="mt-1 text-xs">
                Showing data for {employeeCount}{" "}
                {employeeCount === 1 ? "employee" : "employees"}:
                {employeeNames.join(", ")}
                {additionalCount > 0 ? ` and ${additionalCount} more` : ""}
              </p>
            ) : (
              <p className="mt-1 text-xs text-yellow-600">
                This group has no employees selected. All data is being shown.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterIndicator;
