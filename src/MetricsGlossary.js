import React from "react";
import Colors from "./Colors";

const MetricsGlossary = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Metrics glossary data
  const metricsData = {
    activity: [
      {
        name: "Total Scans",
        calculation: "Count of all rows in the CSV data",
        description: "Total number of assessment entries in the dataset",
      },
      {
        name: "Unique Visits",
        calculation: "Count of unique address combinations",
        description: "Number of unique locations assessed",
      },
      {
        name: "Avg Scans Per Employee",
        calculation: "Total Scans ÷ Number of active employees",
        description: "Average number of assessments conducted by each employee",
      },
      {
        name: "Avg Homes Per Employee",
        calculation: "Unique Visits ÷ Number of active employees",
        description:
          "Average number of unique locations assessed by each employee",
      },
      {
        name: "Multiple Complete Visits",
        calculation:
          'Count of unique addresses (including unit) with more than one assessment record where Status = "Complete"',
        description:
          "Number of distinct locations that received more than one completed assessment during the period.",
      },
    ],
    installation: [
      {
        name: "Total Nodes Recommended",
        calculation: 'Sum of all values in the "Mesh Nodes Recommended" column',
        description:
          "Total number of access points recommended across all assessments",
      },
      {
        name: "Total Nodes Installed",
        calculation: 'Sum of all values in the "Mesh Nodes Installed" column',
        description: "Total number of access points actually installed",
      },
      {
        name: "Installation Rate",
        calculation: "(Total Nodes Installed ÷ Total Nodes Recommended) × 100",
        description:
          "Percentage of recommended mesh nodes that were actually installed",
      },
      {
        name: "Average Nodes Recommended",
        calculation: "Total Nodes Recommended ÷ Number of assessments",
        description: "Average number of mesh nodes recommended per assessment",
      },
    ],
    quality: [
      {
        name: "Average Quality Score",
        calculation:
          'Sum of all "Quality of Install Score" values ÷ Number of assessments with quality scores',
        description: "Average quality score across all installations (0-100%)",
      },
      {
        name: "Average Rooms Tested",
        calculation: 'Sum of all "Rooms Tested" values ÷ Number of assessments',
        description: "Average number of rooms tested in each assessment",
      },
      {
        name: "Speed Test Success Rate",
        calculation:
          "(Number of assessments with actual speed ≥ 50% of expected speed ÷ Number of assessments with speed tests) × 100",
        description:
          "Percentage of installations where actual speed reached at least 50% of the expected speed",
      },
      {
        name: "Average Speed Ratio",
        calculation:
          '(Sum of all "Actual Speed" values ÷ Sum of all "Expected Speed" values) × 100',
        description:
          "Average percentage of expected internet speed that was actually achieved",
      },
    ],
    conversion: [
      {
        name: "Home/Assessment Conversion Rate",
        calculation:
          "(Number of unique addresses with at least one mesh node installed ÷ Total number of unique addresses assessed) × 100",
        description:
          "Percentage of assessed locations where technicians installed at least one mesh nodes. Example: If technicians visit 100 homes but only install mesh nodes in 14 of them, the conversion rate is 14 percent.",
      },
      {
        name: "Regional Conversion Rates",
        calculation:
          "(Number of installations in region ÷ Number of assessments in region) × 100",
        description:
          "Conversion rate broken down by geographic region (state/province)",
      },
    ],
    weekly: [
      {
        name: "Weekly Conversion Rate",
        calculation:
          "(Number of installations in week ÷ Number of assessments in week) × 100",
        description:
          "Weekly percentage of assessments that resulted in installations",
      },
      {
        name: "Unique Homes per Week",
        calculation: "Count of unique addresses assessed each week",
        description: "Number of different locations assessed each week",
      },
    ],
    employee: [
      {
        name: "Employee Conversion Rate",
        calculation:
          "(Number of installations by employee ÷ Number of assessments by employee) × 100",
        description:
          "Percentage of an employee's assessments that resulted in installations",
      },
      {
        name: "Employee Average Quality Score",
        calculation:
          "Sum of employee's quality scores ÷ Number of assessments with quality scores",
        description:
          "Average quality score for a specific employee's installations",
      },
      {
        name: "Employee Average Rooms Tested",
        calculation:
          "Sum of rooms tested by employee ÷ Number of assessments by employee",
        description:
          "Average number of rooms tested per assessment by an employee",
      },
    ],
  };

  // Render a section of metrics
  const renderMetricsSection = (title, metrics) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3" style={{ color: Colors.ash }}>
        {title}
      </h3>
      <div className="bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Metric
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Calculation
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {metrics.map((metric, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {metric.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {metric.calculation}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {metric.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-xl font-bold" style={{ color: Colors.ash }}>
            Dashboard Metrics Glossary
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-grow">
          <p className="mb-6 text-gray-600">
            This glossary explains how each metric in the dashboard is
            calculated and what it means.
          </p>

          {renderMetricsSection("Activity Metrics", metricsData.activity)}
          {renderMetricsSection(
            "Installation Metrics",
            metricsData.installation
          )}
          {renderMetricsSection("Quality Metrics", metricsData.quality)}
          {renderMetricsSection("Conversion Metrics", metricsData.conversion)}
          {renderMetricsSection("Weekly Metrics", metricsData.weekly)}
          {renderMetricsSection("Employee Metrics", metricsData.employee)}
        </div>

        {/* Footer */}
        <div className="border-t bg-white p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsGlossary;
