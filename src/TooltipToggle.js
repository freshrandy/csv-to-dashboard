import React from "react";
import { useTooltips } from "./TooltipContext";

/**
 * Tooltip Toggle Component
 * Provides a UI element to enable/disable tooltips globally
 */
const TooltipToggle = () => {
  const { tooltipsEnabled, toggleTooltips } = useTooltips();

  return (
    <div className="flex items-center">
      <span className="text-sm text-white mr-2">Tooltips</span>
      <button
        onClick={toggleTooltips}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          tooltipsEnabled ? "bg-blue-100" : "bg-gray-300"
        }`}
        aria-pressed={tooltipsEnabled}
        aria-label="Toggle tooltips"
      >
        <span className="sr-only">
          {tooltipsEnabled ? "Disable tooltips" : "Enable tooltips"}
        </span>
        <span
          className={`${
            tooltipsEnabled ? "translate-x-6" : "translate-x-1"
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        ></span>
      </button>
    </div>
  );
};

export default TooltipToggle;
