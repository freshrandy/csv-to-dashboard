import React from "react";

/**
 * Dashboard Filter Indicator Component
 * Shows which employees are included in the filtered dashboard
 */
const FilterIndicator = ({ metrics, colors }) => {
  if (!metrics || !metrics.rawData) return null;

  // Get unique employees in the filtered data
  const employeeEmails = new Set();
  metrics.rawData.forEach((row) => {
    if (
      row["Employee Email"] &&
      !row["Employee Email"].includes("@routethis.com")
    ) {
      employeeEmails.add(row["Employee Email"]);
    }
  });

  const employeeCount = employeeEmails.size;

  // If no employees or very high number (likely unfiltered), don't show the indicator
  if (employeeCount === 0 || employeeCount > 10) return null;

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

  // Get employee names
  const employeeNames = Array.from(employeeEmails).map(formatEmployeeName);

  // Maximum names to show directly
  const MAX_NAMES = 3;
  const displayNames = employeeNames.slice(0, MAX_NAMES);
  const additionalCount = employeeNames.length - MAX_NAMES;

  return (
    <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
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
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Filtered Dashboard View
          </h3>
          <div className="mt-1 text-sm text-blue-700">
            <p>
              This dashboard is showing data for {employeeCount}{" "}
              {employeeCount === 1 ? "employee" : "employees"}:
              {displayNames.join(", ")}
              {additionalCount > 0 ? ` and ${additionalCount} more` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterIndicator;
