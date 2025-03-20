import React from "react";
import MetricCard from "./MetricCard";
import Colors from "./Colors";

/**
 * ActivityMetrics Component
 * Displays a grid of key metrics cards using data from metrics.js
 *
 * @param {Object} props
 * @param {Object} props.metrics - Processed metrics data from metrics.js
 */
const ActivityMetrics = ({ metrics }) => {
  // Define tooltip content for each metric card
  const tooltipContent = {
    totalScans: {
      title: "Total Certifications",
      content:
        "The total number of certification assessments performed. This includes all assessments recorded, even those that didn't result in installations.",
    },
    uniqueHomes: {
      title: "Unique Homes",
      content:
        "The count of distinct homes assessed. If a single home has had multiple assessments, it's only counted once.",
    },
    activeEmployees: {
      title: "Active Employees",
      content:
        "The number of employees who have performed at least one certification during this time period.",
    },
    conversionRate: {
      title: "Conversion Rate",
      content:
        "The percentage of home assessments that resulted in at least one mesh node installation. This is a key performance indicator for the program's effectiveness.",
    },
    nodesInstalled: {
      title: "Mesh Nodes Installed",
      content:
        "The total number of mesh nodes installed across all home assessments.",
    },
    nodesRecommended: {
      title: "Total Mesh Nodes Recommended",
      content:
        "The total number of mesh nodes that were recommended across all assessments.",
    },
    installRatio: {
      title: "Installation Ratio",
      content:
        "The percentage of recommended mesh nodes that were actually installed. Higher rates indicate better alignment between recommendations and customer acceptance.",
    },
    avgRoomsTested: {
      title: "Average Rooms Tested",
      content:
        "The average number of rooms tested per assessment. Higher numbers generally indicate more thorough assessments.",
    },
    multiFloorRate: {
      title: "Multi-Floor Assessment Rate",
      content:
        "The percentage of assessments that covered multiple floors. Multi-floor assessments are important for homes with more than one level.",
    },
    speedTestSuccess: {
      title: "Speed Test Success Rate",
      content:
        "The percentage of speed tests where the actual speed was at least 80% of the expected speed. This indicates a successful mesh installation.",
    },
  };

  // Extract data directly from the metrics object
  const totalEntries = metrics?.summary?.totalEntries || 0;
  const uniqueHomes = metrics?.summary?.uniqueHomes || 0;
  const activeEmployees = metrics?.metrics?.employees?.activeCount || 0;

  const totalNodesInstalled =
    metrics?.metrics?.installation?.totalNodesInstalled || 0;
  const totalNodesRecommended =
    metrics?.metrics?.installation?.totalNodesRecommended || 0;
  const installationRate = parseFloat(
    metrics?.metrics?.installation?.installationRate || 0
  );

  const conversionRate = parseFloat(
    metrics?.metrics?.conversion?.homeConversionRate || 0
  );

  const avgRoomsTested = parseFloat(
    metrics?.metrics?.performance?.averageRoomsTested || 0
  );
  const speedTestSuccessRate = parseFloat(
    metrics?.metrics?.performance?.speedTestSuccessRate || 0
  );

  // This metric may need to be calculated or added to metrics.js
  const multiFloorRate = 35.0; // Placeholder - should come from metrics

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Overall Dashboard Metrics 📊
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Volume Metrics */}
        <div className="space-y-4">
          <MetricCard
            title="Total Certifications"
            value={totalEntries}
            subtitle="inc. incomplete"
            colorScheme="secondary"
            tooltipContent={tooltipContent.totalScans.content}
            tooltipTitle={tooltipContent.totalScans.title}
          />
          <MetricCard
            title="Unique Homes"
            value={uniqueHomes}
            subtitle="distinct locations"
            colorScheme="primary"
            tooltipContent={tooltipContent.uniqueHomes.content}
            tooltipTitle={tooltipContent.uniqueHomes.title}
          />
          <MetricCard
            title="Active Employees"
            value={activeEmployees}
            subtitle="performing certifications"
            colorScheme="info"
            tooltipContent={tooltipContent.activeEmployees.content}
            tooltipTitle={tooltipContent.activeEmployees.title}
          />
        </div>

        {/* Column 2: Conversion Metrics */}
        <div className="space-y-4">
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate.toFixed(1)}%`}
            subtitle="homes with installations"
            colorScheme={conversionRate >= 50 ? "success" : "warning"}
            tooltipContent={tooltipContent.conversionRate.content}
            tooltipTitle={tooltipContent.conversionRate.title}
          />
          <MetricCard
            title="Mesh Nodes Installed"
            value={totalNodesInstalled}
            subtitle="total devices"
            colorScheme="primary"
            tooltipContent={tooltipContent.nodesInstalled.content}
            tooltipTitle={tooltipContent.nodesInstalled.title}
          />
          <MetricCard
            title="Nodes Recommended"
            value={totalNodesRecommended}
            subtitle="suggested units"
            colorScheme="secondary"
            tooltipContent={tooltipContent.nodesRecommended.content}
            tooltipTitle={tooltipContent.nodesRecommended.title}
          />
        </div>

        {/* Column 3: Installation Metrics */}
        <div className="space-y-4">
          <MetricCard
            title="Installation Ratio"
            value={`${installationRate.toFixed(1)}%`}
            subtitle="of recommended nodes"
            colorScheme={installationRate >= 80 ? "success" : "warning"}
            tooltipContent={tooltipContent.installRatio.content}
            tooltipTitle={tooltipContent.installRatio.title}
          />
          <MetricCard
            title="Average Rooms Tested"
            value={avgRoomsTested.toFixed(1)}
            subtitle="per assessment"
            colorScheme="primary"
            tooltipContent={tooltipContent.avgRoomsTested.content}
            tooltipTitle={tooltipContent.avgRoomsTested.title}
          />
          <MetricCard
            title="Multi-Floor Rate"
            value={`${multiFloorRate.toFixed(1)}%`}
            subtitle="of assessments"
            colorScheme="secondary"
            tooltipContent={tooltipContent.multiFloorRate.content}
            tooltipTitle={tooltipContent.multiFloorRate.title}
          />
        </div>

        {/* Column 4: Quality Metrics */}
        <div className="space-y-4">
          <MetricCard
            title="Speed Test Success Rate"
            value={`${speedTestSuccessRate.toFixed(1)}%`}
            subtitle="meeting speed targets"
            colorScheme={speedTestSuccessRate >= 80 ? "success" : "warning"}
            tooltipContent={tooltipContent.speedTestSuccess.content}
            tooltipTitle={tooltipContent.speedTestSuccess.title}
          />

          {/* Additional metrics can be added here */}
          {/* <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Data Insights 💡
            </h3>
            <p className="text-xs text-blue-700">
              {conversionRate > 50
                ? "Strong conversion performance! Focus on increasing installation ratio next."
                : "Conversion rate needs improvement. Consider reviewing the assessment process."}
            </p>
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default ActivityMetrics;
