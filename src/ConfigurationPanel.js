// src/ConfigurationPanel.js
import React from "react";
import Colors from "./Colors";

const ConfigurationPanel = ({
  config,
  onToggleComponent,
  onClose,
  savedConfigs = [],
  onSaveConfig,
  onLoadConfig,
  onDeleteConfig,
  configName = "",
  onConfigNameChange,
  showSaveDialog = false,
  onToggleSaveDialog,
}) => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 h-full overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-bold text-gray-800">Dashboard Configuration</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Activity Metrics Section */}
      <div className="p-4">
        <h3 className="font-medium text-gray-700 mb-2">Activity Metrics</h3>
        <div className="space-y-2">
          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("activityMetrics")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.activityMetrics ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.activityMetrics && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm font-medium">Activity Metrics</span>
          </div>

          {/* Individual metric cards - only show when activityMetrics is true */}
          {config.activityMetrics && (
            <div className="pl-6 space-y-2">
              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("totalScans")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.totalScans ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.totalScans && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Total Certifications</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("uniqueVisits")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.uniqueVisits ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.uniqueVisits && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Unique Homes</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("activeEmployees")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.activeEmployees ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.activeEmployees && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Active Employees</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("conversionRate")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.conversionRate ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.conversionRate && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Conversion Rate</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("nodesInstalled")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.nodesInstalled ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.nodesInstalled && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Mesh Nodes Installed</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("nodesRecommended")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.nodesRecommended ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.nodesRecommended && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Nodes Recommended</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("installRatio")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.installRatio ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.installRatio && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Installation Ratio</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("avgRoomsTested")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.avgRoomsTested ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.avgRoomsTested && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Average Rooms Tested</span>
              </div>

              <div
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggleComponent("multiFloorRate")}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    config.multiFloorRate ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  {config.multiFloorRate && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Multi-Floor Rate</span>
              </div>
            </div>
          )}

          {/* Add this stats table toggle */}
          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("statsTable")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.statsTable ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.statsTable && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm font-medium">Statistics Summary</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="p-4">
        <h3 className="font-medium text-gray-700 mb-2">Charts</h3>
        <div className="space-y-2">
          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("weeklyProgress")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.weeklyProgress ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.weeklyProgress && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm">Weekly Progress</span>
          </div>

          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("conversionRateChart")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.conversionRateChart ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.conversionRateChart && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm">Conversion Rate</span>
          </div>

          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("regionalPerformance")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.regionalPerformance ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.regionalPerformance && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm">Regional Performance</span>
          </div>

          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("qualityIndicators")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.qualityIndicators ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.qualityIndicators && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm">Quality Indicators</span>
          </div>
        </div>
      </div>

      {/* Employee Data Section */}
      <div className="p-4">
        <h3 className="font-medium text-gray-700 mb-2">Employee Data</h3>
        <div className="space-y-2">
          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("employeeTable")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.employeeTable ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.employeeTable && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm">Performance Table</span>
          </div>

          <div
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent("qualityChart")}
          >
            <div
              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                config.qualityChart ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {config.qualityChart && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-sm">Quality Chart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
