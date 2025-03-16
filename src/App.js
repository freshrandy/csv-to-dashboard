import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import styled from "styled-components";
import { saveAs } from "file-saver";
import { generateMetrics } from "./metrics";
import Loader from "./Loader";
import Dashboard from "./Dashboard";
import { generateQualityMetricsCohort } from "./cohortAnalysis";
import EmployeePerformanceTable from "./EmployeePerformanceTable";
import EmployeeQualityCohortTable from "./EmployeeQualityCohortTable";
import EmployeeSelection from "./EmployeeSelection"; // Import the new component

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

const JsonPreview = styled.pre`
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow: auto;
  max-height: 300px;
  margin-top: 1.5rem;
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

// Enhanced splash screen styled components
const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 3rem 1rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #58dbb9 0%, #0066ff 100%);
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
`;

const FeaturePill = styled.div`
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  margin: 0.25rem;
  font-size: 0.875rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InstructionsPanel = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StepNumber = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #58dbb9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
  flex-shrink: 0;
`;

const UploadPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EnhancedDropzone = styled.div`
  width: 100%;
  height: 16rem;
  border: 2px dashed;
  border-color: ${(props) => (props.isDragActive ? "#3B82F6" : "#CBD5E0")};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;
  background-color: ${(props) => (props.isDragActive ? "#EBF5FF" : "#F8FAFC")};

  &:hover {
    border-color: #3b82f6;
    background-color: #f1f5f9;
  }
`;

const IconCircle = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background-color: ${(props) => (props.active ? "#BFDBFE" : "#E5E7EB")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  svg {
    color: ${(props) => (props.active ? "#3B82F6" : "#9CA3AF")};
  }
`;

const DashboardPreview = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

function App() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [filteredData, setFilteredData] = useState(null); // New state for filtered data
  const [metrics, setMetrics] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataWarning, setDataWarning] = useState("");
  const [showEnhancedUI, setShowEnhancedUI] = useState(true);
  const [showEmployeeSelection, setShowEmployeeSelection] = useState(false); // New state for controlling view

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

  const parseCSV = (file) => {
    console.log("Starting CSV parsing, setting isProcessing to true");
    setIsProcessing(true);
    // Reset any previous states
    setMetrics(null);
    setFilteredData(null);
    setShowEmployeeSelection(false);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Check if important data is missing
        const sampleRow = results.data[0] || {};
        const hasAddresses =
          "Address" in sampleRow && sampleRow.Address !== null;

        // Set parsed data
        setParsedData(results.data);

        // Add a slight delay before setting isProcessing to false
        // This ensures the loader has time to render
        setTimeout(() => {
          console.log("CSV parsing complete, setting isProcessing to false");
          setIsProcessing(false);
          // Show employee selection after parsing
          setShowEmployeeSelection(true);
        }, 300);

        // Show a warning about missing data
        if (!hasAddresses) {
          setDataWarning(
            "Note: Address data is missing. Some metrics will be based on assessment count instead of unique locations."
          );
        } else {
          setDataWarning("");
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setIsProcessing(false);
        setDataWarning("Error parsing CSV. Please check the file format.");
      },
    });
  };

  // New function to handle employee selection
  const handleEmployeeSelect = (selectedEmployees) => {
    if (!parsedData || !selectedEmployees.length) return;

    setIsProcessing(true);

    // Filter the data to only include rows from selected employees
    const filtered = parsedData.filter(
      (row) =>
        selectedEmployees.includes(row["Employee Email"]) ||
        !row["Employee Email"] // Include rows without employee email
    );

    setFilteredData(filtered);

    // Now process metrics with the filtered data
    processMetrics(filtered);
  };

  const processMetrics = (dataToProcess = filteredData) => {
    if (!dataToProcess) return;

    try {
      setIsProcessing(true);

      // Convert parsed data back to CSV format for the generateMetrics function
      const csv = Papa.unparse(dataToProcess);
      // Pass default value for monthly price (or remove entirely if metrics.js is updated too)
      const metricsResult = generateMetrics(csv);
      metricsResult.rawData = dataToProcess;

      // Add quality cohort analysis
      metricsResult.qualityCohort = generateQualityMetricsCohort(csv);

      setMetrics(metricsResult);
      setShowEmployeeSelection(false); // Hide employee selection once metrics are generated

      // Add a slight delay before setting isProcessing to false
      // This ensures the loader has time to render
      setTimeout(() => {
        console.log(
          "Metrics generation complete, setting isProcessing to false"
        );
        setIsProcessing(false);
      }, 300);
    } catch (error) {
      console.error("Error generating metrics:", error);
      setIsProcessing(false);
      setDataWarning(
        "Error generating metrics. Please check the data in your CSV file."
      );
    }
  };

  const downloadJson = () => {
    if (!metrics) return;

    const blob = new Blob([JSON.stringify(metrics, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `${file.name.replace(".csv", "")}-metrics.json`);
  };

  const resetApp = () => {
    setMetrics(null);
    setFile(null);
    setParsedData(null);
    setFilteredData(null);
    setDataWarning("");
    setShowEmployeeSelection(false);
  };

  // Render the enhanced UI splash screen
  const renderEnhancedSplashScreen = () => (
    <>
      <HeroSection>
        <HeroTitle>Certify Dashboard Generator</HeroTitle>
        <HeroSubtitle>Generate metrics insights automatically.</HeroSubtitle>

        <div>
          <FeaturePill>
            <span
              role="img"
              aria-label="chart"
              style={{ marginRight: "0.5rem" }}
            >
              📊
            </span>
            Visual Metrics
          </FeaturePill>
          <FeaturePill>
            <span
              role="img"
              aria-label="people"
              style={{ marginRight: "0.5rem" }}
            >
              👥
            </span>
            Employee Performance
          </FeaturePill>
          <FeaturePill>
            <span
              role="img"
              aria-label="insights"
              style={{ marginRight: "0.5rem" }}
            >
              🔍
            </span>
            Data Insights
          </FeaturePill>
        </div>
      </HeroSection>

      <ContentGrid>
        {/* Left panel - Instructions */}
        <InstructionsPanel>
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "#3D4550" }}
          >
            How It Works
          </h2>

          <ol className="space-y-4">
            <StepItem>
              <StepNumber>1</StepNumber>
              <div>
                <p className="font-medium">Upload your CSV file</p>
                <p className="text-sm text-gray-600">
                  Drag and drop or click to select a CSV file.
                </p>
              </div>
            </StepItem>

            <StepItem>
              <StepNumber>2</StepNumber>
              <div>
                <p className="font-medium">Select employees to analyze</p>
                <p className="text-sm text-gray-600">
                  Choose which employees to include in your dashboard.
                </p>
              </div>
            </StepItem>

            <StepItem>
              <StepNumber>3</StepNumber>
              <div>
                <p className="font-medium">View your dashboard</p>
                <p className="text-sm text-gray-600">
                  Get interactive visualizations and insights from your data.
                </p>
              </div>
            </StepItem>
          </ol>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Supported Data:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• CSV files with installation metrics.</li>
              <li>• Headers should include Date, Status, Quality Score.</li>
              <li>• Employee email fields for performance tracking.</li>
            </ul>
          </div>
        </InstructionsPanel>

        {/* Right panel - Upload */}
        <UploadPanel>
          <EnhancedDropzone {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />

            <IconCircle active={isDragActive}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </IconCircle>

            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600">
                Drop your CSV file here...
              </p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Drag and drop your CSV file here
                </p>
                <p className="text-gray-500">or click to browse your files</p>
              </>
            )}
          </EnhancedDropzone>

          {/* File Preview (if uploaded) */}
          {file && (
            <FileInfo>
              <h3>File loaded: {file.name}</h3>
              <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
              <p>
                Records: {parsedData ? parsedData.length : "Calculating..."}
              </p>

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
                <>
                  {/* We no longer need this button as the employee selection will trigger metrics generation */}
                </>
              )}
            </FileInfo>
          )}
        </UploadPanel>
      </ContentGrid>

      {/* Toggle Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowEnhancedUI(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Switch to minimal view
        </button>
      </div>
    </>
  );

  // Render the original UI
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
              {console.log("Rendering loader component")}
              <div className="mt-4 p-2 border border-gray-300 rounded bg-gray-50">
                <p className="mb-2 text-gray-600">
                  Processing data, please wait...
                </p>
                <Loader />
              </div>
            </>
          ) : (
            <>
              {console.log("Rendering generate metrics button")}
              {/* We no longer need this button as the employee selection will trigger metrics generation */}
            </>
          )}
        </FileInfo>
      )}
    </>
  );

  // Determine what to show based on the current state
  const renderContent = () => {
    if (metrics) {
      // Show the dashboard if metrics are generated
      return (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Dashboard Generated</h3>
            <div className="flex gap-4">
              <Button onClick={downloadJson}>Download JSON</Button>
              <Button onClick={resetApp}>New Analysis</Button>
            </div>
          </div>
          <div id="dashboard-section" className="mt-8">
            <Dashboard metrics={metrics} />
          </div>
        </>
      );
    } else if (showEmployeeSelection && parsedData) {
      // Show employee selection if data is parsed but metrics aren't generated yet
      return (
        <EmployeeSelection
          parsedData={parsedData}
          onEmployeeSelect={handleEmployeeSelect}
          isProcessing={isProcessing}
        />
      );
    } else {
      // Show the file upload UI
      return showEnhancedUI ? renderEnhancedSplashScreen() : renderOriginalUI();
    }
  };

  return <AppContainer>{renderContent()}</AppContainer>;
}

export default App;
