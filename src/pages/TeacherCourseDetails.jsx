/* eslint-disable no-unused-vars */
import axios from 'axios';
import {useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

const TeacherCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // Mock data for demonstration - replace with actual API call
  const [course, setCourse] = useState({
    "title": "new testq",
    "description": "temopoinofnikn",
    "modules": [
        {
            "title": "module1",
            "videos": [
                {
                    "title": "video1",
                    "videoUrl": "/uploads/1749106952198-scroll.mp4",
                    "thumbnailUrl": "",
                    "assignment": null,
                    "_id": "68414108fe0e580ad3fa001f"
                }
            ],
            "documents": [],
            "quiz": {
                "questions": [
                    {
                        "questionText": "test",
                        "options": [
                            "QKFNDIO",
                            "FDKJIJI",
                            "FEIF",
                            "DFJEIFJ`"
                        ],
                        "correctAnswerIndex": 0,
                        "_id": "68414108fe0e580ad3fa0020"
                    },
                    {
                        "questionText": "KFJIFJI",
                        "options": [
                            "IJIJIJ",
                            "JIJIHI",
                            "I",
                            "JI"
                        ],
                        "correctAnswerIndex": 0,
                        "_id": "68414108fe0e580ad3fa0021"
                    }
                ]
            },
            "assignmentSubmissions": [],
            "_id": "68414108fe0e580ad3fa001e"
        }
    ],
    "_id": "68414108fe0e580ad3fa001d",
    "createdAt": "2025-06-05T07:02:32.463Z",
    "updatedAt": "2025-06-05T07:02:32.463Z",
    "__v": 0
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/course/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };

    fetchCourse();
  }, [courseId]);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
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
            onClick={() => navigate("/DashboardTeacher")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Course not found</div>
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
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>📅 Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                <span>📚 {course.modules.length} Module{course.modules.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <NavLink
              to={`/teacher-dashboard/course/edit/${courseId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              ✏️ Edit Course
            </NavLink>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {course.modules.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No modules added yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first module to this course.</p>
            <button
              onClick={() => navigate(`/teacher-dashboard/course/edit/${courseId}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Add Module
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {course.modules.map((module, moduleIndex) => (
              <div key={module._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Module Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    📖 Module {moduleIndex + 1}: {module.title}
                  </h2>
                  <div className="flex items-center gap-6 text-blue-100 text-sm">
                    <span>🎥 {module.videos.length} Video{module.videos.length !== 1 ? 's' : ''}</span>
                    <span>📄 {module.documents.length} Document{module.documents.length !== 1 ? 's' : ''}</span>
                    <span>❓ {module.quiz.questions.length} Quiz Question{module.quiz.questions.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Videos Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      🎥 Videos
                    </h3>
                    {module.videos.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {module.videos.map((video) => (
                          <div key={video._id} className="bg-gray-50 rounded-lg p-4 border">
                            <h4 className="font-medium text-gray-800 mb-3">{video.title}</h4>
                            <video
                              src={`http://localhost:5000${video.videoUrl}`}
                              controls
                              className="w-full rounded-lg shadow-sm"
                              poster={video.thumbnailUrl || undefined}
                            />
                            {video.assignment?.fileUrl && (
                              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-600">📋</span>
                                  <span className="font-medium text-yellow-800">Assignment:</span>
                                </div>
                                <a
                                  href={`http://localhost:5000${video.assignment.fileUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline block mt-1"
                                >
                                  {video.assignment.name}
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-2">🎬</div>
                        <p>No videos uploaded for this module</p>
                      </div>
                    )}
                  </div>

                  {/* Documents Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      📄 Documents
                    </h3>
                    {module.documents.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {module.documents.map((doc, docIndex) => (
                          <a
                            key={docIndex}
                            href={`http://localhost:5000${doc.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border hover:border-blue-300 transition-colors group"
                          >
                            <div className="text-2xl">📎</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 group-hover:text-blue-600 truncate">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-500">Click to download</p>
                            </div>
                            <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              ↗️
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-2">📚</div>
                        <p>No documents uploaded for this module</p>
                      </div>
                    )}
                  </div>

                  {/* Quiz Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      ❓ Quiz Questions
                    </h3>
                    {module.quiz.questions.length > 0 ? (
                      <div className="space-y-6">
                        {module.quiz.questions.map((question, questionIndex) => (
                          <div key={question._id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Question {questionIndex + 1}: {question.questionText}
                            </h4>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    question.correctAnswerIndex === optionIndex
                                      ? 'bg-green-100 border-green-300 text-green-800'
                                      : 'bg-white border-gray-200 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>
                                    <span>{option}</span>
                                    {question.correctAnswerIndex === optionIndex && (
                                      <span className="ml-auto text-green-600 font-semibold">✓ Correct</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-2">🤔</div>
                        <p>No quiz questions added for this module</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseDetails;