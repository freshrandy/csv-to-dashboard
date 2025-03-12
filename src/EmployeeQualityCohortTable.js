import React, { useState, useEffect } from "react";
import { generateEmployeeCohortAnalysis } from "./employeeCohortAnalysis";

const EmployeeQualityCohortTable = ({ csvData }) => {
  const [visibleCohorts, setVisibleCohorts] = useState({});
  const [cohortData, setCohortData] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // For new cohort input
  const [newCohort, setNewCohort] = useState({
    label: "",
    startDate: "",
    endDate: "",
  });

  // Generate a unique ID for a new cohort
  const generateCohortId = () => {
    return `cohort-${Date.now()}`;
  };

  // Add a new cohort
  const addCohort = () => {
    if (!newCohort.label || !newCohort.startDate || !newCohort.endDate) {
      setError("Please fill in all fields for the new cohort");
      return;
    }

    if (cohorts.length >= 4) {
      setError("Maximum of 4 cohorts allowed");
      return;
    }

    // Create the new cohort with a unique ID
    const cohortToAdd = {
      id: generateCohortId(),
      label: newCohort.label,
      startDate: newCohort.startDate,
      endDate: newCohort.endDate,
    };

    // Add to cohorts list
    const updatedCohorts = [...cohorts, cohortToAdd];
    setCohorts(updatedCohorts);

    // Reset the form
    setNewCohort({
      label: "",
      startDate: "",
      endDate: "",
    });

    // Clear any errors
    setError(null);

    // Regenerate analysis with the new cohort
    analyzeCohorts(updatedCohorts);
  };

  // Remove a cohort
  const removeCohort = (cohortId) => {
    const updatedCohorts = cohorts.filter((cohort) => cohort.id !== cohortId);
    setCohorts(updatedCohorts);

    // Update visibility state
    const updatedVisibility = { ...visibleCohorts };
    delete updatedVisibility[cohortId];
    setVisibleCohorts(updatedVisibility);

    // Regenerate analysis with the updated cohorts
    analyzeCohorts(updatedCohorts);
  };

  // Handle input change for new cohort form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCohort((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Analyze cohorts with the provided data
  const analyzeCohorts = async (cohortsToAnalyze) => {
    try {
      setIsLoading(true);

      if (!csvData) {
        setError("No data provided");
        setIsLoading(false);
        return;
      }

      if (!cohortsToAnalyze || cohortsToAnalyze.length === 0) {
        setCohortData({
          chartData: [],
          cohorts: [],
          summaryStats: {
            totalEmployees: 0,
            totalCohorts: 0,
            averageEmployeesPerCohort: 0,
            dateRange: "No date range",
          },
        });
        setIsLoading(false);
        return;
      }

      // Generate the cohort analysis
      const analysis = generateEmployeeCohortAnalysis(
        csvData,
        cohortsToAnalyze
      );
      setCohortData(analysis);

      // Update visibility settings for cohorts
      const initialVisibility = {};
      analysis.cohorts.forEach((cohort) => {
        // If we already have a visibility setting, keep it, otherwise default to visible
        initialVisibility[cohort.id] =
          visibleCohorts[cohort.id] !== undefined
            ? visibleCohorts[cohort.id]
            : true;
      });
      setVisibleCohorts(initialVisibility);

      setIsLoading(false);
    } catch (err) {
      console.error("Error analyzing cohort data:", err);
      setError("Error analyzing cohort data");
      setIsLoading(false);
    }
  };

  // Toggle cohort visibility
  const toggleCohort = (cohortId) => {
    setVisibleCohorts((prev) => ({
      ...prev,
      [cohortId]: !prev[cohortId],
    }));
  };

  // Show all cohorts
  const showAllCohorts = () => {
    const allVisible = {};
    cohortData.cohorts.forEach((cohort) => {
      allVisible[cohort.id] = true;
    });
    setVisibleCohorts(allVisible);
  };

  // Hide all cohorts
  const hideAllCohorts = () => {
    const allHidden = {};
    cohortData.cohorts.forEach((cohort) => {
      allHidden[cohort.id] = false;
    });
    setVisibleCohorts(allHidden);
  };

  // When CSV data changes, regenerate analysis
  useEffect(() => {
    if (csvData) {
      analyzeCohorts(cohorts);
    }
  }, [csvData]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Employee Quality Cohort Analysis
        </h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading cohort data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Employee Quality Cohort Analysis
      </h2>

      {/* Cohort Creation Form */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Create New Cohort (Max 4)</h3>

        {error && (
          <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cohort Label
            </label>
            <input
              type="text"
              name="label"
              value={newCohort.label}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. Winter 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={newCohort.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={newCohort.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addCohort}
              disabled={cohorts.length >= 4}
              className={`p-2 rounded font-medium ${
                cohorts.length >= 4
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Add Cohort
            </button>
          </div>
        </div>

        {/* Display current cohorts */}
        {cohorts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Current Cohorts:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {cohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                >
                  <div>
                    <div className="font-medium">{cohort.label}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(cohort.startDate)} to{" "}
                      {formatDate(cohort.endDate)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCohort(cohort.id)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* No cohorts yet message */}
      {(!cohortData ||
        !cohortData.cohorts ||
        cohortData.cohorts.length === 0) && (
        <div className="bg-yellow-50 p-4 rounded mb-4">
          <p className="text-yellow-700">
            Please create at least one cohort to see analysis results.
          </p>
        </div>
      )}

      {/* Summary Stats Box - Only show if we have data */}
      {cohortData && cohortData.cohorts && cohortData.cohorts.length > 0 && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-gray-500">Date Range</span>
              <div className="font-medium">
                {cohortData.summaryStats.dateRange}
              </div>
            </div>
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-gray-500">Total Employees</span>
              <div className="font-medium">
                {cohortData.summaryStats.totalEmployees}
              </div>
            </div>
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-gray-500">Active Cohorts</span>
              <div className="font-medium">
                {cohortData.summaryStats.totalCohorts}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                Avg. Employees per Cohort
              </span>
              <div className="font-medium">
                {cohortData.summaryStats.averageEmployeesPerCohort.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Cohort toggles */}
          {cohortData.cohorts.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Show/Hide Cohorts:
                </h3>
                <div className="space-x-2">
                  <button
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                    onClick={showAllCohorts}
                  >
                    Show All
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
                    onClick={hideAllCohorts}
                  >
                    Hide All
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {cohortData.cohorts.map((cohort) => (
                  <button
                    key={`toggle-${cohort.id}`}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      visibleCohorts[cohort.id]
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                    onClick={() => toggleCohort(cohort.id)}
                  >
                    <div className="flex items-center">
                      {cohort.label}
                      <span className="ml-1 text-xs">
                        ({cohort.employeeCount}{" "}
                        {cohort.employeeCount === 1 ? "employee" : "employees"})
                      </span>
                      {visibleCohorts[cohort.id] ? " ✓" : " ⨯"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cohort Table - Only show if we have data */}
      {cohortData &&
        cohortData.chartData &&
        cohortData.chartData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">
                    Cohort
                  </th>
                  {/* Get all possible weeks */}
                  {[...new Set(cohortData.chartData.map((d) => d.weeksSince))]
                    .sort((a, b) => a - b)
                    .map((week) => (
                      <th
                        key={`week-${week}`}
                        className="px-4 py-2 border border-gray-200 text-center text-sm font-medium text-gray-700"
                      >
                        {week === 0 ? "Start" : `Week ${week}`}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.cohorts
                  .filter((cohort) => visibleCohorts[cohort.id])
                  .map((cohort) => {
                    // Find all weeks for this cohort
                    const cohortWeeks = cohortData.chartData
                      .filter((d) => d[cohort.id] !== undefined)
                      .map((d) => d.weeksSince);

                    // Get all possible weeks
                    const allWeeks = [
                      ...new Set(cohortData.chartData.map((d) => d.weeksSince)),
                    ].sort((a, b) => a - b);

                    return (
                      <tr key={cohort.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border border-gray-200 text-sm font-medium">
                          <div>{cohort.label}</div>
                          <div className="text-xs text-gray-500">
                            {cohort.employeeCount} employees
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(cohort.startDate)} -{" "}
                            {formatDate(cohort.endDate)}
                          </div>
                        </td>
                        {allWeeks.map((week) => {
                          // Find data for this week
                          const weekData = cohortData.chartData.find(
                            (d) => d.weeksSince === week
                          );
                          const score = weekData ? weekData[cohort.id] : null;
                          const employeeCount = weekData
                            ? weekData[`${cohort.id}_count`] || 0
                            : 0;
                          const scanCount = weekData
                            ? weekData[`${cohort.id}_scans`] || 0
                            : 0;

                          // Set color based on quality score (green for higher values)
                          const scoreColor =
                            score === null
                              ? ""
                              : score >= 0.75
                              ? "bg-green-50 text-green-800"
                              : score >= 0.6
                              ? "bg-green-50 text-green-700 opacity-75"
                              : score >= 0.4
                              ? "bg-yellow-50 text-yellow-800"
                              : "bg-red-50 text-red-800";

                          return (
                            <td
                              key={`${cohort.id}-week-${week}`}
                              className={`px-4 py-3 border border-gray-200 text-center ${scoreColor}`}
                            >
                              {score !== null ? (
                                <>
                                  <div className="font-medium">
                                    {(score * 100).toFixed(0)}%
                                  </div>
                                  {(employeeCount > 0 || scanCount > 0) && (
                                    <div className="text-xs opacity-75">
                                      {scanCount}{" "}
                                      {scanCount === 1 ? "scan" : "scans"},{" "}
                                      {employeeCount}{" "}
                                      {employeeCount === 1
                                        ? "employee"
                                        : "employees"}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">No data</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">How to Use This Table</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            Create up to 4 custom cohorts by defining a label and date range.
          </li>
          <li>
            Each cohort will include employees who had their first scan within
            the specified date range.
          </li>
          <li>
            The table shows progress by weeks since each employee's first scan.
          </li>
          <li>
            Cell values show the average quality of install score percentage for
            that cohort in that week
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeQualityCohortTable;
