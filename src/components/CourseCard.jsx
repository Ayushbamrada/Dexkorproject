// CourseCard.js
import React from 'react';

const CourseCard = ({ title, thumbnail, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border">
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Thumbnail Available</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <a
          href={link}
          className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Start Learning Now
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
