import React, { useState } from 'react';
import axios from 'axios';

const CreateCourseForm = ({ onSubmit, onCancel }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [videoSections, setVideoSections] = useState([
    { title: '', file: null, documents: [] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleCourseTitleChange = (e) => setCourseTitle(e.target.value);
  const handleCourseDescriptionChange = (e) => setCourseDescription(e.target.value);

  const handleVideoTitleChange = (index, value) => {
    const updated = [...videoSections];
    updated[index].title = value;
    setVideoSections(updated);
  };

  const handleVideoFileChange = (index, file) => {
    const updated = [...videoSections];
    updated[index].file = file;
    setVideoSections(updated);
  };

  const handleDocumentChange = (videoIndex, docIndex, file) => {
    const updated = [...videoSections];
    updated[videoIndex].documents[docIndex] = file;
    setVideoSections(updated);
  };

  const addVideoSection = () => {
    setVideoSections([...videoSections, { title: '', file: null, documents: [] }]);
  };

  const addDocumentToVideo = (videoIndex) => {
    const updated = [...videoSections];
    updated[videoIndex].documents.push(null);
    setVideoSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseTitle.trim() || !courseDescription.trim()) {
      alert('Title and description are required.');
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("You must be logged in.");
      return;
    }

    const formData = new FormData();
    formData.append('title', courseTitle);
    formData.append('description', courseDescription);
    formData.append('teacherId', userId);

    videoSections.forEach((video, index) => {
      formData.append('videoTitles', video.title);
      formData.append('videos', video.file);
      video.documents.forEach(doc => {
        formData.append(`documents`, doc);
      });
    });

    try {
      setSubmitting(true);
      const res = await axios.post('http://localhost:5000/api/create-course', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Course created successfully!');
      onSubmit(res.data.course);

      // Reset form
      setCourseTitle('');
      setCourseDescription('');
      setVideoSections([{ title: '', file: null, documents: [] }]);
    } catch (error) {
      alert('❌ Failed to create course.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Create a New Course</h2>

      {/* Course Title */}
      <label className="block mb-2 font-medium">Course Title</label>
      <input
        type="text"
        value={courseTitle}
        onChange={handleCourseTitleChange}
        className="w-full p-3 mb-4 border rounded-lg"
        placeholder="Enter course title"
        required
      />

      {/* Course Description */}
      <label className="block mb-2 font-medium">Course Description</label>
      <textarea
        value={courseDescription}
        onChange={handleCourseDescriptionChange}
        className="w-full p-3 mb-6 border rounded-lg"
        rows="4"
        placeholder="Describe your course"
        required
      />

      {/* Video Sections */}
      {videoSections.map((section, vIndex) => (
        <div key={vIndex} className="mb-10 border p-4 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">🎥 Video {vIndex + 1}</h3>

          {/* Video Title */}
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleVideoTitleChange(vIndex, e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            placeholder="Video title"
            required
          />

          {/* Upload Video */}
          <div className="mb-4">
            <label className="inline-block mb-2 font-medium">Upload Video</label>
            <label className="block cursor-pointer w-full p-3 border-2 border-dashed border-blue-400 rounded text-center text-blue-700 hover:bg-blue-50">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoFileChange(vIndex, e.target.files[0])}
                className="hidden"
                required
              />
              {section.file ? section.file.name : 'Click to choose video file'}
            </label>
          </div>

          {/* Related Documents */}
          <h4 className="font-medium mb-2">📄 Documents for this video</h4>
          {section.documents.map((doc, docIndex) => (
            <div key={docIndex} className="mb-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={(e) => handleDocumentChange(vIndex, docIndex, e.target.files[0])}
                className="w-full p-2 border rounded"
              />
              {doc && <p className="text-sm mt-1 text-gray-600">{doc.name}</p>}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addDocumentToVideo(vIndex)}
            className="text-sm text-blue-600 underline"
          >
            + Add Document
          </button>
        </div>
      ))}

      {/* Add Another Video */}
      <button
        type="button"
        onClick={addVideoSection}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add Another Video
      </button>

      {/* Submit / Cancel */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateCourseForm;
