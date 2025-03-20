// src/pdfExport.js

/**
 * PDF Export Utility for Dashboard
 * Handles converting the current dashboard view to a PDF document
 */

import html2pdf from "html2pdf.js";

/**
 * Export the dashboard to PDF
 * @param {string} elementId - ID of the element to convert to PDF
 * @param {string} filename - Name for the exported file
 * @param {Object} options - PDF export options
 */
export const exportDashboardToPDF = (
  elementId = "dashboard-content",
  filename = "dashboard-export.pdf",
  options = {}
) => {
  // Get the element to export
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found`);
    return;
  }

  // Default options
  const defaultOptions = {
    margin: 10,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2, // Better resolution
      useCORS: true, // Handle images from other domains
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  // Merge user options with defaults
  const mergedOptions = { ...defaultOptions, ...options };

  // Start the export process
  return html2pdf()
    .set(mergedOptions)
    .from(element)
    .save()
    .then(() => {
      console.log("PDF export completed successfully");
      return true;
    })
    .catch((error) => {
      console.error("PDF export failed:", error);
      return false;
    });
};

/**
 * Export dashboard in landscape mode (better for charts)
 * @param {string} elementId - ID of the element to convert to PDF
 * @param {string} filename - Name for the exported file
 */
export const exportDashboardLandscape = (
  elementId = "dashboard-content",
  filename = "dashboard-landscape.pdf"
) => {
  return exportDashboardToPDF(elementId, filename, {
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape",
    },
  });
};

/**
 * Export only the visible components (respecting current configuration)
 * Useful when you want to exclude configuration panels, headers etc.
 */
export const exportVisibleDashboard = (filename = "dashboard-visible.pdf") => {
  // Create a temporary clone of the visible content
  const dashboardContent = document.getElementById("dashboard-content");
  if (!dashboardContent) {
    console.error("Dashboard content element not found");
    return;
  }

  // Create a clone to work with
  const clone = dashboardContent.cloneNode(true);

  // Remove any elements that shouldn't be in the PDF
  const excludeSelectors = [
    ".config-panel",
    ".debug-info",
    ".print-hide",
    "button.export-button",
  ];

  excludeSelectors.forEach((selector) => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach((el) => el.remove());
  });

  // Add the clone to the document temporarily (hidden)
  clone.id = "temp-export-element";
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  document.body.appendChild(clone);

  // Export the temporary element
  return exportDashboardToPDF("temp-export-element", filename).finally(() => {
    // Clean up the temporary element
    document.body.removeChild(clone);
  });
};
