import React, { useState, useRef, useEffect } from "react";
import { useTooltips } from "./TooltipContext";

/**
 * Enhanced Metric Card Component with Tooltips
 * A reusable card component for displaying metrics with consistent styling and tooltips
 *
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main metric value to display
 * @param {string} props.subtitle - Optional subtitle or description
 * @param {string} props.colorScheme - Color scheme to use (primary, secondary, success, warning, etc.)
 * @param {boolean} props.isLoading - Whether the card is in loading state
 * @param {string} props.tooltipContent - Content to display in the tooltip
 * @param {string} props.tooltipTitle - Optional title for the tooltip
 */
const MetricCard = ({
  title,
  value,
  subtitle,
  colorScheme = "primary", // default to primary color scheme
  isLoading = false,
  tooltipContent, // New prop for tooltip content
  tooltipTitle, // New prop for tooltip title
}) => {
  // Get the global tooltip setting
  const { tooltipsEnabled } = useTooltips();

  // State for tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);
  // Ref for the info icon to position the tooltip
  const tooltipTriggerRef = useRef(null);
  // State for tooltip position
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // Internal color system - no external dependencies
  const colors = {
    primary: {
      300: "#58DBB9", // teal
      400: "#4EBAA1", // jade
      500: "#39a28a",
    },
    secondary: {
      400: "#3381ff",
      500: "#0066FF", // electric blue
      600: "#0052cc",
    },
    gray: {
      100: "#EEF2F6", // cloud grey
      200: "#e2e8f0",
      500: "#64748b",
      700: "#3D4550", // ash
      800: "#20242A", // slate
    },
    status: {
      success: "#10b981", // green
      warning: "#f59e0b", // amber
      error: "#ef4444", // red
      info: "#3b82f6", // blue
    },
    accent: {
      yellow: "#D6FC51", // digital yellow
    },
  };

  // Determine color scheme based on prop
  const getColors = () => {
    switch (colorScheme) {
      case "primary":
        return {
          accent: colors.primary[300],
          highlight: colors.primary[500],
          light: "#F0FBF8", // Light primary color
          border: "#D5F3EB", // Light border color
          gradient: `linear-gradient(to right, ${colors.primary[300]}, ${colors.primary[400]})`,
        };
      case "secondary":
        return {
          accent: colors.secondary[500],
          highlight: colors.secondary[600],
          light: "#E6F0FF", // Light secondary color
          border: "#CCE0FF", // Light border color
          gradient: `linear-gradient(to right, ${colors.secondary[400]}, ${colors.secondary[500]})`,
        };
      case "success":
        return {
          accent: colors.status.success,
          highlight: colors.status.success,
          light: "#ECFDF5", // Light success color
          border: "#A7F3D0", // Light border color
          gradient: `linear-gradient(to right, ${colors.status.success}, ${colors.primary[400]})`,
        };
      case "warning":
        return {
          accent: colors.status.warning,
          highlight: colors.status.warning,
          light: "#FFFBEB", // Light warning color
          border: "#FDE68A", // Light border color
          gradient: `linear-gradient(to right, ${colors.status.warning}, ${colors.accent.yellow})`,
        };
      case "error":
        return {
          accent: colors.status.error,
          highlight: colors.status.error,
          light: "#FEF2F2", // Light error color
          border: "#FECACA", // Light border color
          gradient: `linear-gradient(to right, ${colors.status.error}, ${colors.status.warning})`,
        };
      case "info":
        return {
          accent: colors.status.info,
          highlight: colors.status.info,
          light: "#EFF6FF", // Light info color
          border: "#BFDBFE", // Light border color
          gradient: `linear-gradient(to right, ${colors.status.info}, ${colors.secondary[500]})`,
        };
      default:
        return {
          accent: colors.primary[300],
          highlight: colors.primary[500],
          light: "#F0FBF8", // Light primary color
          border: "#D5F3EB", // Light border color
          gradient: `linear-gradient(to right, ${colors.primary[300]}, ${colors.primary[400]})`,
        };
    }
  };

  const cardColors = getColors();

  // Function to handle tooltip visibility
  const handleTooltipToggle = () => {
    if (!showTooltip && tooltipTriggerRef.current) {
      const rect = tooltipTriggerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150 + rect.width / 2, // Center the tooltip
      });
    }
    setShowTooltip(!showTooltip);
  };

  // Function to close tooltip when clicking outside
  const handleClickOutside = (e) => {
    if (
      tooltipTriggerRef.current &&
      !tooltipTriggerRef.current.contains(e.target)
    ) {
      setShowTooltip(false);
    }
  };

  // Add event listener when tooltip is shown
  useEffect(() => {
    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  // Render a loading state if needed
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
        <div className="p-1" style={{ background: cardColors.gradient }}></div>
        <div className="p-5">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      <div className="p-1" style={{ background: cardColors.gradient }}></div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>

          {/* Tooltip trigger - only shown if tooltips are enabled globally */}
          {tooltipsEnabled && tooltipContent && (
            <button
              ref={tooltipTriggerRef}
              onClick={handleTooltipToggle}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ focusRing: cardColors.accent }}
              aria-label="More information"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-2">
          <div
            className="text-3xl font-bold"
            style={{ color: colors.gray[800] }}
          >
            {value}
          </div>
        </div>

        {subtitle && (
          <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
        )}

        {/* Tooltip - only shown if tooltip is toggled on and global tooltips are enabled */}
        {tooltipsEnabled && showTooltip && tooltipContent && (
          <div
            className="absolute z-10 w-72 p-4 bg-white rounded-lg shadow-lg border border-gray-200 text-left"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200"></div>

            {tooltipTitle && (
              <h4 className="font-medium text-gray-900 mb-2">{tooltipTitle}</h4>
            )}

            <div className="text-sm text-gray-600">{tooltipContent}</div>

            <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
              <div>Click outside to close</div>
              <button
                className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
                onClick={() => setShowTooltip(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
