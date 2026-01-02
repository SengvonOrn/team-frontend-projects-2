import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="w-full min-h-screen p-6 flex justify-center items-center">
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
      <p className="text-lg text-gray-600">Loading profile...</p>
    </div>
  </div>
);

export default LoadingSpinner;