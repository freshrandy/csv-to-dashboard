import React from "react";
import Colors from "./Colors";

/**
 * Installation Overview Card Component
 * A comprehensive card that displays the full installation funnel metrics:
 * certifications, recommendations, installations, and installation ratio
 *
 * @param {Object} props
 * @param {number} props.completedCertifications - Number of completed certifications
 * @param {number} props.nodesRecommended - Total number of mesh nodes recommended
 * @param {number} props.nodesInstalled - Total number of mesh nodes installed
 * @param {number} props.installationRatio - Percentage of recommended nodes that were installed
 * @param {Object} props.tooltipContent - Optional tooltip content for educational context
 */
const InstallationOverviewCard = ({
  completedCertifications,
  nodesRecommended,
  nodesInstalled,
  installationRatio,
  tooltipContent,
}) => {
  // Format the installation ratio for display
  const formattedRatio =
    typeof installationRatio === "number"
      ? `${installationRatio.toFixed(1)}%`
      : "N/A";

  // Calculate averages for deeper insights
  const avgNodesRecommended =
    completedCertifications > 0
      ? (nodesRecommended / completedCertifications).toFixed(1)
      : 0;

  const avgNodesInstalled =
    completedCertifications > 0
      ? (nodesInstalled / completedCertifications).toFixed(1)
      : 0;

  // Determine color scheme based on installation ratio
  const getRatioColor = (ratio) => {
    if (ratio >= 80) return Colors.status.success;
    if (ratio >= 60) return Colors.secondary[500]; // electric blue
    if (ratio >= 40) return Colors.status.warning;
    return Colors.status.error;
  };

  const ratioColor = getRatioColor(installationRatio);

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Completed Certifications Overview 🏠
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-gray-500">Installation Ratio</div>
          <div className="text-xl font-bold" style={{ color: ratioColor }}>
            {formattedRatio}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, installationRatio)}%`,
              backgroundColor: ratioColor,
            }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {nodesInstalled} of {nodesRecommended} recommended nodes installed
        </div>
      </div>

      {/* Installation funnel metrics in a grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">
              Completed Certifications
            </div>
            <div
              className="text-xl font-semibold"
              style={{ color: Colors.gray[800] }}
            >
              {completedCertifications}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div
            className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full"
            style={{ backgroundColor: `${Colors.secondary[500]}20` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              style={{ color: Colors.secondary[500] }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Recommended</div>
            <div
              className="text-xl font-semibold"
              style={{ color: Colors.secondary[600] }}
            >
              {nodesRecommended}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div
            className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full"
            style={{ backgroundColor: `${Colors.primary[400]}20` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              style={{ color: Colors.primary[400] }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Installed</div>
            <div
              className="text-xl font-semibold"
              style={{ color: Colors.primary[400] }}
            >
              {nodesInstalled}
            </div>
          </div>
        </div>
      </div>

      {/* Additional insights */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500">Avg. Recommended:</span>
            <span
              className="ml-1 font-medium"
              style={{ color: Colors.secondary[600] }}
            >
              {avgNodesRecommended}
            </span>
            <span className="text-gray-500 ml-1">per cert</span>
          </div>
          <div>
            <span className="text-gray-500">Avg. Installed:</span>
            <span
              className="ml-1 font-medium"
              style={{ color: Colors.primary[400] }}
            >
              {avgNodesInstalled}
            </span>
            <span className="text-gray-500 ml-1">per cert</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 italic">
          * Certification count includes only completed assessments
        </div>
      </div>
    </div>
  );
};

export default InstallationOverviewCard;
