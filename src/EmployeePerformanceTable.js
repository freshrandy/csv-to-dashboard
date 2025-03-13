import React, { useState, useEffect } from "react";
import _ from "lodash";

const EmployeePerformanceTable = ({ data: csvData }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [displayData, setDisplayData] = useState([]); // For pagination
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "conversionRate",
    direction: "desc",
  });
  const [visibleEmployees, setVisibleEmployees] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const analyzeData = async () => {
      try {
        setIsLoading(true);

        if (!csvData || !csvData.length) {
          setError("No data provided");
          setIsLoading(false);
          return;
        }

        // Group by employee email
        const employeeGroups = _.groupBy(csvData, "Employee Email");

        // Filter out @routethis.com email addresses
        const employeeGroupsFiltered = Object.entries(employeeGroups)
          .filter(([email]) => !email.includes("@routethis.com"))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        // Calculate metrics for each employee
        const analysisData = Object.entries(employeeGroupsFiltered)
          .map(([email, installations]) => {
            if (!email) return null;

            // Count total scans
            const totalScans = installations.length;

            // Calculate conversion rate (installations with Mesh Nodes Installed > 0)
            const completedInstallations = installations.filter(
              (inst) =>
                inst["Mesh Nodes Installed"] && inst["Mesh Nodes Installed"] > 0
            ).length;

            const conversionRate =
              totalScans > 0 ? (completedInstallations / totalScans) * 100 : 0;

            // Calculate average quality score
            const qualityScores = installations
              .filter(
                (inst) =>
                  inst["Quality of Install Score"] !== null &&
                  inst["Quality of Install Score"] !== undefined
              )
              .map((inst) => inst["Quality of Install Score"]);

            const avgQualityScore =
              qualityScores.length > 0 ? _.mean(qualityScores) : 0;

            // Calculate average rooms tested
            const roomsTested = installations
              .filter(
                (inst) =>
                  inst["Rooms Tested"] !== null &&
                  inst["Rooms Tested"] !== undefined
              )
              .map((inst) => inst["Rooms Tested"]);

            const avgRoomsTested =
              roomsTested.length > 0 ? _.mean(roomsTested) : 0;

            // Calculate speed test success rate
            const speedTests = installations.filter(
              (inst) =>
                inst["Expected Speed"] !== null &&
                inst["Expected Speed"] !== undefined &&
                inst["Actual Speed"] !== null &&
                inst["Actual Speed"] !== undefined
            );

            const successfulSpeedTests = speedTests.filter(
              (inst) => inst["Actual Speed"] >= 0.8 * inst["Expected Speed"]
            ).length;

            const speedTestSuccessRate =
              speedTests.length > 0
                ? (successfulSpeedTests / speedTests.length) * 100
                : 0;

            // Format employee display name
            const displayName = formatEmployeeName(email);

            return {
              email,
              name: displayName,
              totalScans,
              completedInstallations,
              conversionRate,
              qualityScore: avgQualityScore,
              avgRoomsTested,
              speedTestSuccessRate,
            };
          })
          .filter(Boolean);

        // Initialize all employees as visible
        const initialVisibility = {};
        analysisData.forEach((employee) => {
          initialVisibility[employee.email] = true;
        });
        setVisibleEmployees(initialVisibility);

        // Sort the data
        const sortedData = sortData(analysisData, sortConfig);
        setData(sortedData);
        setFilteredData(sortedData);

        // Calculate total pages
        setTotalPages(Math.ceil(sortedData.length / itemsPerPage));

        // Set initial display data
        updateDisplayData(sortedData, 1);

        setIsLoading(false);
      } catch (err) {
        console.error("Error analyzing data:", err);
        setError("Error loading and analyzing data");
        setIsLoading(false);
      }
    };

    analyzeData();
  }, [csvData, sortConfig]);

  // Update display data when filtered data or pagination changes
  useEffect(() => {
    const filtered = data.filter(
      (employee) => visibleEmployees[employee.email]
    );
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    updateDisplayData(filtered, 1); // Reset to first page when filter changes
    setCurrentPage(1);
  }, [data, visibleEmployees, itemsPerPage]);

  // Update display data when page changes
  const updateDisplayData = (dataArray, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayData(dataArray.slice(startIndex, endIndex));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayData(filteredData, page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setTotalPages(Math.ceil(filteredData.length / newItemsPerPage));
    setCurrentPage(1); // Reset to first page
    updateDisplayData(filteredData, 1);
  };

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

  // Sort data based on configuration
  const sortData = (data, config) => {
    return [...data].sort((a, b) => {
      if (a[config.key] < b[config.key]) {
        return config.direction === "asc" ? -1 : 1;
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Handle sort requests
  const requestSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // Get class for sort button
  const getSortButtonClass = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === "asc"
        ? "pl-1 text-blue-500 rotate-180 transform inline-block"
        : "pl-1 text-blue-500 inline-block";
    }
    return "pl-1 text-gray-400 opacity-50 inline-block";
  };

  // Toggle employee visibility
  const toggleEmployee = (email) => {
    setVisibleEmployees((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  // Show all employees
  const showAllEmployees = () => {
    const newVisibility = {};
    data.forEach((employee) => {
      newVisibility[employee.email] = true;
    });
    setVisibleEmployees(newVisibility);
  };

  // Hide all employees
  const hideAllEmployees = () => {
    const newVisibility = {};
    data.forEach((employee) => {
      newVisibility[employee.email] = false;
    });
    setVisibleEmployees(newVisibility);
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];

    // Always add first page button
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        &laquo;
      </button>
    );

    // Previous page button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        &lt;
      </button>
    );

    // Calculate range of page buttons to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust start if end is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    // Add page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next page button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        &gt;
      </button>
    );

    // Always add last page button
    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        &raquo;
      </button>
    );

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4" style={{ color: Colors.ash }}>
          Employee Performance Rankings
        </h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Employee Performance Rankings
        </h2>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Employee Performance Rankings</h2>

      <div className="mb-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">Total Employees</span>
            <div className="font-medium">{data.length} Employees</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Data Range</span>
            <div className="font-medium">Jan 1, 2025 - Mar 12, 2025</div>
          </div>
        </div>

        {/* Employee visibility controls */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              Show/Hide Employees:
            </h3>
            <div className="space-x-2">
              <button
                className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                onClick={showAllEmployees}
              >
                Show All
              </button>
              <button
                className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
                onClick={hideAllEmployees}
              >
                Hide All
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded">
            {data.map((employee) => (
              <button
                key={`toggle-${employee.email}`}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  visibleEmployees[employee.email]
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
                onClick={() => toggleEmployee(employee.email)}
              >
                {employee.name}
                {visibleEmployees[employee.email] ? " ✓" : " ⨯"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Employee
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("conversionRate")}
              >
                Conversion Rate
                <span className={getSortButtonClass("conversionRate")}>▼</span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("totalScans")}
              >
                Total Scans
                <span className={getSortButtonClass("totalScans")}>▼</span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("completedInstallations")}
              >
                Installations
                <span className={getSortButtonClass("completedInstallations")}>
                  ▼
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("qualityScore")}
              >
                Quality Score
                <span className={getSortButtonClass("qualityScore")}>▼</span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("avgRoomsTested")}
              >
                Avg. Rooms
                <span className={getSortButtonClass("avgRoomsTested")}>▼</span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("speedTestSuccessRate")}
              >
                Speed Test Success
                <span className={getSortButtonClass("speedTestSuccessRate")}>
                  ▼
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((employee) => (
              <tr key={employee.email}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </div>
                  <div className="text-xs text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="h-2.5 rounded-full mr-2"
                      style={{
                        width: `${Math.min(100, employee.conversionRate)}px`,
                        backgroundColor: `hsl(${
                          Math.min(employee.conversionRate, 100) * 1.2
                        }, 70%, 45%)`,
                      }}
                    ></div>
                    <span className="text-sm font-medium">
                      {employee.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.totalScans}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.completedInstallations}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm font-medium"
                    style={{
                      color: `rgba(${255 - employee.qualityScore * 255}, ${
                        employee.qualityScore * 255
                      }, 100)`,
                    }}
                  >
                    {(employee.qualityScore * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.avgRoomsTested.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm font-medium"
                    style={{
                      color:
                        employee.speedTestSuccessRate > 70
                          ? "#059669"
                          : "#DC2626",
                    }}
                  >
                    {employee.speedTestSuccessRate.toFixed(1)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {filteredData.length > itemsPerPage && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-center">
            {renderPaginationButtons()}
          </div>

          <div className="text-sm text-gray-700 mt-4 sm:mt-0">
            Showing{" "}
            {Math.min(
              filteredData.length,
              (currentPage - 1) * itemsPerPage + 1
            )}{" "}
            to {Math.min(filteredData.length, currentPage * itemsPerPage)} of{" "}
            {filteredData.length} employees
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p className="mt-2">
          Currently showing {filteredData.length} of {data.length} employees.
        </p>
      </div>
    </div>
  );
};

export default EmployeePerformanceTable;
