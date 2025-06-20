import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import Colors from "./Colors";

const FilterGroupSelection = ({
  parsedData,
  filterGroups,
  savedConfigs,
  onUpdateFilterGroup,
  onSaveConfiguration,
  onLoadConfiguration,
  onDeleteConfiguration,
  onExportConfigurations,
  onImportConfigurations,
  onFilterSelect,
  isProcessing,
}) => {
  // State for managing UI
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [selectedSpeeds, setSelectedSpeeds] = useState({}); // NEW: For speed filtering
  const [filterType, setFilterType] = useState("employee"); // NEW: Track current filter type
  const [showMenu, setShowMenu] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [configName, setConfigName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [expectedSpeeds, setExpectedSpeeds] = useState([]); // NEW: Available speeds
  const [hasEmployeeData, setHasEmployeeData] = useState(true);
  const fileInputRef = React.useRef(null);
  const [employeeSortOption, setEmployeeSortOption] = useState("scans");

  // NEW: Extract unique expected speeds from data
  useEffect(() => {
    if (parsedData && parsedData.length > 0) {
      // Extract unique expected speeds
      const speedSet = new Set();
      parsedData.forEach((row) => {
        if (
          row["Expected Speed"] &&
          typeof row["Expected Speed"] === "number"
        ) {
          speedSet.add(row["Expected Speed"]);
        }
      });

      // Convert to sorted array
      const speedArray = Array.from(speedSet)
        .sort((a, b) => a - b)
        .map((speed) => ({
          value: speed,
          label: `${speed} Mbps`,
          count: parsedData.filter((row) => row["Expected Speed"] === speed)
            .length,
        }));

      setExpectedSpeeds(speedArray);

      // Existing employee extraction logic remains the same...
      const hasEmployeeEmailColumn = parsedData.some(
        (row) =>
          row.hasOwnProperty("Employee Email") || row.hasOwnProperty("Employee")
      );

      const hasEmployeeValues = parsedData.some((row) => {
        const email = row["Employee Email"] || row["Employee"];
        return (
          email &&
          typeof email === "string" &&
          !email.includes("@routethis.com")
        );
      });

      setHasEmployeeData(hasEmployeeEmailColumn && hasEmployeeValues);

      if (!hasEmployeeEmailColumn || !hasEmployeeValues) {
        console.log("No employee data found in CSV");
        return;
      }

      // Employee extraction logic (unchanged)...
      const employeeSet = new Set();
      parsedData.forEach((row) => {
        const email = row["Employee Email"] || row["Employee"];
        if (
          email &&
          typeof email === "string" &&
          !email.includes("@routethis.com")
        ) {
          employeeSet.add(email);
        }
      });

      const employeeArray = Array.from(employeeSet).map((email) => {
        const count = parsedData.filter(
          (row) => row["Employee Email"] === email || row["Employee"] === email
        ).length;

        const displayName = formatEmployeeName(email);

        return {
          email,
          displayName,
          count,
        };
      });

      employeeArray.sort((a, b) => b.count - a.count);
      setEmployees(employeeArray);
    }
  }, [parsedData]);

  // NEW: Set initial selections when editing a group (handle both employee and speed)
  useEffect(() => {
    if (editingGroup) {
      const group = filterGroups[editingGroup];

      // Set filter type based on group type
      if (group && group.type) {
        setFilterType(group.type);
      }

      // Set employee selections
      const initialEmployeeSelection = {};
      if (group && group.employees) {
        group.employees.forEach((email) => {
          initialEmployeeSelection[email] = true;
        });
      }
      setSelectedEmployees(initialEmployeeSelection);

      // NEW: Set speed selections
      const initialSpeedSelection = {};
      if (group && group.expectedSpeeds) {
        group.expectedSpeeds.forEach((speed) => {
          initialSpeedSelection[speed] = true;
        });
      }
      setSelectedSpeeds(initialSpeedSelection);

      if (group && group.description) {
        setNewDescription(group.description);
      }
    }
  }, [editingGroup, filterGroups]);

  // Format employee name from email (unchanged)
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

  // Start editing a group (unchanged)
  const startEditing = (groupKey) => {
    if (groupKey === "all") return;
    setEditingGroup(groupKey);
  };

  // NEW: Save the current group edits (updated for multi-type support)
  const saveGroup = () => {
    if (!editingGroup) return;

    let updatedGroup = {
      ...filterGroups[editingGroup],
      description: newDescription || "No description provided",
      type: filterType, // NEW: Store the filter type
    };

    if (filterType === "employee") {
      // Get all selected employee emails
      const selectedEmails = Object.keys(selectedEmployees).filter(
        (email) => selectedEmployees[email]
      );
      updatedGroup.employees = selectedEmails;
      updatedGroup.expectedSpeeds = []; // Clear speeds when using employee filter
    } else if (filterType === "expectedSpeed") {
      // Get all selected speeds
      const selectedSpeedValues = Object.keys(selectedSpeeds)
        .filter((speed) => selectedSpeeds[speed])
        .map((speed) => parseInt(speed));
      updatedGroup.expectedSpeeds = selectedSpeedValues;
      updatedGroup.employees = []; // Clear employees when using speed filter
    }

    onUpdateFilterGroup(editingGroup, updatedGroup);

    // Exit editing mode
    setEditingGroup(null);
    setEditingDescription(false);
  };

  // NEW: Toggle speed selection
  const toggleSpeed = (speed) => {
    setSelectedSpeeds((prev) => ({
      ...prev,
      [speed]: !prev[speed],
    }));
  };

  // Toggle employee selection (unchanged)
  const toggleEmployee = (email) => {
    setSelectedEmployees((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  // NEW: Count selected speeds
  const getSelectedSpeedCount = () => {
    return Object.values(selectedSpeeds).filter(Boolean).length;
  };

  // Count selected employees (unchanged)
  const getSelectedCount = () => {
    return Object.values(selectedEmployees).filter(Boolean).length;
  };

  // NEW: Select all speeds
  const selectAllSpeeds = () => {
    const newSelected = {};
    expectedSpeeds.forEach((speed) => {
      newSelected[speed.value] = true;
    });
    setSelectedSpeeds(newSelected);
  };

  // NEW: Clear all speed selections
  const clearSpeedSelections = () => {
    setSelectedSpeeds({});
  };

  // Select all employees (unchanged)
  const selectAllEmployees = () => {
    const newSelected = {};
    sortedEmployees.forEach((emp) => {
      newSelected[emp.email] = true;
    });
    setSelectedEmployees(newSelected);
  };

  // Clear all employee selections (unchanged)
  const clearEmployeeSelections = () => {
    setSelectedEmployees({});
  };

  // Handle file import (unchanged)
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportConfigurations(file);
    }
    setShowMenu(false);
  };

  // Sort employees based on selected option (unchanged)
  const sortedEmployees = React.useMemo(() => {
    const employeeArray = [...employees];

    switch (employeeSortOption) {
      case "alphabetical":
        return employeeArray.sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );
      case "certifications":
      default:
        return employeeArray.sort((a, b) => b.count - a.count);
    }
  }, [employees, employeeSortOption]);

  // Render the no employee data view (unchanged)
  const renderNoEmployeeDataView = () => (
    <div>
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3 text-yellow-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-yellow-800 mb-1">
              No Employee Data Detected
            </h3>
            <p className="text-sm text-yellow-700">
              The uploaded CSV file does not contain employee information.
              Employee-based filtering options are not available, but you can
              still generate a dashboard with all the data.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => onFilterSelect("all")}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Generate Dashboard with All Data"
          )}
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Info</h3>
        <p className="text-sm text-gray-600">
          Without employee data, the dashboard will still show aggregate
          performance metrics, but employee-specific views will be limited. To
          enable employee filtering in the future, make sure your CSV includes
          an "Employee Email" column with valid employee email addresses.
        </p>
      </div>
    </div>
  );

  // NEW: Render expected speed selection interface
  const renderSpeedSelection = () => (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600">
          Select expected speeds for this group
        </div>
        <div className="flex space-x-2">
          <button
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            onClick={selectAllSpeeds}
          >
            Select All
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            onClick={clearSpeedSelections}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-md p-2 mb-4">
        <div className="space-y-2">
          {expectedSpeeds.map((speed) => (
            <div
              key={speed.value}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
                selectedSpeeds[speed.value]
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => toggleSpeed(speed.value)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSpeeds[speed.value] || false}
                  onChange={() => toggleSpeed(speed.value)}
                  className="h-4 w-4 text-blue-600 rounded mr-2"
                />
                <div>
                  <div className="font-medium text-sm">{speed.label}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  {speed.count} assessments
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {getSelectedSpeedCount()} selected
        </div>
        <button
          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          onClick={saveGroup}
        >
          Save Group
        </button>
      </div>
    </div>
  );

  // NEW: Render employee selection interface (extracted from existing code)
  const renderEmployeeSelection = () => (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600">
          Select employees for this group
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-600">Sort by:</label>
            <select
              value={employeeSortOption}
              onChange={(e) => setEmployeeSortOption(e.target.value)}
              className="p-1 text-xs border border-gray-300 rounded"
            >
              <option value="scans">Most Certifications</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <button
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            onClick={selectAllEmployees}
          >
            Select All
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            onClick={clearEmployeeSelections}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-md p-2 mb-4">
        <div className="space-y-2">
          {sortedEmployees.map((employee) => (
            <div
              key={employee.email}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
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
                  className="h-4 w-4 text-blue-600 rounded mr-2"
                />
                <div>
                  <div className="font-medium text-sm">
                    {employee.displayName}
                  </div>
                  <div className="text-xs text-gray-500">{employee.email}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  {employee.count} certifications
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {getSelectedCount()} selected
        </div>
        <button
          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          onClick={saveGroup}
        >
          Save Group
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Header section with title and save/load menu */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          Dashboard Filter Selection
        </h2>

        {/* Save/Load button and menu - only show if we have employee data */}
        {hasEmployeeData && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="px-3 py-2 flex items-center text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2M8 7h4a2 2 0 012 2v4m0 0h2a2 2 0 012 2v4m0 0h-4m4 0h2M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2H8"
                />
              </svg>
              Save/Load Groups
            </button>

            {/* Dropdown menu (unchanged) */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2 px-2">
                    Browser Storage (This Device Only)
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded"
                    onClick={() => {
                      setSaveDialogOpen(true);
                      setShowMenu(false);
                    }}
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Save to This Browser
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded"
                    onClick={() => {
                      setLoadDialogOpen(true);
                      setShowMenu(false);
                    }}
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Load from This Browser
                  </button>

                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="text-xs text-gray-500 mb-2 px-2">
                      Share Between Devices/Users
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded"
                      onClick={() => {
                        onExportConfigurations();
                        setShowMenu(false);
                      }}
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
                      Download as File
                    </button>
                    <label className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer rounded">
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Upload from File
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept=".json"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conditionally render the appropriate view based on whether we have employee data */}
      {!hasEmployeeData ? (
        // No employee data view
        renderNoEmployeeDataView()
      ) : !editingGroup ? (
        // Filter Group Selection View (for data with employees)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Choose a filter group or edit a group to customize which
                employees or expected speeds are included.
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {/* All Employees option */}
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedGroup === "all"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedGroup("all")}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <input
                      type="radio"
                      checked={selectedGroup === "all"}
                      onChange={() => setSelectedGroup("all")}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">All Data</div>
                    <div className="text-xs text-gray-500">
                      Show data from all employees and speed plans
                    </div>
                  </div>
                  <div className="text-blue-600 text-sm font-medium">
                    {employees.length} employees, {expectedSpeeds.length} speed
                    plans
                  </div>
                </div>
              </div>

              {/* Filter group options */}
              {Object.entries(filterGroups)
                .filter(([key]) => key !== "all")
                .map(([key, group]) => {
                  // NEW: Display different info based on filter type
                  const getGroupInfo = () => {
                    if (group.type === "expectedSpeed") {
                      return {
                        count: group.expectedSpeeds?.length || 0,
                        label: "speed plans",
                      };
                    } else {
                      return {
                        count: group.employees?.length || 0,
                        label: "employees",
                      };
                    }
                  };

                  const groupInfo = getGroupInfo();

                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedGroup === key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedGroup(key)}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <input
                            type="radio"
                            checked={selectedGroup === key}
                            onChange={() => setSelectedGroup(key)}
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="font-medium">{group.name}</div>
                            {/* NEW: Show filter type badge */}
                            <span
                              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                group.type === "expectedSpeed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {group.type === "expectedSpeed"
                                ? "Speed"
                                : "Employee"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {group.description}
                          </div>
                        </div>
                        <div className="text-blue-600 text-sm font-medium">
                          {groupInfo.count} {groupInfo.label}
                        </div>
                        <button
                          className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(key);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Generate Dashboard Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => onFilterSelect(selectedGroup)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Generate Dashboard"
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 border-l border-gray-200 pl-6 hidden lg:block">
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Filter Groups
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Create custom filter groups by selecting the "Edit" button next
                to any group.
              </p>
              <p className="text-sm text-gray-600">
                Each group can filter by employees or expected speeds. Add items
                and a custom description to organize your dashboard views.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Group Editing View
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Edit {filterGroups[editingGroup].name}
            </h3>
            <button
              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              onClick={() => {
                setEditingGroup(null);
                setEditingDescription(false);
              }}
            >
              Cancel
            </button>
          </div>

          {/* NEW: Filter Type Selection */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="filterType"
                  value="employee"
                  checked={filterType === "employee"}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm">Employee</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="filterType"
                  value="expectedSpeed"
                  checked={filterType === "expectedSpeed"}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm">Expected Speed</span>
              </label>
            </div>
          </div>

          {/* Description editing */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            {editingDescription ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  rows={2}
                  placeholder="Enter a description for this group"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setEditingDescription(false)}
                    className="px-2 py-1 text-xs text-gray-600 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setEditingDescription(false)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    Save Description
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Description:
                  </span>
                  <p className="text-sm mt-1">
                    {newDescription ||
                      filterGroups[editingGroup].description ||
                      "No description provided"}
                  </p>
                </div>
                <button
                  onClick={() => setEditingDescription(true)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* NEW: Conditional rendering based on filter type */}
          {filterType === "employee"
            ? renderEmployeeSelection()
            : renderSpeedSelection()}
        </div>
      )}

      {/* Save Configuration Dialog (unchanged) */}
      {saveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Save Filter Configuration
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Configuration Name
              </label>
              <input
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                placeholder="My Filter Setup"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-md mb-4">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5"
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
                <div>
                  <p className="text-sm text-blue-800">
                    This will save your filter groups to this browser only. Your
                    setup will be available when you return to this site using
                    this same browser and device.
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    To use these filter groups on another device, use the
                    "Download as File" option after saving.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSaveDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                disabled={!configName.trim()}
                onClick={() => {
                  onSaveConfiguration(configName);
                  setSaveDialogOpen(false);
                  setConfigName("");
                }}
              >
                Save to Browser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Configuration Dialog (unchanged) */}
      {loadDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Load Saved Configuration
            </h3>

            {savedConfigs && savedConfigs.length > 0 ? (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md mb-4">
                <div className="divide-y divide-gray-200">
                  {savedConfigs.map((config, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        onLoadConfiguration(index);
                        setLoadDialogOpen(false);
                      }}
                    >
                      <div>
                        <div className="font-medium text-blue-600">
                          {config.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Saved on {config.date}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConfiguration(index);
                          }}
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md mb-4 text-center">
                <p className="text-gray-500">
                  No saved configurations found in this browser.
                </p>
              </div>
            )}

            <div className="p-3 bg-blue-50 rounded-md mb-4">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5"
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
                <p className="text-sm text-blue-800">
                  These configurations are saved in your browser on this device
                  only. To access configurations from another device, use the
                  "Upload from File" option.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setLoadDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterGroupSelection;
