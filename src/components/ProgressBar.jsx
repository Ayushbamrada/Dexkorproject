// components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-4 mb-3 shadow-inner overflow-hidden relative">
      <div
        className="h-4 rounded-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #34d399, #059669)', // green gradient
          transition: 'width 0.5s ease-in-out',
          boxShadow: '0 0 8px rgba(5, 150, 105, 0.6)',
        }}
      />
      <span
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-sm font-semibold text-gray-700 select-none"
      >
        {progress}% completed
      </span>
    </div>
  );
};

export default ProgressBar;
