import React from 'react';
import VideoSectionForm from './VideoSectionForm';
import QuizForm from './QuizForm';

const ModuleForm = ({ moduleIndex, moduleData, onModuleChange, onRemoveModule }) => {
  const handleChange = (key, value) => {
    const updated = { ...moduleData, [key]: value };
    onModuleChange(moduleIndex, updated);
  };

  const handleVideoChange = (videos) => handleChange('videos', videos);
  const handleQuizChange = (quiz) => handleChange('quiz', quiz);

  const handleAssignmentChange = (file) => handleChange('assignment', file);

  const handleDocumentChange = (index, file) => {
    const updatedDocs = [...moduleData.documents];
    updatedDocs[index] = file;
    handleChange('documents', updatedDocs);
  };

  const addDocument = () => {
    handleChange('documents', [...moduleData.documents, null]);
  };

  return (
    <div className="p-4 border rounded bg-gray-50 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">📦 Module {moduleIndex + 1}</h3>
        {onRemoveModule && (
          <button
            type="button"
            onClick={() => onRemoveModule(moduleIndex)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ❌ Remove
          </button>
        )}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Module Title"
          value={moduleData.moduleTitle}
          onChange={(e) => handleChange('moduleTitle', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          required
        />

        <textarea
          placeholder="Module Description"
          value={moduleData.moduleDescription}
          onChange={(e) => handleChange('moduleDescription', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          rows="2"
          required
        />
      </div>

      <VideoSectionForm videos={moduleData.videos} onVideosChange={handleVideoChange} />
      <QuizForm quiz={moduleData.quiz} onQuizChange={handleQuizChange} />

      {/* Assignment Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">📎 Assignment</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleAssignmentChange(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
        {moduleData.assignment && (
          <p className="text-xs text-gray-600 mt-1">{moduleData.assignment.name}</p>
        )}
      </div>

      {/* Documents Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">📄 Documents</label>
        {moduleData.documents.map((doc, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={(e) => handleDocumentChange(idx, e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            {doc && <p className="text-xs mt-1 text-gray-600">{doc.name}</p>}
          </div>
        ))}
        <button
          type="button"
          onClick={addDocument}
          className="text-xs text-blue-600 hover:underline"
        >
          + Add Document
        </button>
      </div>
    </div>
  );
};

export default ModuleForm;
