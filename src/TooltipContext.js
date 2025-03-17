// TooltipContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for tooltip settings
const TooltipContext = createContext();

/**
 * TooltipProvider component
 * Manages global tooltip visibility state and persists user preferences
 */
export function TooltipProvider({ children }) {
  // Initialize state from localStorage if available, otherwise default to enabled
  const [tooltipsEnabled, setTooltipsEnabled] = useState(() => {
    const savedPreference = localStorage.getItem("tooltipsEnabled");
    return savedPreference !== null ? JSON.parse(savedPreference) : true;
  });

  // Toggle tooltip visibility and save preference
  const toggleTooltips = () => {
    setTooltipsEnabled((prev) => !prev);
  };

  // Persist user preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tooltipsEnabled", JSON.stringify(tooltipsEnabled));
  }, [tooltipsEnabled]);

  return (
    <TooltipContext.Provider value={{ tooltipsEnabled, toggleTooltips }}>
      {children}
    </TooltipContext.Provider>
  );
}

/**
 * Custom hook to use tooltip settings
 * Makes it easy to access tooltip context from any component
 */
export function useTooltips() {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error("useTooltips must be used within a TooltipProvider");
  }
  return context;
}
