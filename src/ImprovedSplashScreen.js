import React, { useState } from "react";

const ImprovedSplashScreen = ({ onFileSelect, file, isProcessing }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.createRef();

  // Define colors from your existing color scheme
  const colors = {
    teal: "#58DBB9",
    jade: "#4EBAA1",
    ash: "#3D4550",
    electricBlue: "#0066FF",
    digitalYellow: "#D6FC51",
    slate: "#20242A",
    cloudGrey: "#EEF2F6",
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        onFileSelect([file]); // Match the expected format from dropzone
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect([e.target.files[0]]); // Match the expected format from dropzone
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div
          className="py-10 px-6 rounded-lg mb-6"
          style={{
            background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.electricBlue} 100%)`,
            opacity: 0.95,
          }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Certify CSV Dashboard Generator
          </h1>
          <p className="text-xl text-white opacity-90 mb-6">
            Transform your installation data into actionable insights
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
              <span className="mr-2">📊</span> Visual Metrics
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
              <span className="mr-2">👥</span> Employee Performance
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
              <span className="mr-2">💰</span> Revenue Impact
            </div>
          </div>
        </div>
      </div>

      {/* Instructions and Upload Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left: Instructions */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: colors.ash }}
          >
            How It Works
          </h2>

          <ol className="space-y-4">
            <li className="flex items-start">
              <div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3"
                style={{ backgroundColor: colors.teal }}
              >
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Upload your CSV file</p>
                <p className="text-gray-600 text-sm">
                  Drag and drop or click to select a CSV file with your
                  installation data
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3"
                style={{ backgroundColor: colors.teal }}
              >
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Process your data</p>
                <p className="text-gray-600 text-sm">
                  Our system analyzes your data and generates metrics
                  automatically
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3"
                style={{ backgroundColor: colors.teal }}
              >
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">View your dashboard</p>
                <p className="text-gray-600 text-sm">
                  Get interactive visualizations and insights from your data
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Supported Data:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• CSV files with installation metrics</li>
              <li>• Headers should include Date, Status, Quality Score</li>
              <li>• Employee email fields for performance tracking</li>
            </ul>
          </div>
        </div>

        {/* Right: Upload Dropzone */}
        <div className="flex flex-col items-center">
          <div
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-all duration-200 cursor-pointer ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".csv"
              onChange={handleFileInputChange}
            />

            {isDragActive ? (
              <>
                <div className="w-16 h-16 mb-4 text-blue-500 flex items-center justify-center rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
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
                </div>
                <p className="text-lg font-medium text-blue-600">
                  Drop your CSV file here...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mb-4 text-gray-400 flex items-center justify-center rounded-full bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
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
                </div>
                <p className="text-lg font-medium mb-2">
                  Drag and drop your CSV file here
                </p>
                <p className="text-gray-500">or click to browse your files</p>
              </>
            )}
          </div>

          {/* File Preview (if uploaded) */}
          {file && (
            <div className="mt-6 w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="mr-3 p-2 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB • Ready to process
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Get Started Button */}
          <button
            className={`mt-6 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              file && !isProcessing
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!file || isProcessing}
          >
            {isProcessing ? "Processing..." : "Generate Dashboard"}
          </button>
        </div>
      </div>

      {/* Bottom Section - Demo/Example */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: colors.ash }}
        >
          Dashboard Preview
        </h2>

        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src="/api/placeholder/800/450"
            alt="Dashboard Preview"
            className="w-full h-auto object-cover"
          />
        </div>

        <p className="text-gray-600 text-sm text-center mt-4">
          Example of a generated dashboard with quality metrics, performance
          analysis, and regional breakdown
        </p>
      </div>
    </div>
  );
};

export default ImprovedSplashScreen;
