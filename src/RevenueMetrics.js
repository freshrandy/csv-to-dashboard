import React from "react";

/**
 * RevenueMetrics Component
 * Displays monthly revenue and LTV projections as a standalone dashboard section
 *
 * @param {Object} props
 * @param {Object} props.revenueData - Revenue impact data with monthly, yearOne, yearTwo, yearThree
 * @param {number} props.monthlyPrice - Price per installation per month
 * @param {number} props.installationCount - Total number of installations
 * @param {Object} props.colors - Brand color scheme for styling
 */
const RevenueMetrics = ({
  revenueData,
  monthlyPrice,
  installationCount,
  colors,
}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4" style={{ color: colors.ash }}>
        Revenue Impact 💰
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Monthly Revenue and Installation Stats */}
        <div>
          <div className="mb-4">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.cloudGrey }}
            >
              <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
              <div
                className="text-3xl font-bold mt-1"
                style={{ color: colors.jade }}
              >
                ${revenueData.monthly.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Based on {installationCount} installations at $
                {monthlyPrice.toFixed(2)}/month
              </p>
            </div>
          </div>

          {/* Installation Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 text-gray-700">
              Installation Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Average Revenue Per Installation
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.jade }}
                >
                  ${monthlyPrice.toFixed(2)}/month
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Installations
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.electricBlue }}
                >
                  {installationCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.jade }}
                >
                  ${revenueData.monthly.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - LTV Projections */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-gray-700">
            Lifetime Value Projections
          </h3>

          {/* LTV Timeline Chart (visual bar representation) */}
          <div className="mb-4">
            <div className="space-y-3">
              {/* 1 Year LTV */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">1 Year LTV</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.jade }}
                  >
                    ${revenueData.yearOne.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `33%`,
                      backgroundColor: colors.jade,
                    }}
                  ></div>
                </div>
              </div>

              {/* 2 Year LTV */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">2 Year LTV</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.jade }}
                  >
                    ${revenueData.yearTwo.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `66%`,
                      backgroundColor: colors.jade,
                    }}
                  ></div>
                </div>
              </div>

              {/* 3 Year LTV */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">3 Year LTV</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.jade }}
                  >
                    ${revenueData.yearThree.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `100%`,
                      backgroundColor: colors.jade,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Note about projections */}
          <div className="bg-blue-50 border border-blue-100 rounded p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Lifetime Value (LTV) projections assume
              continued subscription over the specified time period without
              churn. Actual results may vary based on retention rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueMetrics;
