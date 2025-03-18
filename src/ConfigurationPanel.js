// src/ConfigurationPanel.js
import React from "react";
import Colors from "./Colors";

const ConfigurationPanel = ({ 
  config, 
  onToggleComponent, 
  onApplyPreset,
  onClose,
  savedConfigs = [],
  onSaveConfig,
  onLoadConfig,
  onDeleteConfig,
  configName = '',
  onConfigNameChange,
  showSaveDialog = false,
  onToggleSaveDialog
}) => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 h-full overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-bold text-gray-800">Dashboard Configuration</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Preset Buttons */}
      <div className="p-4 bg-blue-50 m-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Presets</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onApplyPreset('showAll')} 
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Show All
          </button>
          <button 
            onClick={() => onApplyPreset('minimal')} 
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Minimal
          </button>
          <button 
            onClick={() => onApplyPreset('conversionFocus')} 
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Conversion
          </button>
          <button 
            onClick={() => onApplyPreset('employeeFocus')} 
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Employee
          </button>
        </div>
      </div>

      {/* Activity Metrics Section */}
      <div className="p-4">
        <h3 className="font-medium text-gray-700 mb-2">Activity Metrics</h3>
        <div className="space-y-2">
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('uniqueVisits')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.uniqueVisits ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.uniqueVisits && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Unique Visits</span>
          </div>
          
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('totalScans')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.totalScans ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.totalScans && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Total Scans</span>
          </div>
          
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('employeePerformance')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.employeePerformance ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.employeePerformance && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Employee Performance</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="p-4">
        <h3 className="font-medium text-gray-700 mb-2">Charts</h3>
        <div className="space-y-2">
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('weeklyProgress')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.weeklyProgress ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.weeklyProgress && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Weekly Progress</span>
          </div>
          
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('conversionRate')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.conversionRate ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.conversionRate && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Conversion Rate</span>
          </div>
          
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('regionalPerformance')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.regionalPerformance ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.regionalPerformance && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Regional Performance</span>
          </div>
          
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('qualityIndicators')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.qualityIndicators ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.qualityIndicators && <div className="w-3 h-3 bg-white rounded-full"></div>}
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
            onClick={() => onToggleComponent('employeeTable')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.employeeTable ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.employeeTable && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Performance Table</span>
          </div>
          
          <div 
            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleComponent('qualityChart')}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${config.qualityChart ? 'bg-teal-500' : 'bg-gray-300'}`}>
              {config.qualityChart && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm">Quality Chart</span>
          </div>
        </div>
      </div>

      {/* Configuration Management */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">Saved Configurations</h3>
        
        {/* Save current config button */}
        <button 
          onClick={onToggleSaveDialog}
          className="w-full mb-2 px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Current Configuration
        </button>
        
        {/* Save dialog */}
        {showSaveDialog && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <label className="block text-xs text-blue-800 mb-1">Configuration Name</label>
            <div className="flex">
              <input
                type="text"
                value={configName}
                onChange={e => onConfigNameChange(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="My Configuration"
              />
              <button
                onClick={onSaveConfig}
                disabled={!configName.trim()}
                className="px-2 py-1 bg-blue-500 text-white text-sm rounded-r hover:bg-blue-600 disabled:bg-blue-300"
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        {/* Saved configurations list */}
        {savedConfigs.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {savedConfigs.map((config, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-xs text-gray-500">{config.date}</div>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => onLoadConfig(index)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Load Configuration"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDeleteConfig(index)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete Configuration"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 text-center my-2">
            No saved configurations yet. Save your current layout to reuse it later.
          </p>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-4 text-center">
        <p className="text-xs text-gray-500">
          Changes are applied instantly and saved to your browser.
        </p>
      </div>
    </div>
  );
};

export default ConfigurationPanel;