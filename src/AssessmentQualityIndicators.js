import React, { useState, useEffect } from "react";
import Colors from "./Colors";

/**
 * Assessment Quality Indicators Component
 * Displays donut charts for speed test success and multi-floor assessment rates
 * Uses data directly from metrics.js for consistency
 *
 * @param {Object} props
 * @param {Object} props.metrics - Processed metrics data from metrics.js
 * @param {Object} props.colors - Brand color scheme for styling
 * @param {number} props.speedTestThreshold - Current threshold for speed test success rate (percentage)
 * @param {function} props.onSpeedTestThresholdChange - Handler for threshold changes
 */
const AssessmentQualityIndicators = ({
  metrics,
  colors,
  speedTestThreshold = 80, // Default to 80% if not provided
  onSpeedTestThresholdChange = () => {}, // No-op if not provided
}) => {
  // Local state to track the slider value
  const [sliderValue, setSliderValue] = useState(speedTestThreshold);
  // State for speed test data
  const [speedTestData, setSpeedTestData] = useState([]);

  // Get raw data to calculate custom success rates based on threshold
  const rawData = metrics?.rawData || [];

  // Calculate multi-floor assessment percentage from metrics
  const floorAssessments = metrics?.metrics?.performance?.floorAssessments || {
    multiFloorPercentage: 35.0,
    singleFloorPercentage: 65.0,
  };

  const multiFloorPercentage = floorAssessments.multiFloorPercentage;

  // Create data for floor chart
  const floorData = [
    {
      name: "Multi-Floor Assessments",
      value: multiFloorPercentage,
      color: colors.secondary[500],
    },
    {
      name: "Single-Floor Assessments",
      value: floorAssessments.singleFloorPercentage,
      color: colors.gray[200],
    },
  ];

  // Calculate speed test success rate based on current threshold
  useEffect(() => {
    if (!rawData || rawData.length === 0) {
      // Default data if no raw data available
      setSpeedTestData([
        {
          name: `Above ${sliderValue}% of Plan`,
          value: 0,
          color: colors.primary[400],
        },
        {
          name: `Below ${sliderValue}% of Plan`,
          value: 100,
          color: colors.status.error,
        },
      ]);
      return;
    }

    // Calculate success rate based on current threshold
    let speedTestCount = 0;
    let successfulSpeedTests = 0;

    rawData.forEach((row) => {
      if (row["Expected Speed"] && row["Actual Speed"]) {
        speedTestCount++;
        // Use the current slider value to determine success
        if (
          row["Actual Speed"] >=
          (sliderValue / 100) * row["Expected Speed"]
        ) {
          successfulSpeedTests++;
        }
      }
    });

    const speedTestSuccessRate =
      speedTestCount > 0 ? (successfulSpeedTests / speedTestCount) * 100 : 0;

    // Update chart data
    setSpeedTestData([
      {
        name: `Above ${sliderValue}% of Plan`,
        value: speedTestSuccessRate,
        color: colors.primary[400],
      },
      {
        name: `Below ${sliderValue}% of Plan`,
        value: parseFloat((100 - speedTestSuccessRate).toFixed(1)),
        color: colors.status.error,
      },
    ]);
  }, [sliderValue, rawData, colors]);

  // Update local slider value when prop changes
  useEffect(() => {
    setSliderValue(speedTestThreshold);
  }, [speedTestThreshold]);

  // Handle slider changes
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
  };

  // Handle slider after user finishes dragging
  const handleSliderChangeComplete = () => {
    onSpeedTestThresholdChange(sliderValue);
  };

  // Helper function to format percentages consistently
  const formatPercent = (value) => {
    // Use toFixed(1) to limit to 1 decimal place and ensure we're working with a number
    return typeof value === "number" ? value.toFixed(1) : "0.0";
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Assessment Quality Indicators 📊
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Speed Test Success Rate */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium mb-2 text-gray-700">
            Speed Test Success Rate
          </h3>
          <div className="text-xs text-center text-gray-500 mb-3">
            Percentage of tests achieving at least{" "}
            <span className="font-medium">{sliderValue}%</span> of plan speed
          </div>

          {/* Threshold Slider */}
          <div className="w-full max-w-xs mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Threshold:</span>
              <span className="font-medium">{sliderValue}% of plan</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              onMouseUp={handleSliderChangeComplete}
              onTouchEnd={handleSliderChangeComplete}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                // Custom styling for the slider thumb
                "--thumb-color": colors.jade,
                "--track-color": colors.cloudGrey,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {/* Simple donut chart representation */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="#f3f4f6" />

                {/* Success segment - creates a donut chart effect */}
                {speedTestData.length > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={colors.jade}
                    strokeWidth="20"
                    strokeDasharray={`${speedTestData[0].value * 2.51} 251`}
                    transform="rotate(-90 50 50)"
                  />
                )}

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
                  fill={colors.jade}
                >
                  {speedTestData.length > 0
                    ? formatPercent(speedTestData[0].value)
                    : "0.0"}
                  %
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: colors.jade }}
                ></div>
                <span>
                  Above {sliderValue}% of Plan:{" "}
                  {speedTestData.length > 0
                    ? formatPercent(speedTestData[0].value)
                    : "0.0"}
                  %
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: "#EF4444" }}
                ></div>
                <span>
                  Below {sliderValue}% of Plan:{" "}
                  {speedTestData.length > 0
                    ? formatPercent(speedTestData[1].value)
                    : "0.0"}
                  %
                </span>
              </div>
            </div>
          </div>
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
                  stroke={colors.electricBlue}
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
                  fill={colors.electricBlue}
                >
                  {formatPercent(floorData[0].value)}%
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: colors.electricBlue }}
                ></div>
                <span>
                  Multi-Floor Assessments: {formatPercent(floorData[0].value)}%
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: colors.cloudGrey }}
                ></div>
                <span>
                  Single-Floor Assessments: {formatPercent(floorData[1].value)}%
                </span>
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

export default AssessmentQualityIndicators;
