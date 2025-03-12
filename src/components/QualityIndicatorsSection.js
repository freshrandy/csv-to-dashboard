import React from "react";
import Colors from "../theme/Colors";

/**
 * Quality Indicators Section Component
 * Displays charts for speed test success and multi-floor assessment rates
 */
const QualityIndicatorsSection = ({ speedTestData, floorData }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4" style={{ color: Colors.ash }}>
        Assessment Quality Indicators 📊
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Speed Test Success Rate */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium mb-4 text-gray-700">
            Speed Test Success Rate
          </h3>
          <div className="flex flex-col items-center space-y-4">
            {/* Simple donut chart representation */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="#f3f4f6" />

                {/* Success segment - creates a donut chart effect */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={Colors.jade}
                  strokeWidth="20"
                  strokeDasharray={`${speedTestData[0].value * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />

                {/* Inner circle to create donut effect */}
                <circle cx="50" cy="50" r="30" fill="white" />

                {/* Text in the middle */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill={Colors.jade}
                >
                  {speedTestData[0].value}%
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: Colors.jade }}
                ></div>
                <span>Above 80% of Plan: {speedTestData[0].value}%</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: Colors.error }}
                ></div>
                <span>Below 80% of Plan: {speedTestData[1].value}%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">
            Percentage of tests achieving at least 80% of plan speed
          </p>
        </div>

        {/* Multi-Floor Assessment Rate */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium mb-4 text-gray-700">
            Multi-Floor Assessment Rate
          </h3>
          <div className="flex flex-col items-center space-y-4">
            {/* Simple donut chart representation */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="#f3f4f6" />

                {/* Success segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={Colors.electricBlue}
                  strokeWidth="20"
                  strokeDasharray={`${floorData[0].value * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />

                {/* Inner circle to create donut effect */}
                <circle cx="50" cy="50" r="30" fill="white" />

                {/* Text in the middle */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill={Colors.electricBlue}
                >
                  {floorData[0].value}%
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: Colors.electricBlue }}
                ></div>
                <span>Multi-Floor Assessments: {floorData[0].value}%</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: Colors.cloudGrey }}
                ></div>
                <span>Single-Floor Assessments: {floorData[1].value}%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">
            Percentage of assessments covering multiple floors
          </p>
        </div>
      </div>
    </div>
  );
};

export default QualityIndicatorsSection;
