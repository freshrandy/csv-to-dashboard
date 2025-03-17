import React from "react";
import Colors from "./Colors";

/**
 * Enhanced Metric Card Component
 * A reusable card component for displaying metrics with consistent styling
 *
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main metric value to display
 * @param {string} props.subtitle - Optional subtitle or description
 * @param {string} props.colorScheme - Color scheme to use (primary, secondary, success, warning, etc.)
 * @param {boolean} props.isLoading - Whether the card is in loading state
 */
const MetricCard = ({
  title,
  value,
  subtitle,
  colorScheme = "primary", // default to primary color scheme
  isLoading = false,
}) => {
  // Determine color scheme based on prop
  const getColors = () => {
    switch (colorScheme) {
      case "primary":
        return {
          accent: Colors.primary[300],
          highlight: Colors.primary[500],
          light: Colors.primary[100],
          border: Colors.primary[200],
          gradient: `linear-gradient(to right, ${Colors.primary[300]}, ${Colors.primary[400]})`,
        };
      case "secondary":
        return {
          accent: Colors.secondary[500],
          highlight: Colors.secondary[600],
          light: Colors.secondary[100],
          border: Colors.secondary[200],
          gradient: `linear-gradient(to right, ${Colors.secondary[400]}, ${Colors.secondary[500]})`,
        };
      case "success":
        return {
          accent: Colors.status.success,
          highlight: Colors.status.success,
          light: Colors.withOpacity(Colors.status.success, 0.1),
          border: Colors.withOpacity(Colors.status.success, 0.2),
          gradient: `linear-gradient(to right, ${Colors.status.success}, ${Colors.primary[400]})`,
        };
      case "warning":
        return {
          accent: Colors.status.warning,
          highlight: Colors.status.warning,
          light: Colors.withOpacity(Colors.status.warning, 0.1),
          border: Colors.withOpacity(Colors.status.warning, 0.2),
          gradient: `linear-gradient(to right, ${Colors.status.warning}, ${Colors.accent.yellow})`,
        };
      case "error":
        return {
          accent: Colors.status.error,
          highlight: Colors.status.error,
          light: Colors.withOpacity(Colors.status.error, 0.1),
          border: Colors.withOpacity(Colors.status.error, 0.2),
          gradient: `linear-gradient(to right, ${Colors.status.error}, ${Colors.status.warning})`,
        };
      case "info":
        return {
          accent: Colors.status.info,
          highlight: Colors.status.info,
          light: Colors.withOpacity(Colors.status.info, 0.1),
          border: Colors.withOpacity(Colors.status.info, 0.2),
          gradient: `linear-gradient(to right, ${Colors.status.info}, ${Colors.secondary[500]})`,
        };
      default:
        return {
          accent: Colors.primary[300],
          highlight: Colors.primary[500],
          light: Colors.primary[100],
          border: Colors.primary[200],
          gradient: `linear-gradient(to right, ${Colors.primary[300]}, ${Colors.primary[400]})`,
        };
    }
  };

  const colors = getColors();

  // Render a loading state if needed
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
        <div className="p-1" style={{ background: colors.gradient }}></div>
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
      <div className="p-1" style={{ background: colors.gradient }}></div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>
        <div className="mt-2">
          <div
            className="text-3xl font-bold"
            style={{ color: Colors.gray[800] }}
          >
            {value}
          </div>
        </div>
        {subtitle && (
          <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
