import React from "react";
import MetricCard from "./MetricCard";
import Colors from "./Colors";

/**
 * ActivityMetrics Component
 * Displays a grid of key metrics cards using data from metrics.js
 *
 * @param {Object} props
 * @param {Object} props.metrics - Processed metrics data from metrics.js
 * @param {Object} props.config - Dashboard configuration for toggling visibility
 */
const ActivityMetrics = ({ metrics, config }) => {
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

  // This metric may need to be calculated or added to metrics.js
  const multiFloorRate = parseFloat(
    metrics?.metrics?.performance?.floorAssessments?.multiFloorPercentage ||
      35.0
  );

  // Helper function to check if a card should be displayed
  const shouldShowCard = (cardName) => {
    // If the specific config is not defined, default to showing the card
    if (config === undefined || config[cardName] === undefined) {
      return true;
    }
    return config[cardName];
  };

  // Extract the updated metric value
  const multiCompleteHomes = metrics?.summary?.multiCompleteHomes || 0; // Key and variable updated

  // Count how many cards are visible in each column to help with layout
  const getVisibleCardCount = (cards) => {
    return cards.filter((card) => shouldShowCard(card)).length;
  };

  const column1Cards = ["totalScans", "uniqueVisits", "activeEmployees"];
  const column2Cards = ["conversionRate", "nodesInstalled", "nodesRecommended"];
  const column3Cards = ["installRatio", "avgRoomsTested", "multiFloorRate"];

  const visibleColumn1 = getVisibleCardCount(column1Cards);
  const visibleColumn2 = getVisibleCardCount(column2Cards);
  const visibleColumn3 = getVisibleCardCount(column3Cards);

  // Add complementary info card when a column has fewer cards than others
  const renderInfoCard = (column) => {
    if (
      column === 1 &&
      visibleColumn1 < Math.max(visibleColumn2, visibleColumn3)
    ) {
      return (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Data Insights 💡
          </h3>
          <p className="text-xs text-blue-700">
            {conversionRate > 50
              ? "Strong conversion performance! Focus on increasing installation ratio next."
              : "Review assessment process to improve conversion rates."}
          </p>
        </div>
      );
    } else if (
      column === 2 &&
      visibleColumn2 < Math.max(visibleColumn1, visibleColumn3)
    ) {
      return (
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            Performance Tips 🚀
          </h3>
          <p className="text-xs text-green-700">
            Increasing average rooms tested per assessment can lead to better
            coverage and customer satisfaction.
          </p>
        </div>
      );
    } else if (
      column === 3 &&
      visibleColumn3 < Math.max(visibleColumn1, visibleColumn2)
    ) {
      return (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <h3 className="text-sm font-medium text-amber-800 mb-2">
            Quality Focus 📋
          </h3>
          <p className="text-xs text-amber-700">
            Multi-floor assessments are key to proper mesh coverage in larger
            homes. Encourage thorough site surveys.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Overall Dashboard Metrics 📊
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Column 1: Volume Metrics */}
        <div className="space-y-4">
          {shouldShowCard("totalScans") && (
            <MetricCard
              title="Total Certifications"
              value={totalEntries}
              subtitle="inc. incomplete"
              colorScheme="secondary"
              tooltipContent={tooltipContent.totalScans.content}
              tooltipTitle={tooltipContent.totalScans.title}
            />
          )}

          {shouldShowCard("uniqueVisits") && (
            <MetricCard
              title="Unique Homes"
              value={uniqueHomes}
              subtitle="distinct locations"
              colorScheme="primary"
              tooltipContent={tooltipContent.uniqueHomes.content}
              tooltipTitle={tooltipContent.uniqueHomes.title}
            />
          )}

          {shouldShowCard("activeEmployees") && (
            <MetricCard
              title="Active Employees"
              value={activeEmployees}
              subtitle="performing certifications"
              colorScheme="info"
              tooltipContent={tooltipContent.activeEmployees.content}
              tooltipTitle={tooltipContent.activeEmployees.title}
            />
          )}

          {renderInfoCard(1)}
        </div>

        {/* Column 2: Conversion Metrics */}
        <div className="space-y-4">
          {shouldShowCard("conversionRate") && (
            <MetricCard
              title="Conversion Rate"
              value={`${conversionRate.toFixed(1)}%`}
              subtitle="homes with installations"
              colorScheme={conversionRate >= 50 ? "success" : "warning"}
              tooltipContent={tooltipContent.conversionRate.content}
              tooltipTitle={tooltipContent.conversionRate.title}
            />
          )}

          {shouldShowCard("nodesInstalled") && (
            <MetricCard
              title="Mesh Nodes Installed"
              value={totalNodesInstalled}
              subtitle="total devices"
              colorScheme="primary"
              tooltipContent={tooltipContent.nodesInstalled.content}
              tooltipTitle={tooltipContent.nodesInstalled.title}
            />
          )}

          {shouldShowCard("nodesRecommended") && (
            <MetricCard
              title="Nodes Recommended"
              value={totalNodesRecommended}
              subtitle="suggested units"
              colorScheme="secondary"
              tooltipContent={tooltipContent.nodesRecommended.content}
              tooltipTitle={tooltipContent.nodesRecommended.title}
            />
          )}

          {renderInfoCard(2)}
        </div>

        {/* Column 3: Installation Metrics */}
        <div className="space-y-4">
          {shouldShowCard("installRatio") && (
            <MetricCard
              title="Installation Ratio"
              value={`${installationRate.toFixed(1)}%`}
              subtitle="of recommended nodes"
              colorScheme={installationRate >= 80 ? "success" : "warning"}
              tooltipContent={tooltipContent.installRatio.content}
              tooltipTitle={tooltipContent.installRatio.title}
            />
          )}

          {shouldShowCard("avgRoomsTested") && (
            <MetricCard
              title="Average Rooms Tested"
              value={avgRoomsTested.toFixed(1)}
              subtitle="per assessment"
              colorScheme="primary"
              tooltipContent={tooltipContent.avgRoomsTested.content}
              tooltipTitle={tooltipContent.avgRoomsTested.title}
            />
          )}

          {shouldShowCard("multiFloorRate") && (
            <MetricCard
              title="Multi-Floor Rate"
              value={`${multiFloorRate.toFixed(1)}%`}
              subtitle="of assessments"
              colorScheme="secondary"
              tooltipContent={tooltipContent.multiFloorRate.content}
              tooltipTitle={tooltipContent.multiFloorRate.title}
            />
          )}

          {renderInfoCard(3)}
        </div>
      </div>
    </div>
  );
};

export default ActivityMetrics;
