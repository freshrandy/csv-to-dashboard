import React from "react";
import Colors from "./Colors";
import MetricCard from "./MetricCard";
import { tooltipContent } from "./tooltipContent";

/**
 * Enhanced ActivityMetrics Component
 * Displays key activity metrics with improved visual design using the updated color system
 */
const ActivityMetrics = ({ metrics, hasAddresses }) => {
  // Determine terminology based on data
  const locationTerm = hasAddresses ? "Home" : "Assessment";
  const locationTermPlural = hasAddresses ? "Homes" : "Assessments";

  // Helper to render a progress bar
  const renderProgressBar = (
    value,
    colorScheme = "primary",
    height = "h-2"
  ) => {
    let barColor;
    switch (colorScheme) {
      case "primary":
        barColor = Colors.primary[400];
        break;
      case "secondary":
        barColor = Colors.secondary[500];
        break;
      case "success":
        barColor = Colors.status.success;
        break;
      case "warning":
        barColor = Colors.status.warning;
        break;
      case "error":
        barColor = Colors.status.error;
        break;
      default:
        barColor = Colors.primary[400];
    }

    return (
      <div className={`${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-in-out`}
          style={{
            width: `${value}%`,
            backgroundColor: barColor,
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 metric-card">
      {/* Header with background color */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: Colors.gray[100] }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold" style={{ color: Colors.gray[700] }}>
            Activity Metrics
          </h2>
          <div className="text-sm text-gray-500 font-medium">
            {metrics.totalScans} Total Certifications
          </div>
        </div>
      </div>

      {/* Section titles and metrics */}
      <div className="p-5">
        {/* SECTION: Volume Metrics */}
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: Colors.gray[700] }}
        >
          Volume Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <MetricCard
            title={`Unique ${locationTermPlural}`}
            value={metrics.uniqueVisits}
            subtitle={
              hasAddresses ? "unique addresses" : "distinct assessments"
            }
            colorScheme="primary"
            tooltipContent={tooltipContent.uniqueVisits.content}
            tooltipTitle={tooltipContent.uniqueVisits.title}
          />

          <MetricCard
            title="Total Certifications"
            value={metrics.totalScans}
            subtitle="inc. incomplete"
            colorScheme="secondary"
            tooltipContent={tooltipContent.totalScans.content}
            tooltipTitle={tooltipContent.totalScans.title}
          />
        </div>

        {/* SECTION: Employee Metrics */}
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: Colors.gray[700] }}
        >
          Employee Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Active Personnel"
            value={metrics.activeEmployees}
            subtitle="employees"
            colorScheme="primary"
            tooltipContent={tooltipContent.activePersonnel.content}
            tooltipTitle={tooltipContent.activePersonnel.title}
          />

          <MetricCard
            title="Avg. Certifications / Employee"
            value={(metrics.totalScans / metrics.activeEmployees).toFixed(1)}
            subtitle="certifications"
            colorScheme="secondary"
            tooltipContent={tooltipContent.activePersonnel.content}
            tooltipTitle={tooltipContent.activePersonnel.title}
          />

          <MetricCard
            title={`Avg. ${locationTermPlural} / Employee`}
            value={(metrics.uniqueVisits / metrics.activeEmployees).toFixed(1)}
            subtitle={locationTermPlural.toLowerCase()}
            colorScheme="success"
            tooltipContent={tooltipContent.activePersonnel.content}
            tooltipTitle={tooltipContent.activePersonnel.title}
          />

          <MetricCard
            title={`Avg. Rooms / ${locationTerm}`}
            value={metrics.avgRooms}
            subtitle="rooms tested"
            colorScheme="info"
            tooltipContent={tooltipContent.activePersonnel.content}
            tooltipTitle={tooltipContent.activePersonnel.title}
          />
        </div>

        {/* SECTION: Installation Metrics */}
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: Colors.gray[700] }}
        >
          Installation Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Access Points Installation */}
          <MetricCard
            title="Mesh Nodes Installed"
            value={`${metrics.accessPoints.percentage}%`}
            subtitle={`${metrics.accessPoints.installed}/${metrics.accessPoints.recommended} mesh nodes installed / recommended`}
            colorScheme="primary"
            tooltipContent={tooltipContent.accessPoints.content}
            tooltipTitle={tooltipContent.accessPoints.title}
          />

          {/* Conversion Rate */}
          <MetricCard
            title={`${locationTerm} Conversion Rate`}
            value={`${metrics.conversionRate.value}%`}
            subtitle={`${metrics.conversionRate.homes}/${metrics.conversionRate.total} converted`}
            colorScheme="secondary"
            tooltipContent={tooltipContent.conversionRate.content}
            tooltipTitle={tooltipContent.conversionRate.title}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityMetrics;
