import Papa from "papaparse";

/**
 * Normalize state/province values
 * @param {string} region - The region name to normalize
 * @returns {string} Normalized region name
 */
function normalizeRegion(region) {
  if (!region) return "";

  // Normalize region naming (state abbreviations vs full names)
  const regionMap = {
    // USA States
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
    DC: "District of Columbia",
    AS: "American Samoa",
    GU: "Guam",
    MP: "Northern Mariana Islands",
    PR: "Puerto Rico",
    VI: "U.S. Virgin Islands",

    // Canadian Provinces and Territories
    AB: "Alberta",
    BC: "British Columbia",
    MB: "Manitoba",
    NB: "New Brunswick",
    NL: "Newfoundland and Labrador",
    NS: "Nova Scotia",
    NT: "Northwest Territories",
    NU: "Nunavut",
    ON: "Ontario",
    PE: "Prince Edward Island",
    QC: "Quebec",
    SK: "Saskatchewan",
    YT: "Yukon",

    // Add reverse mappings to handle cases where full names are used
    Alabama: "Alabama",
    Alaska: "Alaska",
    Arizona: "Arizona",
    Arkansas: "Arkansas",
    California: "California",
    Colorado: "Colorado",
    Connecticut: "Connecticut",
    Delaware: "Delaware",
    Florida: "Florida",
    Georgia: "Georgia",
    Hawaii: "Hawaii",
    Idaho: "Idaho",
    Illinois: "Illinois",
    Indiana: "Indiana",
    Iowa: "Iowa",
    Kansas: "Kansas",
    Kentucky: "Kentucky",
    Louisiana: "Louisiana",
    Maine: "Maine",
    Maryland: "Maryland",
    Massachusetts: "Massachusetts",
    Michigan: "Michigan",
    Minnesota: "Minnesota",
    Mississippi: "Mississippi",
    Missouri: "Missouri",
    Montana: "Montana",
    Nebraska: "Nebraska",
    Nevada: "Nevada",
    "New Hampshire": "New Hampshire",
    "New Jersey": "New Jersey",
    "New Mexico": "New Mexico",
    "New York": "New York",
    "North Carolina": "North Carolina",
    "North Dakota": "North Dakota",
    Ohio: "Ohio",
    Oklahoma: "Oklahoma",
    Oregon: "Oregon",
    Pennsylvania: "Pennsylvania",
    "Rhode Island": "Rhode Island",
    "South Carolina": "South Carolina",
    "South Dakota": "South Dakota",
    Tennessee: "Tennessee",
    Texas: "Texas",
    Utah: "Utah",
    Vermont: "Vermont",
    Virginia: "Virginia",
    Washington: "Washington",
    "West Virginia": "West Virginia",
    Wisconsin: "Wisconsin",
    Wyoming: "Wyoming",
    "District of Columbia": "District of Columbia",
    "American Samoa": "American Samoa",
    Guam: "Guam",
    "Northern Mariana Islands": "Northern Mariana Islands",
    "Puerto Rico": "Puerto Rico",
    "U.S. Virgin Islands": "U.S. Virgin Islands",

    Alberta: "Alberta",
    "British Columbia": "British Columbia",
    Manitoba: "Manitoba",
    "New Brunswick": "New Brunswick",
    "Newfoundland and Labrador": "Newfoundland and Labrador",
    "Nova Scotia": "Nova Scotia",
    "Northwest Territories": "Northwest Territories",
    Nunavut: "Nunavut",
    Ontario: "Ontario",
    "Prince Edward Island": "Prince Edward Island",
    Quebec: "Quebec",
    Saskatchewan: "Saskatchewan",
    Yukon: "Yukon",
  };

  return regionMap[region] || region;
}

/**
 * Generate installation metrics from CSV data
 * @param {string} csvData - CSV data as a string
 * @param {number} monthlyPrice - Monthly price per installation
 * @returns {Object} Metrics object
 */
export function generateMetrics(csvData, monthlyPrice = 14.99) {
  // Parse the CSV data
  const parsedData = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  // Filter out @routethis.com email addresses before any metric calculations
  const data = parsedData.data.filter(
    (row) =>
      !row["Employee Email"] ||
      !row["Employee Email"].includes("@routethis.com")
  );

  // Check available columns
  const sampleRow = data[0] || {};
  const hasAddresses = "Address" in sampleRow && sampleRow.Address !== null;

  // Extract date range
  let minDate = new Date();
  let maxDate = new Date(0);

  data.forEach((row) => {
    if (row["Date"] || row["Date "]) {
      // Handle both possible column names
      try {
        const dateString = row["Date"] || row["Date "];
        const date = new Date(dateString);
        if (!isNaN(date)) {
          minDate = date < minDate ? date : minDate;
          maxDate = date > maxDate ? date : maxDate;
        }
      } catch (e) {
        // Skip invalid dates
      }
    }
  });

  // Format date range
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const dateRange = `${formatDate(minDate)} to ${formatDate(maxDate)}`;

  // Count unique assessments (use address if available, otherwise use alternative identifier)
  const uniqueAssessments = new Set();
  data.forEach((row) => {
    if (hasAddresses && row.Address) {
      const addressKey = `${row.Address}, ${row.City || ""}, ${
        row["State/Province"] || ""
      }`;
      uniqueAssessments.add(addressKey);
    } else {
      // Alternative: use date + city + state/province + any other identifying info
      const dateStr = row["Date"] || row["Date "] || "";
      const date = new Date(dateStr);
      const formattedDate = !isNaN(date)
        ? date.toISOString().split("T")[0]
        : dateStr;

      const assessmentKey = `${formattedDate}|${row.City || ""}|${
        row["State/Province"] || ""
      }|${row["Quality of Install Score"] || ""}`;
      uniqueAssessments.add(assessmentKey);
    }
  });

  // Count statuses
  const statusCounts = {};
  data.forEach((row) => {
    if (row.Status) {
      statusCounts[row.Status] = (statusCounts[row.Status] || 0) + 1;
    }
  });

  // Calculate installation metrics
  let totalRoomsTested = 0;
  let installRecords = 0;
  let totalNodesRecommended = 0;
  let totalNodesInstalled = 0;
  let totalExpectedSpeed = 0;
  let totalActualSpeed = 0;
  let speedTestCount = 0;
  let successfulSpeedTests = 0;
  let totalQualityScore = 0;
  let qualityScoreCount = 0;

  data.forEach((row) => {
    if (row["Rooms Tested"]) {
      totalRoomsTested += row["Rooms Tested"];
    }

    if (row["Mesh Nodes Recommended"]) {
      totalNodesRecommended += row["Mesh Nodes Recommended"];
      installRecords++;
    }

    if (row["Mesh Nodes Installed"]) {
      totalNodesInstalled += row["Mesh Nodes Installed"];
    }

    if (row["Expected Speed"] && row["Actual Speed"]) {
      totalExpectedSpeed += row["Expected Speed"];
      totalActualSpeed += row["Actual Speed"];
      speedTestCount++;

      // Count tests where actual speed is at least 80% of expected
      if (row["Actual Speed"] >= 0.8 * row["Expected Speed"]) {
        successfulSpeedTests++;
      }
    }

    if (
      row["Quality of Install Score"] !== null &&
      row["Quality of Install Score"] !== undefined
    ) {
      totalQualityScore += row["Quality of Install Score"];
      qualityScoreCount++;
    }
  });

  // Calculate averages and percentages
  const avgRoomsTested = totalRoomsTested / data.length || 0;
  const avgNodesRecommended =
    installRecords > 0 ? totalNodesRecommended / installRecords : 0;
  const installationRate =
    totalNodesRecommended > 0
      ? (totalNodesInstalled / totalNodesRecommended) * 100
      : 0;
  const avgSpeedRatio =
    totalExpectedSpeed > 0 ? (totalActualSpeed / totalExpectedSpeed) * 100 : 0;
  const speedTestSuccessRate =
    speedTestCount > 0 ? (successfulSpeedTests / speedTestCount) * 100 : 0;
  const avgQualityScore =
    qualityScoreCount > 0 ? totalQualityScore / qualityScoreCount : 0;

  // Regional distribution and conversion
  const regionCounts = {};
  const regionInstalls = {};

  data.forEach((row) => {
    if (row["State/Province"]) {
      // Normalize the region name
      const normalizedRegion = normalizeRegion(row["State/Province"]);

      // Count total by region
      regionCounts[normalizedRegion] =
        (regionCounts[normalizedRegion] || 0) + 1;

      // Count installations by region
      if (row["Mesh Nodes Installed"] > 0) {
        regionInstalls[normalizedRegion] =
          (regionInstalls[normalizedRegion] || 0) + 1;
      }
    }
  });

  // Calculate regional conversion rates
  const regionConversion = {};
  for (const region in regionCounts) {
    const installs = regionInstalls[region] || 0;
    regionConversion[region] = (installs / regionCounts[region]) * 100;
  }

  // Calculate assessment conversion rate (formerly home conversion rate)
  const assessmentsWithInstalls = data.filter(
    (row) => row["Mesh Nodes Installed"] && row["Mesh Nodes Installed"] > 0
  ).length;

  const assessmentConversionRate =
    uniqueAssessments.size > 0
      ? (assessmentsWithInstalls / uniqueAssessments.size) * 100
      : 0;

  // Calculate monthly distribution
  const monthlyDistribution = {};
  const weeklyDistribution = {};

  data.forEach((row) => {
    const dateField = row["Date"] || row["Date "];
    if (dateField) {
      try {
        const date = new Date(dateField);
        if (!isNaN(date)) {
          // Monthly grouping
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          monthlyDistribution[monthKey] =
            (monthlyDistribution[monthKey] || 0) + 1;

          // Weekly grouping (using ISO week)
          const getWeekNumber = (d) => {
            const date = new Date(d.getTime());
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
            const week1 = new Date(date.getFullYear(), 0, 4);
            return (
              1 +
              Math.round(
                ((date.getTime() - week1.getTime()) / 86400000 -
                  3 +
                  ((week1.getDay() + 6) % 7)) /
                  7
              )
            );
          };

          const weekNum = getWeekNumber(date);
          const weekKey = `${date.getFullYear()}-W${String(weekNum).padStart(
            2,
            "0"
          )}`;
          weeklyDistribution[weekKey] = (weeklyDistribution[weekKey] || 0) + 1;
        }
      } catch (e) {
        // Skip invalid dates
      }
    }
  });

  // Calculate revenue metrics
  const monthlyRevenue = monthlyPrice * totalNodesInstalled;

  // Construct the metrics object
  return {
    summary: {
      dateRange,
      totalEntries: data.length,
      uniqueHomes: uniqueAssessments.size,
      statusDistribution: statusCounts,
      hasAddresses, // Flag to indicate if we have address data
    },
    monthlyPrice: monthlyPrice,
    metrics: {
      installation: {
        totalNodesRecommended,
        totalNodesInstalled,
        installationRate: installationRate.toFixed(2),
        averageNodesRecommended: avgNodesRecommended.toFixed(2),
      },
      quality: {
        averageQualityScore: avgQualityScore.toFixed(2),
      },
      performance: {
        averageRoomsTested: avgRoomsTested.toFixed(2),
        speedTestSuccessRate: speedTestSuccessRate.toFixed(2),
        averageSpeedRatio: avgSpeedRatio.toFixed(2),
      },
      conversion: {
        homeConversionRate: assessmentConversionRate.toFixed(2),
        regionalConversion: Object.fromEntries(
          Object.entries(regionConversion).map(([region, rate]) => [
            region,
            rate.toFixed(2),
          ])
        ),
        // Add the actual regional counts to the metrics
        regionalData: Object.fromEntries(
          Object.entries(regionCounts).map(([region, certifications]) => [
            region,
            {
              certifications,
              installations: regionInstalls[region] || 0,
              conversionRate: (
                ((regionInstalls[region] || 0) / certifications) *
                100
              ).toFixed(2),
            },
          ])
        ),
      },
      revenue: {
        monthlyRecurringRevenue: monthlyRevenue.toFixed(2),
        yearOneLTV: (monthlyRevenue * 12).toFixed(2),
        yearTwoLTV: (monthlyRevenue * 24).toFixed(2),
        yearThreeLTV: (monthlyRevenue * 36).toFixed(2),
      },
      temporal: {
        monthlyDistribution,
        weeklyDistribution,
      },
    },
  };
}
