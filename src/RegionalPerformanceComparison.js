import React, { useState } from "react";
import Colors from "./Colors";

/**
 * Regional Performance Comparison Component
 * Displays a table of regional performance data with toggleable regions
 *
 * @param {Object} props
 * @param {Array} props.regionalData - Array of region objects with name, certifications, installations, conversion
 * @param {Object} props.colors - Brand color scheme for styling
 */
const RegionalPerformanceComparison = ({ regionalData, colors }) => {
  // State to track which regions are visible
  const [visibleRegions, setVisibleRegions] = useState(
    regionalData.reduce((acc, region) => {
      acc[region.name] = true; // All regions visible by default
      return acc;
    }, {})
  );

  // Toggle a specific region's visibility
  const toggleRegion = (regionName) => {
    setVisibleRegions((prev) => ({
      ...prev,
      [regionName]: !prev[regionName],
    }));
  };

  // Show all regions
  const showAllRegions = () => {
    const newVisibility = {};
    regionalData.forEach((region) => {
      newVisibility[region.name] = true;
    });
    setVisibleRegions(newVisibility);
  };

  // Hide all regions
  const hideAllRegions = () => {
    const newVisibility = {};
    regionalData.forEach((region) => {
      newVisibility[region.name] = false;
    });
    setVisibleRegions(newVisibility);
  };

  // Get filtered regions that should be displayed
  const filteredRegions = regionalData.filter(
    (region) => visibleRegions[region.name]
  );

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4" style={{ color: Colors.ash }}>
        Regional Performance Comparison 🗺️
      </h2>

      {/* Region toggles */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Show/Hide Regions:
          </h3>
          <div className="space-x-2">
            <button
              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
              onClick={showAllRegions}
            >
              Show All
            </button>
            <button
              className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
              onClick={hideAllRegions}
            >
              Hide All
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded">
          {regionalData.map((region, index) => (
            <button
              key={`toggle-${index}`}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                visibleRegions[region.name]
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              }`}
              onClick={() => toggleRegion(region.name)}
            >
              {region.name}
              {visibleRegions[region.name] ? " ✓" : " ⨯"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredRegions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Region
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Certifications
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Installations
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegions.map((region, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {region.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {region.certifications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {region.installations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor:
                          region.conversion > 20
                            ? colors.jade
                            : colors.cloudGrey,
                        color: region.conversion > 20 ? "white" : "black",
                      }}
                    >
                      {region.conversion}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">
              No regions selected. Please toggle at least one region to view
              data.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          Showing {filteredRegions.length} of {regionalData.length} regions.
        </p>
      </div>
    </div>
  );
};

export default RegionalPerformanceComparison;
