import React from "react";

const AnimatedFeaturePill = ({ icon, text, delay = 0 }) => {
  return (
    <div
      className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-white inline-flex items-center mx-2 my-1 fade-in feature-pill stagger-item"
      style={{
        animationDelay: `${delay}s`,
        transition: "all 0.3s ease",
      }}
    >
      <span className="mr-2">{icon}</span> {text}
    </div>
  );
};

export default AnimatedFeaturePill;
