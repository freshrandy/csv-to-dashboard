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
      {/* Enhanced Hero Section with Title */}
      <div className="text-center mb-8">
        <div
          className="py-8 px-8 rounded-xl mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4 fade-in animate-slide-up">
              Certify CSV Dashboard Tool
            </h1>
            <p className="text-xl text-white opacity-90 mb-4 fade-in-slow max-w-2xl mx-auto">
              Transform your certification data into actionable insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Area - Centered and Prominent */}
      <div className="mb-12 flex flex-col items-center justify-center">
        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-xl h-72 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer mb-6 ${
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
              <p className="text-2xl font-medium text-blue-600 mb-2">
                Drop your CSV file here...
              </p>
              <p className="text-blue-500">We'll handle the rest!</p>
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
              <p className="text-2xl font-medium mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-gray-500 mb-4">
                or click to browse your files
              </p>
            </>
          )}
        </div>

        {/* File Preview */}
        {file && (
          <div className="mt-2 w-full max-w-xl p-6 bg-white rounded-xl border border-gray-200 shadow-md fade-in hover:shadow-lg transition-shadow duration-300">
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
        {file && (
          <button
            className={`mt-6 px-8 py-4 rounded-xl font-medium text-white text-lg transition-all duration-300 transform hover:scale-105 ${
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
        )}
      </div>

      {/* How It Works Section - Below the Main Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 bg-white p-8 rounded-xl shadow">
        <div className="col-span-3">
          <h2
            className="text-2xl font-semibold mb-4 text-center"
            style={{ color: colors.ash }}
          >
            How It Works
          </h2>
        </div>

        <div className="flex flex-col items-center stagger-item fade-in text-center">
          <div
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full mb-4"
            style={{ backgroundColor: colors.teal }}
          >
            <span className="text-white font-bold text-xl">1</span>
          </div>
          <p className="font-medium text-lg mb-2">Upload your CSV file</p>
          <p className="text-gray-600">
            Drag and drop or click to select a CSV file with your certification
            data
          </p>
        </div>

        <div className="flex flex-col items-center stagger-item fade-in text-center">
          <div
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full mb-4"
            style={{ backgroundColor: colors.teal }}
          >
            <span className="text-white font-bold text-xl">2</span>
          </div>
          <p className="font-medium text-lg mb-2">Process your data</p>
          <p className="text-gray-600">
            Our system analyzes your data and generates metrics automatically
          </p>
        </div>

        <div className="flex flex-col items-center stagger-item fade-in text-center">
          <div
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full mb-4"
            style={{ backgroundColor: colors.teal }}
          >
            <span className="text-white font-bold text-xl">3</span>
          </div>
          <p className="font-medium text-lg mb-2">View your dashboard</p>
          <p className="text-gray-600">
            Get interactive visualizations and insights from your data
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedSplashScreen;
