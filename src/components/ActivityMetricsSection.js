import React from "react";
import Colors from "../theme/Colors";

/**
 * Activity Metrics Section Component
 * Displays key metrics about user activity and performance
 */
const ActivityMetricsSection = ({
  activityMetrics,
  locationTerm,
  locationTermPlural,
  hasAddresses,
  monthlyPrice,
}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4" style={{ color: Colors.ash }}>
        Activity Metrics 📊
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: Colors.cloudGrey }}
        >
          <p className="text-sm text-gray-600">Unique {locationTermPlural}</p>
          <div
            className="text-3xl font-bold mt-1"
            style={{ color: Colors.teal }}
          >
            {activityMetrics.uniqueVisits}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {hasAddresses
              ? "Unique addresses assessed"
              : "Unique assessments completed"}
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: Colors.cloudGrey }}
        >
          <p className="text-sm text-gray-600">Total Scans</p>
          <div
            className="text-3xl font-bold mt-1"
            style={{ color: Colors.electricBlue }}
          >
            {activityMetrics.totalScans}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            All scans (inc. incomplete)
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: Colors.cloudGrey }}
        >
          <p className="text-sm text-gray-600">Avg. Rooms Per {locationTerm}</p>
          <div
            className="text-3xl font-bold mt-1"
            style={{ color: Colors.jade }}
          >
            {activityMetrics.avgRooms}
          </div>
          <p className="text-xs text-gray-500 mt-1">Average rooms tested</p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: Colors.cloudGrey }}
        >
          <p className="text-sm text-gray-600">Speed Test Success</p>
          <div
            className="text-3xl font-bold mt-1"
            style={{ color: Colors.teal }}
          >
            {activityMetrics.speedTestSuccessRate}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tests with greater than 80% of plan speed
          </p>
        </div>
      </div>

      {/* Progress Bar Metrics */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Access Points Installation
          </span>
          <span className="text-sm font-medium" style={{ color: Colors.jade }}>
            {activityMetrics.accessPoints.installed}/
            {activityMetrics.accessPoints.recommended}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${activityMetrics.accessPoints.percentage}%`,
              backgroundColor: Colors.jade,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Installed vs Recommended</span>
          <span>{activityMetrics.accessPoints.percentage}%</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            {locationTerm} Conversion Rate
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: Colors.electricBlue }}
          >
            {activityMetrics.conversionRate.value}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${activityMetrics.conversionRate.value}%`,
              backgroundColor: Colors.electricBlue,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            {locationTermPlural} with installations / Total{" "}
            {locationTermPlural.toLowerCase()}
          </span>
          <span>
            {activityMetrics.conversionRate.homes}/
            {activityMetrics.conversionRate.total}
          </span>
        </div>
      </div>

      {/* Revenue Impact Section - with LTV */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Revenue Impact (Monthly)
          </span>
          <span className="text-sm font-medium" style={{ color: Colors.jade }}>
            ${activityMetrics.revenueImpact.monthly}
          </span>
        </div>
        {/* 1 Year LTV */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">1 Year LTV</span>
          <span className="text-sm font-medium" style={{ color: Colors.jade }}>
            ${activityMetrics.revenueImpact.yearOne}
          </span>
        </div>
        {/* 2 Year LTV */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">2 Year LTV</span>
          <span className="text-sm font-medium" style={{ color: Colors.jade }}>
            ${activityMetrics.revenueImpact.yearTwo}
          </span>
        </div>
        {/* 3 Year LTV */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">3 Year LTV</span>
          <span className="text-sm font-medium" style={{ color: Colors.jade }}>
            ${activityMetrics.revenueImpact.yearThree}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            Based on ${monthlyPrice.toFixed(2)}/month per installation
          </span>
          <span>{activityMetrics.accessPoints.installed} installations</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityMetricsSection;
