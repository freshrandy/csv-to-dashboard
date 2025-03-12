import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-20 h-20">
        <div className="absolute w-16 h-16 m-2 rounded-full border-8 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export default Loader;
