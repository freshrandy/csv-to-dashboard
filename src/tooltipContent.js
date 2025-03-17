/**
 * Dashboard Metrics Tooltip Content
 * Centralized repository of tooltip explanations for all dashboard metrics
 */

export const tooltipContent = {
  // Activity Metrics
  uniqueVisits: {
    title: "Unique Homes/Assessments",
    content:
      "The total number of distinct assessments performed, based on unique address combinations. This metric helps you understand your total volume without double-counting scans or visits in the same location.",
  },
  totalScans: {
    title: "Total Scans",
    content:
      "The total number of assessments performed, including both complete and incomplete scans. This metric represents your overall activity volume.",
  },
  activePersonnel: {
    title: "Active Personnel",
    content:
      "The number of employees who have conducted at least one assessment in the selected time period. This metric helps track workforce activity and distribution.",
  },
  avgScansPerEmployee: {
    title: "Avg. Scans / Employee",
    content:
      "The average number of assessments conducted per active employee. Calculated as Total Scans ÷ Number of active employees. This helps identify trends in employee productivity.",
  },
  avgHomesPerEmployee: {
    title: "Avg. Homes / Employee",
    content:
      "The average number of unique locations assessed per active employee. Calculated as Unique Visits ÷ Number of active employees. This metric helps evaluate employee coverage.",
  },
  avgRooms: {
    title: "Avg. Rooms / Home",
    content:
      "The average number of rooms tested in each assessment. This metric helps evaluate how thorough the assessments are, with higher numbers generally indicating more comprehensive coverage testing.",
  },

  // Installation Metrics
  accessPoints: {
    title: "Mesh Nodes Installed",
    content:
      "The percentage of recommended mesh nodes that were actually installed. Calculated as (Total Mes Nodes Installed ÷ Total Mes Nodes Recommended) × 100. This metric helps track how often your recommendations are being implemented.",
  },
  totalNodesRecommended: {
    title: "Total Nodes Recommended",
    content:
      "The total number of access points recommended across all assessments. This represents the total potential installations.",
  },
  totalNodesInstalled: {
    title: "Total Nodes Installed",
    content:
      "The total number of access points actually installed. This represents the actual installations completed.",
  },
  avgNodesRecommended: {
    title: "Average Nodes Recommended",
    content:
      "The average number of access points recommended per assessment. Calculated as Total Nodes Recommended ÷ Number of assessments. This helps identify typical customer needs.",
  },

  // Conversion Metrics
  conversionRate: {
    title: "Home/Assessment Conversion Rate",
    content:
      "The percentage of assessed locations that resulted in at least one installation. Calculated as (Number of unique addresses with installations ÷ Total number of unique addresses assessed) × 100. A higher rate indicates more successful conversions from assessment to installation.",
  },
  regionalConversion: {
    title: "Regional Conversion Rates",
    content:
      "Conversion rates broken down by geographic region (state/province). This helps identify regional strengths and opportunities for improvement.",
  },
  weeklyConversion: {
    title: "Weekly Conversion Rate",
    content:
      "The percentage of assessments that resulted in installations for each week. This shows how conversion performance has changed over time.",
  },

  // Quality Metrics
  qualityScore: {
    title: "Average Quality Score",
    content:
      "The average quality score across all installations, measured on a 0-100% scale. This reflects the overall quality of installations based on various factors including coverage, speed, and customer satisfaction.",
  },
  speedTestSuccess: {
    title: "Speed Test Success Rate",
    content:
      "The percentage of speed tests where the actual measured speed achieved at least 80% of the expected speed based on the plan. Calculated as (Number of tests with actual speed ≥ 80% of expected speed ÷ Total number of speed tests) × 100.",
  },
  avgSpeedRatio: {
    title: "Average Speed Ratio",
    content:
      "The average percentage of expected internet speed that was actually achieved, calculated as (Sum of all Actual Speed values ÷ Sum of all Expected Speed values) × 100. This helps evaluate overall connection quality.",
  },
  multiFloorRate: {
    title: "Multi-Floor Assessment Rate",
    content:
      "The percentage of assessments that covered multiple floors or levels. This indicates how comprehensive the assessments are and helps identify potential coverage needs.",
  },

  // Revenue Impact Metrics
  monthlyRevenue: {
    title: "Monthly Recurring Revenue",
    content:
      "The projected monthly revenue from all installed access points. Calculated as Monthly Price per Installation × Total Number of Installations.",
  },
  lifetimeValue: {
    title: "Lifetime Value (LTV)",
    content:
      "The projected total revenue from installations over 1, 2, or 3 years. This helps understand the long-term value of your current installation base.",
  },
  avgRevenuePerInstall: {
    title: "Average Revenue Per Installation",
    content:
      "The average monthly revenue generated per installation. This metric helps with financial forecasting and pricing strategy.",
  },
};
