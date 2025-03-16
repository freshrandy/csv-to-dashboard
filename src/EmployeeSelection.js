import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import Colors from "./Colors";

/**
 * EmployeeSelection Component
 * Displays a list of employees found in the CSV for selection
 * before generating the dashboard
 */
const EmployeeSelection = ({ parsedData, onEmployeeSelect, isProcessing }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [selectAll, setSelectAll] = useState(true);

  // Extract unique employees from the parsed data
  useEffect(() => {
    if (parsedData && parsedData.length > 0) {
      // Get unique employee emails
      const employeeSet = new Set();
      parsedData.forEach((row) => {
        if (
          row["Employee Email"] &&
          !row["Employee Email"].includes("@routethis.com")
        ) {
          employeeSet.add(row["Employee Email"]);
        }
      });

      // Convert to array of employee objects
      const employeeArray = Array.from(employeeSet).map((email) => {
        // Get count of entries for this employee
        const count = parsedData.filter(
          (row) => row["Employee Email"] === email
        ).length;

        // Format display name
        const displayName = formatEmployeeName(email);

        return {
          email,
          displayName,
          count,
        };
      });

      // Sort by entry count (most active first)
      employeeArray.sort((a, b) => b.count - a.count);

      setEmployees(employeeArray);

      // Initialize all employees as selected
      const initialSelection = {};
      employeeArray.forEach((emp) => {
        initialSelection[emp.email] = true;
      });
      setSelectedEmployees(initialSelection);
    }
  }, [parsedData]);

  // Format employee name from email
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

  // Handle individual employee selection
  const toggleEmployee = (email) => {
    setSelectedEmployees((prev) => {
      const updated = { ...prev, [email]: !prev[email] };

      // Check if all are selected
      const allSelected = employees.every((emp) => updated[emp.email]);
      setSelectAll(allSelected);

      return updated;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updated = {};
    employees.forEach((emp) => {
      updated[emp.email] = newSelectAll;
    });
    setSelectedEmployees(updated);
  };

  // Handle continue to dashboard
  const handleContinue = () => {
    // Get selected employee emails
    const selectedEmails = Object.entries(selectedEmployees)
      .filter(([_, isSelected]) => isSelected)
      .map(([email]) => email);

    // Filter the data and continue
    onEmployeeSelect(selectedEmails);
  };

  // Count selected employees
  const selectedCount = Object.values(selectedEmployees).filter(Boolean).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Select Employees for Analysis
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
        <p className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          Select which employees to include in your dashboard analysis. The
          metrics will only consider data from selected employees.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Found {employees.length} employees in the uploaded data
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            {selectAll ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>

      {employees.length > 0 ? (
        <>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-2">
            <div className="space-y-2">
              {employees.map((employee) => (
                <div
                  key={employee.email}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedEmployees[employee.email]
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => toggleEmployee(employee.email)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedEmployees[employee.email] || false}
                      onChange={() => toggleEmployee(employee.email)}
                      className="h-4 w-4 text-blue-600 rounded mr-3"
                    />
                    <div>
                      <div className="font-medium">{employee.displayName}</div>
                      <div className="text-xs text-gray-500">
                        {employee.email}
                      </div>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {employee.count} scans
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCount} of {employees.length} employees selected
            </div>

            {isProcessing ? (
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">Processing...</span>
                <Loader />
              </div>
            ) : (
              <button
                onClick={handleContinue}
                disabled={selectedCount === 0}
                className={`px-4 py-2 rounded-md font-medium ${
                  selectedCount === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Generate Dashboard
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">
          No employee data found in the uploaded CSV.
        </div>
      )}
    </div>
  );
};

export default EmployeeSelection;
