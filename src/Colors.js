/**
 * Enhanced Design System - Color Palette
 * A comprehensive and organized color system for the dashboard application
 */

const Colors = {
  // Primary Brand Colors (based on your teal/jade)
  primary: {
    50: "#eefbf7",
    100: "#d5f3eb",
    200: "#aee9db",
    300: "#58DBB9", // existing teal
    400: "#4EBAA1", // existing jade
    500: "#39a28a",
    600: "#2a8e79",
    700: "#236e5f",
    800: "#1d5046",
    900: "#16352e",
  },

  // Secondary/Accent Colors
  secondary: {
    50: "#e6f0ff",
    100: "#cce0ff",
    200: "#99c0ff",
    300: "#66a1ff",
    400: "#3381ff",
    500: "#0066FF", // existing electricBlue
    600: "#0052cc",
    700: "#003d99",
    800: "#002966",
    900: "#001433",
  },

  // Neutral Colors
  gray: {
    50: "#f9fafb",
    100: "#EEF2F6", // existing cloudGrey
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#3D4550", // existing ash
    800: "#20242A", // existing slate
    900: "#0f172a",
  },

  // Status Colors (for alerts, warnings, success messages)
  status: {
    success: "#10b981", // Green
    warning: "#f59e0b", // Amber
    error: "#ef4444", // Red
    info: "#3b82f6", // Blue
  },

  // Accent Colors (additional brand colors)
  accent: {
    yellow: "#D6FC51", // existing digitalYellow
  },

  // For backward compatibility - maintain original color references
  teal: "#58DBB9",
  jade: "#4EBAA1",
  ash: "#3D4550",
  electricBlue: "#0066FF",
  digitalYellow: "#D6FC51",
  slate: "#20242A",
  cloudGrey: "#EEF2F6",

  // Common gradients
  gradients: {
    primary: "linear-gradient(135deg, #58DBB9 0%, #0066FF 100%)",
    secondary: "linear-gradient(90deg, #58DBB9 0%, #4EBAA1 100%)",
    accent: "linear-gradient(90deg, #0066FF 0%, #3381FF 100%)",
  },

  // Helper function to get color with opacity
  withOpacity: (color, opacity) => {
    // Check if the color is a hex value
    if (color.startsWith("#")) {
      // Convert hex to rgb
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // For named colors or other formats, fallback to using CSS opacity
    return color;
  },
};

export default Colors;
