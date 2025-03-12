const Colors = {
  // Primary Brand Colors
  teal: "#58DBB9",
  jade: "#4EBAA1",
  ash: "#3D4550",

  // Accent Colors
  electricBlue: "#0066FF",
  digitalYellow: "#D6FC51",

  // Background Colors
  slate: "#20242A",
  cloudGrey: "#EEF2F6",

  // UI Colors
  success: "#10B981", // Green for positive indicators
  warning: "#F59E0B", // Amber for warnings
  error: "#EF4444", // Red for errors
  info: "#3B82F6", // Blue for information

  // Gradient presets
  gradients: {
    primary: "linear-gradient(135deg, #58DBB9 0%, #0066FF 100%)",
  },

  // Helper function to get color with opacity
  withOpacity: (color, opacity) => {
    // For hex colors
    if (color.startsWith("#")) {
      // Convert hex to rgb
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // For rgb/rgba colors
    if (color.startsWith("rgb")) {
      if (color.startsWith("rgba")) {
        // Replace existing opacity
        return color.replace(/[\d.]+\)$/, `${opacity})`);
      } else {
        // Convert rgb to rgba
        return color.replace(")", `, ${opacity})`).replace("rgb", "rgba");
      }
    }

    return color; // Return original if format not supported
  },
};

export default Colors;
