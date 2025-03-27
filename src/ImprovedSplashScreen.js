import React, { useState } from "react";
import AnimatedFeaturePill from "./AnimatedFeaturePill";
import "./animations.css";

const ImprovedSplashScreen = ({ onFileSelect, file, isProcessing }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.createRef();

  // Enhanced color scheme with better contrast and visual hierarchy
  const colors = {
    teal: "#58DBB9",
    jade: "#4EBAA1",
    ash: "#3D4550",
    electricBlue: "#0066FF",
    digitalYellow: "#D6FC51",
    slate: "#20242A",
    cloudGrey: "#EEF2F6",
    gradientStart: "#58DBB9",
    gradientEnd: "#0066FF",
    gradientOverlay: "rgba(0, 0, 0, 0.1)",
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
      {/* Enhanced Hero Section */}
      <div className="text-center mb-12">
        <div
          className="py-12 px-8 rounded-xl mb-8 relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
          style={{
            background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white mb-6 fade-in animate-slide-up">
              Certify CSV Dashboard Tool
            </h1>
            <p className="text-xl text-white opacity-90 mb-8 fade-in-slow max-w-2xl mx-auto">
              Transform your Certify certification data into actionable
              insights.
            </p>
            {/* Enhanced Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <AnimatedFeaturePill
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                text="Visual Metrics"
                delay={0.1}
              />
              <AnimatedFeaturePill
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
                text="Employee Performance"
                delay={0.2}
              />
              <AnimatedFeaturePill
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                }
                text="Conversion Rate Trends"
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Instructions and Upload Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left: Enhanced Instructions */}
        <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: colors.ash }}
          >
            How It Works
          </h2>

          <ol className="space-y-6">
            <li className="flex items-start stagger-item fade-in">
              <div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4"
                style={{ backgroundColor: colors.teal }}
              >
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-lg mb-1">Upload your CSV file</p>
                <p className="text-gray-600">
                  Drag and drop or click to select a CSV file with your
                  installation data
                </p>
              </div>
            </li>

            <li className="flex items-start stagger-item fade-in">
              <div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4"
                style={{ backgroundColor: colors.teal }}
              >
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-lg mb-1">Process your data</p>
                <p className="text-gray-600">
                  Our system analyzes your data and generates metrics
                  automatically
                </p>
              </div>
            </li>

            <li className="flex items-start stagger-item fade-in">
              <div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4"
                style={{ backgroundColor: colors.teal }}
              >
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-lg mb-1">View your dashboard</p>
                <p className="text-gray-600">
                  Get interactive visualizations and insights from your data
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium mb-4 text-lg">Supported Data:</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                CSV files with installation metrics
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Headers should include Date, Status, Quality Score
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Employee email fields for performance tracking
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Enhanced Upload Dropzone */}
        <div className="flex flex-col items-center">
          <div
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-72 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer ${
              isDragActive
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md"
            } ${isDragActive ? "pulse" : "hover:pulse"}`}
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
                <div className="w-20 h-20 mb-6 text-blue-500 flex items-center justify-center rounded-full bg-blue-100 float animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
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
                <p className="text-xl font-medium text-blue-600">
                  Drop your CSV file here...
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mb-6 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
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
                <p className="text-xl font-medium mb-3">
                  Drag and drop your CSV file here
                </p>
                <p className="text-gray-500">or click to browse your files</p>
              </>
            )}
          </div>

          {/* Enhanced File Preview */}
          {file && (
            <div className="mt-8 w-full p-6 bg-white rounded-xl border border-gray-200 shadow-md fade-in hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="mr-4 p-3 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
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
                  <p className="font-medium text-lg">{file.name}</p>
                  <p className="text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB • Ready to process
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Get Started Button */}
          <button
            className={`mt-8 px-8 py-4 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105 ${
              file && !isProcessing
                ? "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                : "bg-gray-300 cursor-not-allowed"
            } ${file && !isProcessing ? "shimmer" : ""}`}
            disabled={!file || isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Generate Dashboard"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovedSplashScreen;
