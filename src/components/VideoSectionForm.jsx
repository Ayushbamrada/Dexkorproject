import React from 'react';

const VideoSectionForm = ({ videos, onVideosChange }) => {
  const handleVideoTitleChange = (index, value) => {
    const updated = [...videos];
    updated[index].title = value;
    onVideosChange(updated);
  };

  const handleVideoFileChange = (index, file) => {
    const updated = [...videos];
    updated[index].file = file;
    onVideosChange(updated);
  };

  const addVideo = () => {
    onVideosChange([...videos, { title: '', file: null }]);
  };

  const removeVideo = (index) => {
    const updated = videos.filter((_, i) => i !== index);
    onVideosChange(updated);
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm">
      <h4 className="text-base font-semibold text-blue-700 mb-3">🎬 Videos</h4>

      {videos.map((video, i) => (
        <div key={i} className="mb-4 p-3 rounded border border-blue-100 bg-white space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-600">Video {i + 1}</span>
            {videos.length > 1 && (
              <button
                type="button"
                onClick={() => removeVideo(i)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>

          <input
            type="text"
            value={video.title}
            onChange={(e) => handleVideoTitleChange(i, e.target.value)}
            placeholder="Video title"
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />

          <label className="block text-gray-600 text-xs font-medium">Upload File</label>
          <label className="block w-full p-2 border border-dashed border-blue-300 text-center rounded cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleVideoFileChange(i, e.target.files[0])}
              className="hidden"
              required
            />
            {video.file ? video.file.name : 'Click to upload video'}
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addVideo}
        className="w-full py-2 mt-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        ➕ Add Video
      </button>
    </div>
  );
};

export default VideoSectionForm;
