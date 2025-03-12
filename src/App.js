import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import styled from "styled-components";
import { saveAs } from "file-saver";
import { generateMetrics } from "./metrics";
import Loader from "./Loader";
import Dashboard from "./Dashboard";
import { generateQualityMetricsCohort } from "./cohortAnalysis";
import EmployeePerformanceTable from "./EmployeePerformanceTable";

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

function App() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState(14.99);
  const [dataWarning, setDataWarning] = useState("");

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

  const processMetrics = () => {
    if (!parsedData) return;

    try {
      setIsProcessing(true);

      // Convert parsed data back to CSV format for the generateMetrics function
      const csv = Papa.unparse(parsedData);
      const metricsResult = generateMetrics(csv, monthlyPrice);
      metricsResult.rawData = parsedData;

      // Add quality cohort analysis
      metricsResult.qualityCohort = generateQualityMetricsCohort(csv);

      // Add quality cohort analysis
      metricsResult.qualityCohort = generateQualityMetricsCohort(csv);

      setMetrics(metricsResult);

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

  return (
    <AppContainer>
      <Header>
        <Title>Certify CSV Dashboard Generator</Title>
        <Subtitle>
          Upload installation data to generate metrics and visualization
        </Subtitle>
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

          <div className="mt-4">
            <label
              htmlFor="monthlyPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Per Installation Monthly Price ($)
            </label>
            <input
              type="number"
              id="monthlyPrice"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
              style={{ maxWidth: "200px" }}
            />
          </div>

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
              <Button
                onClick={processMetrics}
                disabled={!parsedData}
                className="mt-4"
              >
                Generate Metrics
              </Button>
            </>
          )}
        </FileInfo>
      )}

      {metrics && (
        <>
          <h3>Metrics Generated</h3>
          <Button onClick={downloadJson}>Download JSON</Button>
          <div className="mt-4 flex gap-4">
            <Button
              onClick={() => {
                const element = document.getElementById("dashboard-section");
                element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Dashboard
            </Button>
          </div>
          <JsonPreview>{JSON.stringify(metrics, null, 2)}</JsonPreview>

          <div id="dashboard-section" className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Installation Dashboard</h2>
            <Dashboard metrics={metrics} />
          </div>
        </>
      )}
    </AppContainer>
  );
}

export default App;
