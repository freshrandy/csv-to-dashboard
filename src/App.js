/**
 * App Component
 * Main application component that handles CSV file uploads, data processing,
 * and renders the dashboard or selection interfaces based on application state.
 */
import React, { useState, useRef, useEffect } from "react";

// Third-party library imports
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import styled from "styled-components";
import { saveAs } from "file-saver";

// Custom utility functions
import { generateMetrics } from "./metrics";
import { generateQualityMetricsCohort } from "./cohortAnalysis";

// UI components
import Loader from "./Loader";
import Dashboard from "./Dashboard";
import FilterGroupSelection from "./FilterGroupSelection";
import { TooltipProvider } from "./TooltipContext";
import ImprovedSplashScreen from "./ImprovedSplashScreen";
import "./animations.css";

// Styled components
const AppContainer = styled.div`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
`;

const Subtitle = styled.p`
  color: #4a5568;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #a0aec0;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.isDragActive ? "#ebf4ff" : "#f7fafc")};

  &:hover {
    border-color: #4299e1;
  }
`;

const FileInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #edf2f7;
  border-radius: 0.5rem;
`;

const Button = styled.button`
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const WarningBanner = styled.div`
  background-color: #fffbeb;
  color: #92400e;
  border: 1px solid #fef3c7;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0.75rem 0;
  font-size: 0.875rem;
`;

/**
 * Main App Component
 *
 * @returns {React.ReactElement} Rendered application
 */
function App() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataWarning, setDataWarning] = useState("");
  const [showEnhancedUI, setShowEnhancedUI] = useState(true);
  const [showFilterGroupSelection, setShowFilterGroupSelection] =
    useState(false);
  const [activeFilterGroup, setActiveFilterGroup] = useState(null);

  // Initialize filter groups
  const [filterGroups, setFilterGroups] = useState({
    all: {
      name: "All Employees",
      description: "No filtering applied",
      employees: [],
    },
    group1: {
      name: "Group 1",
      description: "Click Edit to add a description",
      employees: [],
    },
    group2: {
      name: "Group 2",
      description: "Click Edit to add a description",
      employees: [],
    },
    group3: {
      name: "Group 3",
      description: "Click Edit to add a description",
      employees: [],
    },
    group4: {
      name: "Group 4",
      description: "Click Edit to add a description",
      employees: [],
    },
  });

  // State for saved configurations
  const [savedConfigs, setSavedConfigs] = useState([]);

  /**
   * Load saved configurations from localStorage on component mount
   */
  useEffect(() => {
    const savedGroups = localStorage.getItem("dashboard-filter-groups");
    if (savedGroups) {
      try {
        setFilterGroups(JSON.parse(savedGroups));
      } catch (error) {
        // Silently handle error loading saved groups
      }
    }

    const savedConfigsList = localStorage.getItem("dashboard-saved-configs");
    if (savedConfigsList) {
      try {
        setSavedConfigs(JSON.parse(savedConfigsList));
      } catch (error) {
        // Silently handle error loading saved configs
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        parseCSV(selectedFile);
      }
    },
  });

  /**
   * Parse CSV file contents
   *
   * @param {File} file - The CSV file to parse
   */
  const parseCSV = (file) => {
    setIsProcessing(true);
    // Reset any previous states
    setMetrics(null);
    setFilteredData(null);
    setShowFilterGroupSelection(false);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Check if important data is missing
        const sampleRow = results.data[0] || {};
        const hasAddresses =
          "Address" in sampleRow && sampleRow.Address !== null;

        // Check for employee data
        const hasEmployeeEmailColumn =
          "Employee Email" in sampleRow || "Employee" in sampleRow;

        const hasEmployeeData = results.data.some((row) => {
          const email = row["Employee Email"] || row["Employee"];
          return (
            email &&
            typeof email === "string" &&
            !email.includes("@routethis.com")
          );
        });

        // Set parsed data
        setParsedData(results.data);

        // Add a slight delay before setting isProcessing to false
        // This ensures the loader has time to render
        setTimeout(() => {
          setIsProcessing(false);
          // Show filter group selection after parsing
          setShowFilterGroupSelection(true);
        }, 300);

        // Show warnings about missing data
        let warnings = [];

        if (!hasAddresses) {
          warnings.push(
            "Address data is missing. Some metrics will be based on assessment count instead of unique locations."
          );
        }

        if (!hasEmployeeEmailColumn || !hasEmployeeData) {
          warnings.push(
            "Employee data is missing or incomplete. Employee-specific filtering will be limited."
          );
        }

        if (warnings.length > 0) {
          setDataWarning("Note: " + warnings.join(" "));
        } else {
          setDataWarning("");
        }
      },
      error: (error) => {
        setIsProcessing(false);
        setDataWarning("Error parsing CSV. Please check the file format.");
      },
    });
  };

  /**
   * Handle filter group selection and apply the filter
   *
   * @param {string} groupKey - Key of the selected filter group
   */
  const handleFilterGroupSelect = (groupKey) => {
    setIsProcessing(true);
    setActiveFilterGroup(groupKey);

    if (groupKey === "all" || !parsedData) {
      // Process all data without filtering
      processMetrics(parsedData);
      return;
    }

    // Get the selected group
    const selectedGroup = filterGroups[groupKey];

    // Check if the group has employees defined
    if (!selectedGroup.employees || selectedGroup.employees.length === 0) {
      processMetrics(parsedData); // Process all data if no employees in group
      return;
    }

    // Filter the data to only include rows from selected employees
    const filtered = parsedData.filter(
      (row) =>
        selectedGroup.employees.includes(
          row["Employee Email"] || row["Employee"]
        ) ||
        (!row["Employee Email"] && !row["Employee"]) // Include rows without employee email
    );

    setFilteredData(filtered);

    // Process metrics with the filtered data
    processMetrics(filtered);
  };

  /**
   * Update a filter group with new settings
   *
   * @param {string} groupKey - Key of the group to update
   * @param {Object} updatedGroup - New group settings
   */
  const handleUpdateFilterGroup = (groupKey, updatedGroup) => {
    setFilterGroups((prev) => {
      const updated = {
        ...prev,
        [groupKey]: updatedGroup,
      };

      // Save to localStorage
      localStorage.setItem("dashboard-filter-groups", JSON.stringify(updated));

      return updated;
    });
  };

  /**
   * Save current filter groups as a named configuration
   *
   * @param {string} configName - Name for the saved configuration
   */
  const saveCurrentConfiguration = (configName) => {
    const newConfig = {
      name: configName,
      date: new Date().toLocaleDateString(),
      groups: filterGroups,
    };

    setSavedConfigs((prev) => {
      const updated = [...prev, newConfig];

      // Save to localStorage
      localStorage.setItem("dashboard-saved-configs", JSON.stringify(updated));

      return updated;
    });
  };

  /**
   * Load a saved configuration
   *
   * @param {number} configIndex - Index of the configuration to load
   */
  const loadSavedConfiguration = (configIndex) => {
    const config = savedConfigs[configIndex];
    if (config && config.groups) {
      setFilterGroups(config.groups);

      // Save to localStorage
      localStorage.setItem(
        "dashboard-filter-groups",
        JSON.stringify(config.groups)
      );
    }
  };

  /**
   * Delete a saved configuration
   *
   * @param {number} configIndex - Index of the configuration to delete
   */
  const deleteSavedConfiguration = (configIndex) => {
    setSavedConfigs((prev) => {
      const updated = prev.filter((_, index) => index !== configIndex);

      // Save to localStorage
      localStorage.setItem("dashboard-saved-configs", JSON.stringify(updated));

      return updated;
    });
  };

  /**
   * Export configurations as JSON file
   */
  const exportConfigurations = () => {
    const data = {
      filterGroups: filterGroups,
      savedConfigs: savedConfigs,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `dashboard-filter-configs.json`);
  };

  /**
   * Import configurations from JSON file
   *
   * @param {File} file - JSON file containing saved configurations
   */
  const importConfigurations = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.filterGroups) {
          setFilterGroups(data.filterGroups);
          localStorage.setItem(
            "dashboard-filter-groups",
            JSON.stringify(data.filterGroups)
          );
        }
        if (data.savedConfigs) {
          setSavedConfigs(data.savedConfigs);
          localStorage.setItem(
            "dashboard-saved-configs",
            JSON.stringify(data.savedConfigs)
          );
        }
      } catch (error) {
        setDataWarning(
          "Error importing configurations. Please check the file format."
        );
      }
    };
    reader.readAsText(file);
  };

  /**
   * Process metrics based on provided data
   *
   * @param {Array} dataToProcess - Array of data objects to process
   */
  const processMetrics = (dataToProcess = filteredData) => {
    if (!dataToProcess) return;

    try {
      setIsProcessing(true);

      // Convert parsed data back to CSV format for the generateMetrics function
      const csv = Papa.unparse(dataToProcess);
      const metricsResult = generateMetrics(csv);
      metricsResult.rawData = dataToProcess;

      // Add quality cohort analysis
      metricsResult.qualityCohort = generateQualityMetricsCohort(csv);

      setMetrics(metricsResult);
      setShowFilterGroupSelection(false); // Hide filter group selection once metrics are generated

      // Add a slight delay before setting isProcessing to false
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    } catch (error) {
      setIsProcessing(false);
      setDataWarning(
        "Error generating metrics. Please check the data in your CSV file."
      );
    }
  };

  /**
   * Download metrics as JSON file
   */
  const downloadJson = () => {
    if (!metrics) return;

    const blob = new Blob([JSON.stringify(metrics, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `${file.name.replace(".csv", "")}-metrics.json`);
  };

  /**
   * Reset the application to initial state
   */
  const resetApp = () => {
    setMetrics(null);
    setFile(null);
    setParsedData(null);
    setFilteredData(null);
    setDataWarning("");
    setActiveFilterGroup(null);
    setShowFilterGroupSelection(false);
  };

  /**
   * Change filter from dashboard view
   */
  const handleChangeFilter = () => {
    setMetrics(null);
    setShowFilterGroupSelection(true);
  };

  /**
   * Handle files dropped on the ImprovedSplashScreen component
   *
   * @param {Array} files - The files dropped or selected
   */
  const handleDroppedFiles = (files) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  /**
   * Render the enhanced UI splash screen
   *
   * @returns {React.ReactElement} Enhanced UI splash screen
   */
  const renderEnhancedSplashScreen = () => (
    <ImprovedSplashScreen
      onFileSelect={handleDroppedFiles}
      file={file}
      isProcessing={isProcessing}
    />
  );

  /**
   * Render the original minimal UI
   *
   * @returns {React.ReactElement} Minimal UI interface
   */
  const renderOriginalUI = () => (
    <>
      <Header>
        <Title>Certify CSV Dashboard Generator</Title>
        <Subtitle>
          Upload installation data to generate metrics and visualization
        </Subtitle>
        <button
          onClick={() => setShowEnhancedUI(true)}
          className="text-sm text-blue-500 hover:text-blue-700 mt-2"
        >
          Switch to UI view
        </button>
      </Header>

      <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here...</p>
        ) : (
          <p>Drag and drop a CSV file here, or click to select a file</p>
        )}
      </DropzoneContainer>

      {file && (
        <FileInfo>
          <h3>File loaded: {file.name}</h3>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Records: {parsedData ? parsedData.length : "Calculating..."}</p>

          {dataWarning && (
            <WarningBanner>
              <p>{dataWarning}</p>
            </WarningBanner>
          )}

          {isProcessing ? (
            <>
              <div className="mt-4 p-2 border border-gray-300 rounded bg-gray-50">
                <p className="mb-2 text-gray-600">
                  Processing data, please wait...
                </p>
                <Loader />
              </div>
            </>
          ) : (
            <></>
          )}
        </FileInfo>
      )}
    </>
  );

  /**
   * Determine what content to render based on the current state
   *
   * @returns {React.ReactElement} Appropriate content for current application state
   */
  const renderContent = () => {
    if (metrics) {
      // Show the dashboard if metrics are generated
      return (
        <>
          <div id="dashboard-section" className="mt-8">
            <Dashboard
              metrics={metrics}
              activeFilterGroup={activeFilterGroup}
              filterGroups={filterGroups}
              onChangeFilter={handleChangeFilter}
              onDownloadJson={downloadJson}
              onResetApp={resetApp}
            />
          </div>
        </>
      );
    } else if (showFilterGroupSelection && parsedData) {
      // Show filter group selection if data is parsed but metrics aren't generated yet
      return (
        <FilterGroupSelection
          parsedData={parsedData}
          filterGroups={filterGroups}
          savedConfigs={savedConfigs}
          onUpdateFilterGroup={handleUpdateFilterGroup}
          onSaveConfiguration={saveCurrentConfiguration}
          onLoadConfiguration={loadSavedConfiguration}
          onDeleteConfiguration={deleteSavedConfiguration}
          onExportConfigurations={exportConfigurations}
          onImportConfigurations={importConfigurations}
          onFilterSelect={handleFilterGroupSelect}
          isProcessing={isProcessing}
        />
      );
    } else {
      // Show the file upload UI
      return showEnhancedUI ? renderEnhancedSplashScreen() : renderOriginalUI();
    }
  };

  return (
    <TooltipProvider>
      <AppContainer>{renderContent()}</AppContainer>
    </TooltipProvider>
  );
}

export default App;
