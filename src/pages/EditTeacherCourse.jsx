/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTeacherCourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    modules: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCourse({
          title: res.data.title || '',
          description: res.data.description || '',
          modules: res.data.modules.map((mod) => ({
            _id: mod._id,
            title: mod.title || '',
            videos: mod.videos.map((vid) => ({
              _id: vid._id,
              title: vid.title,
              videoUrl: vid.videoUrl,
              newFile: null,
              assignment: vid.assignment,
            })),
            documents: mod.documents.map((doc) => ({
              _id: doc._id,
              name: doc.name,
              fileUrl: doc.fileUrl,
              newFile: null,
            })),
            quiz: {
              questions: mod.quiz.questions.map((q) => ({
                _id: q._id,
                questionText: q.questionText,
                options: [...q.options],
                correctAnswerIndex: q.correctAnswerIndex,
              })),
            },
          })),
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.response?.data?.message || 'Failed to load course data');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Handle course title and description changes
  const handleCourseTitleChange = (e) => {
    setCourse({ ...course, title: e.target.value });
  };

  const handleCourseDescriptionChange = (e) => {
    setCourse({ ...course, description: e.target.value });
  };

  // Handle module changes
  const handleModuleChange = (moduleIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], [field]: value };
    setCourse({ ...course, modules: updatedModules });
  };

  // Handle video changes
  const handleVideoChange = (moduleIndex, videoIndex, field, value) => {
    const updatedModules = [...course.modules];
    const updatedVideos = [...updatedModules[moduleIndex].videos];
    updatedVideos[videoIndex] = { ...updatedVideos[videoIndex], [field]: value };
    updatedModules[moduleIndex].videos = updatedVideos;
    setCourse({ ...course, modules: updatedModules });
  };

  // Handle document changes
  const handleDocumentChange = (moduleIndex, docIndex, file) => {
    const updatedModules = [...course.modules];
    const updatedDocuments = [...updatedModules[moduleIndex].documents];
    updatedDocuments[docIndex] = { ...updatedDocuments[docIndex], newFile: file };
    updatedModules[moduleIndex].documents = updatedDocuments;
    setCourse({ ...course, modules: updatedModules });
  };

  // Handle quiz question changes
  const handleQuizChange = (moduleIndex, questionIndex, field, value) => {
    const updatedModules = [...course.modules];
    const updatedQuestions = [...updatedModules[moduleIndex].quiz.questions];
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], [field]: value };
    updatedModules[moduleIndex].quiz.questions = updatedQuestions;
    setCourse({ ...course, modules: updatedModules });
  };

  // Handle quiz option changes
  const handleQuizOptionChange = (moduleIndex, questionIndex, optionIndex, value) => {
    const updatedModules = [...course.modules];
    const updatedQuestions = [...updatedModules[moduleIndex].quiz.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex].options = updatedOptions;
    updatedModules[moduleIndex].quiz.questions = updatedQuestions;
    setCourse({ ...course, modules: updatedModules });
  };

  // Add new module
  const addModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        {
          title: '',
          videos: [],
          documents: [],
          quiz: { questions: [] },
        },
      ],
    });
  };

  // Remove module
  const removeModule = (moduleIndex) => {
    setCourse({
      ...course,
      modules: course.modules.filter((_, i) => i !== moduleIndex),
    });
  };

  // Add new video to module
  const addVideo = (moduleIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].videos.push({ title: '', newFile: null, assignment: null });
    setCourse({ ...course, modules: updatedModules });
  };

  // Remove video from module
  const removeVideo = (moduleIndex, videoIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].videos = updatedModules[moduleIndex].videos.filter((_, i) => i !== videoIndex);
    setCourse({ ...course, modules: updatedModules });
  };

  // Add new document to module
  const addDocument = (moduleIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].documents.push({ name: '', newFile: null });
    setCourse({ ...course, modules: updatedModules });
  };

  // Remove document from module
  const removeDocument = (moduleIndex, docIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].documents = updatedModules[moduleIndex].documents.filter((_, i) => i !== docIndex);
    setCourse({ ...course, modules: updatedModules });
  };

  // Add new quiz question to module
  const addQuizQuestion = (moduleIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].quiz.questions.push({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
    });
    setCourse({ ...course, modules: updatedModules });
  };

  // Remove quiz question from module
  const removeQuizQuestion = (moduleIndex, questionIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].quiz.questions = updatedModules[moduleIndex].quiz.questions.filter((_, i) => i !== questionIndex);
    setCourse({ ...course, modules: updatedModules });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.title.trim() || !course.description.trim()) {
      alert('Course title and description are required.');
      return;
    }

    for (const mod of course.modules) {
      if (!mod.title.trim()) {
        alert('All modules must have a title.');
        return;
      }
      for (const vid of mod.videos) {
        if (!vid.title.trim() && (vid.newFile || !vid.videoUrl)) {
          alert('All videos must have a title and a file (for new videos).');
          return;
        }
      }
      for (const q of mod.quiz.questions) {
        if (!q.questionText.trim() || q.options.some(opt => !opt.trim()) || q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
          alert('All quiz questions must have a question, valid options, and a correct answer.');
          return;
        }
      }
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      alert('You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('teacherId', userId);

    course.modules.forEach((mod, modIndex) => {
      formData.append(`modules[${modIndex}][moduleId]`, mod._id || '');
      formData.append(`modules[${modIndex}][moduleTitle]`, mod.title);
      mod.videos.forEach((vid, vidIndex) => {
        formData.append(`modules[${modIndex}][videos][${vidIndex}][videoId]`, vid._id || '');
        formData.append(`modules[${modIndex}][videos][${vidIndex}][title]`, vid.title);
        if (vid.newFile) {
          formData.append(`modules[${modIndex}][videos][${vidIndex}][file]`, vid.newFile);
        }
      });
      mod.documents.forEach((doc, docIndex) => {
        formData.append(`modules[${modIndex}][documents][${docIndex}][documentId]`, doc._id || '');
        if (doc.newFile) {
          formData.append(`modules[${modIndex}][documents][${docIndex}]`, doc.newFile);
        }
      });
      formData.append(`modules[${modIndex}][quiz]`, JSON.stringify(mod.quiz.questions));
    });

    try {
      setSubmitting(true);
      await axios.put(`http://localhost:5000/api/course/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Course updated successfully!');
      navigate(`/teacher-dashboard/course/${courseId}`);
    } catch (error) {
      alert(`❌ Failed to update course: ${error.response?.data?.message || error.message}`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/teacher-dashboard/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={() => navigate('/teacher-dashboard')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/teacher-dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center text-sm"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Edit Course: {course.title}</h1>
            </div>
            <button
              onClick={() => navigate(`/teacher-dashboard/course/${courseId}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              👁️ Preview
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Course Title and Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📚 Course Details
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Course Title</label>
                <input
                  type="text"
                  value={course.title}
                  onChange={handleCourseTitleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Course Description</label>
                <textarea
                  value={course.description}
                  onChange={handleCourseDescriptionChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  placeholder="Describe your course"
                  required
                />
              </div>
            </div>
          </div>

          {/* Modules */}
          {course.modules.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">📚</div>
              <p>No modules added yet</p>
            </div>
          ) : (
            <div className="space-y-8">
              {course.modules.map((module, moduleIndex) => (
                <div key={module._id || `new-${moduleIndex}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Module Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">
                        📖 Module {moduleIndex + 1}: {module.title || 'Untitled'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="text-red-200 hover:text-red-100 text-sm"
                      >
                        🗑️ Remove Module
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Module Title */}
                    <div className="mb-6">
                      <label className="block mb-2 font-medium text-gray-700">Module Title</label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter module title"
                        required
                      />
                    </div>

                    {/* Videos Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        🎥 Videos
                      </h3>
                      {module.videos.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {module.videos.map((video, videoIndex) => (
                            <div key={video._id || `new-video-${videoIndex}`} className="bg-gray-50 rounded-lg p-4 border">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-gray-800">Video {videoIndex + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => removeVideo(moduleIndex, videoIndex)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  🗑️ Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                value={video.title}
                                onChange={(e) => handleVideoChange(moduleIndex, videoIndex, 'title', e.target.value)}
                                className="w-full p-2 mb-3 border rounded"
                                placeholder="Video title"
                                required
                              />
                              {video.videoUrl && (
                                <div className="mb-3">
                                  <p className="text-sm text-gray-600 mb-2">Current video:</p>
                                  <video
                                    src={`http://localhost:5000${video.videoUrl}`}
                                    className="w-full max-w-md border rounded"
                                    controls={false}
                                    preload="metadata"
                                  />
                                </div>
                              )}
                              <label className="block cursor-pointer w-full p-3 border-2 border-dashed border-blue-400 rounded text-center text-blue-700 hover:bg-blue-50">
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleVideoChange(moduleIndex, videoIndex, 'newFile', e.target.files[0])}
                                  className="hidden"
                                />
                                {video.newFile ? video.newFile.name : 'Replace or upload video file'}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          <div className="text-4xl mb-2">🎬</div>
                          <p>No videos added</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => addVideo(moduleIndex)}
                        className="mt-4 text-sm text-blue-600 underline"
                      >
                        + Add Video
                      </button>
                    </div>

                    {/* Documents Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        📄 Documents
                      </h3>
                      {module.documents.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {module.documents.map((doc, docIndex) => (
                            <div key={doc._id || `new-doc-${docIndex}`} className="bg-gray-50 rounded-lg p-4 border">
                              <div className="flex justify-between items-center mb-2">
                                <p className="font-medium text-gray-800 truncate">{doc.name || 'Untitled'}</p>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(moduleIndex, docIndex)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  🗑️ Remove
                                </button>
                              </div>
                              {doc.fileUrl && (
                                <a
                                  href={`http://localhost:5000${doc.fileUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 underline text-sm block mb-2"
                                >
                                  View current document
                                </a>
                              )}
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                onChange={(e) => handleDocumentChange(moduleIndex, docIndex, e.target.files[0])}
                                className="w-full p-2 border rounded text-sm"
                              />
                              {doc.newFile && <p className="text-sm mt-1 text-green-600">New file: {doc.newFile.name}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          <div className="text-4xl mb-2">📚</div>
                          <p>No documents added</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => addDocument(moduleIndex)}
                        className="mt-4 text-sm text-blue-600 underline"
                      >
                        + Add Document
                      </button>
                    </div>

                    {/* Quiz Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        ❓ Quiz Questions
                      </h3>
                      {module.quiz.questions.length > 0 ? (
                        <div className="space-y-6">
                          {module.quiz.questions.map((question, questionIndex) => (
                            <div key={question._id || `new-question-${questionIndex}`} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-gray-800">Question {questionIndex + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => removeQuizQuestion(moduleIndex, questionIndex)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  🗑️ Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                value={question.questionText}
                                onChange={(e) => handleQuizChange(moduleIndex, questionIndex, 'questionText', e.target.value)}
                                className="w-full p-2 mb-3 border rounded"
                                placeholder="Enter question"
                                required
                              />
                              <div className="grid gap-2 sm:grid-cols-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleQuizOptionChange(moduleIndex, questionIndex, optionIndex, e.target.value)}
                                      className="w-full p-2 border rounded"
                                      placeholder={`Option ${optionIndex + 1}`}
                                      required
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3">
                                <label className="block mb-1 font-medium text-gray-700">Correct Answer</label>
                                <select
                                  value={question.correctAnswerIndex}
                                  onChange={(e) => handleQuizChange(moduleIndex, questionIndex, 'correctAnswerIndex', parseInt(e.target.value))}
                                  className="w-full p-2 border rounded"
                                >
                                  {question.options.map((_, i) => (
                                    <option key={i} value={i}>
                                      {String.fromCharCode(65 + i)}. {question.options[i] || `Option ${i + 1}`}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          <div className="text-4xl mb-2">🤔</div>
                          <p>No quiz questions added</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => addQuizQuestion(moduleIndex)}
                        className="mt-4 text-sm text-blue-600 underline"
                      >
                        + Add Quiz Question
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Module Button */}
          <div className="mt-8">
            <button
              type="button"
              onClick={addModule}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              + Add Module
            </button>
          </div>

          {/* Submit / Cancel */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Course'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherCourseForm;