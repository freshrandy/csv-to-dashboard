import React, { useState, useEffect } from "react";
import Colors from "./Colors";

/**
 * Assessment Quality Indicators Component
 * Redesigned with horizontal gauge for Speed Test Success Rate
 * More compact visualization focusing solely on speed metrics
 * Following best practices by using metrics.js as single source of truth
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
  speedTestThreshold = 50, // Default to 50%
  onSpeedTestThresholdChange = () => {}, // No-op if not provided
}) => {
  // Local state to track the slider value
  const [sliderValue, setSliderValue] = useState(speedTestThreshold);
  // State for speed test data
  const [speedTestData, setSpeedTestData] = useState([]);

  // Extract performance metrics from metrics.js as single source of truth
  const performanceMetrics = metrics?.metrics?.performance || {};
  const summaryMetrics = metrics?.summary || {};

  // Get base metrics from metrics.js (pre-calculated)
  const baseSpeedTestSuccessRate = parseFloat(
    performanceMetrics.speedTestSuccessRate || 0
  );
  const avgSpeedRatio = parseFloat(performanceMetrics.averageSpeedRatio || 0);
  const totalEntries = summaryMetrics.totalEntries || 0;

  // Get raw data for recalculating threshold-based values
  const rawData = metrics?.rawData || [];

  // Pre-calculate entries with speed data - ideally this would be in metrics.js
  const entriesWithSpeedData = React.useMemo(() => {
    return rawData.filter((row) => row["Expected Speed"] && row["Actual Speed"])
      .length;
  }, [rawData]);

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

  // Get speed test success value
  const speedTestSuccessValue =
    speedTestData.length > 0 ? speedTestData[0].value : 0;

  // Determine color based on success rate
  const getBarColor = (value) => {
    if (value >= 80) return colors.primary[400]; // Good (jade/teal)
    if (value >= 50) return colors.primary[300]; // Medium (lighter teal)
    if (value >= 30) return colors.status.warning; // Warning (amber)
    return colors.status.error; // Poor (red)
  };

  // Calculate speed test coverage percentage
  const speedDataCoverageRate =
    totalEntries > 0 ? (entriesWithSpeedData / totalEntries) * 100 : 0;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Connection Quality Assessment 📊
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Speed Test Success Rate */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">
              Speed Test Success Rate
            </h3>
            <div
              className="text-2xl font-bold"
              style={{ color: getBarColor(speedTestSuccessValue) }}
            >
              {formatPercent(speedTestSuccessValue)}%
            </div>
          </div>

          <div className="text-sm text-center text-gray-500 mb-3">
            Percentage of tests achieving at least{" "}
            <span className="font-medium">{sliderValue}%</span> of plan speed
          </div>

          {/* Horizontal Progress Bar */}
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${speedTestSuccessValue}%`,
                backgroundColor: getBarColor(speedTestSuccessValue),
              }}
            ></div>
            {/* Add reference markers at 25%, 50%, 75% */}
            <div className="absolute top-0 left-1/4 h-8 border-l border-white opacity-50"></div>
            <div className="absolute top-0 left-1/2 h-8 border-l border-white opacity-50"></div>
            <div className="absolute top-0 left-3/4 h-8 border-l border-white opacity-50"></div>

            {/* Percentage labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 px-2 -mb-5">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Add some spacing after the markers */}
          <div className="mb-6"></div>

          {/* Threshold Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Success Threshold:</span>
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
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Additional Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {/* Success Rate Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Success Rate</div>
              <div
                className="text-xl font-bold"
                style={{ color: getBarColor(speedTestSuccessValue) }}
              >
                {formatPercent(speedTestSuccessValue)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Tests above threshold
              </div>
            </div>

            {/* Average Speed Ratio Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Avg Speed Ratio</div>
              <div
                className="text-xl font-bold"
                style={{ color: colors.electricBlue }}
              >
                {formatPercent(avgSpeedRatio)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Of expected speed
              </div>
            </div>

            {/* Test Count Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Speed Test Data</div>
              <div className="text-xl font-bold" style={{ color: colors.ash }}>
                {entriesWithSpeedData}
                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  / {totalEntries}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Entries with speed data / Total entries (
                {formatPercent(speedDataCoverageRate)}%)
              </div>
            </div>
          </div>

          {/* Reference to Standard Metric */}
          {baseSpeedTestSuccessRate > 0 && sliderValue !== 80 && (
            <div className="text-xs text-gray-500 mt-4 px-2">
              Note: The standard success rate at 80% threshold is{" "}
              <span className="font-medium">
                {formatPercent(baseSpeedTestSuccessRate)}%
              </span>
            </div>
          )}

          {/* Explanation Box */}
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">
                  About Speed Test Success Rate
                </h4>
                <p className="text-sm text-blue-600">
                  This gauge shows what percentage of speed tests achieved at
                  least {sliderValue}% of the planned speed. Use the slider to
                  adjust the threshold and see how it affects success rates.
                  {speedTestSuccessValue < 50 &&
                    " Current success rate indicates room for improvement in connection quality."}
                  {speedTestSuccessValue >= 80 &&
                    " The current rate shows excellent connection quality."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQualityIndicators;
