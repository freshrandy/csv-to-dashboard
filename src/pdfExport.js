// src/pdfExport.js

/**
 * PDF Export Utility for Dashboard
 * Handles converting the current dashboard view to a PDF document
 * with proper page breaks between components
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
    return false;
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
  // First, prepare the document for export by adding page breaks
  prepareForExport(elementId);

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
 */
export const exportVisibleDashboard = (filename = "dashboard-visible.pdf") => {
  // Create a temporary clone of the visible content
  const dashboardContent = document.getElementById("dashboard-content");
  if (!dashboardContent) {
    console.error("Dashboard content element not found");
    return false;
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

  // Prepare the temporary element with page breaks
  prepareForExport("temp-export-element");

  // Export the temporary element
  return exportDashboardToPDF("temp-export-element", filename).finally(() => {
    // Clean up the temporary element
    document.body.removeChild(clone);
  });
};

/**
 * Prepares a dashboard for export by adding page break classes
 * to prevent components from being split across pages
 * @param {string} elementId - The ID of the dashboard element
 */
const prepareForExport = (elementId) => {
  const dashboard = document.getElementById(elementId);
  if (!dashboard) return;

  // Add a class to the dashboard to enable print styling
  dashboard.classList.add("pdf-export-ready");

  // Find all top-level component containers that should be kept on one page
  const componentSelectors = [
    ".bg-white.p-5.rounded-lg.shadow-md", // Most component containers
    ".bg-white.rounded-lg.shadow-md", // Alternative container style
    ".bg-white.p-6.rounded-lg.shadow-md", // Header container
  ];

  // Select all components that match our selectors
  const components = dashboard.querySelectorAll(componentSelectors.join(", "));

  // Add page break styles to each component
  components.forEach((component, index) => {
    // Skip the page break for the very first component
    if (index === 0) return;

    // Add page break class
    component.classList.add("pdf-page-break-before");

    // Add inline style for better compatibility
    component.style.pageBreakBefore = "always";
    component.style.breakBefore = "page";

    // Add some spacing to ensure components don't touch page boundaries
    component.style.marginTop = "20px";
    component.style.paddingTop = "10px";
  });

  // Handle tables specially to prevent them from being cut
  const tables = dashboard.querySelectorAll("table");
  tables.forEach((table) => {
    table.classList.add("pdf-keep-together");
    table.style.pageBreakInside = "avoid";
    table.style.breakInside = "avoid";
  });

  // Handle chart containers
  const chartContainers = dashboard.querySelectorAll(".recharts-wrapper");
  chartContainers.forEach((chart) => {
    chart.closest(".bg-white").classList.add("pdf-keep-together");
    chart.closest(".bg-white").style.pageBreakInside = "avoid";
    chart.closest(".bg-white").style.breakInside = "avoid";
  });

  console.log(
    `Prepared ${components.length} components with page breaks for export`
  );
  return dashboard;
};

/**
 * Clean up after export by removing the page break classes
 * @param {string} elementId - The ID of the dashboard element
 */
export const cleanupAfterExport = (elementId = "dashboard-content") => {
  const dashboard = document.getElementById(elementId);
  if (!dashboard) return;

  // Remove the export class
  dashboard.classList.remove("pdf-export-ready");

  // Find all elements with our PDF classes
  const pdfElements = dashboard.querySelectorAll(
    ".pdf-page-break-before, .pdf-keep-together"
  );

  // Remove classes and inline styles
  pdfElements.forEach((element) => {
    element.classList.remove("pdf-page-break-before", "pdf-keep-together");
    element.style.pageBreakBefore = "";
    element.style.breakBefore = "";
    element.style.pageBreakInside = "";
    element.style.breakInside = "";
    element.style.marginTop = "";
    element.style.paddingTop = "";
  });

  console.log("Cleaned up PDF export classes and styles");
};
