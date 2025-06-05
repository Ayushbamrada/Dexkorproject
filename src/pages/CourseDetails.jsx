import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestrictedVideoPlayer from '../components/RestrictedVideoPlayer';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});
  const [uploadedAssignments, setUploadedAssignments] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, token]);

  const handleProgressUpdate = (videoId, progress) => {
    setProgressMap((prev) => ({ ...prev, [videoId]: progress }));
  };

  const handleFileChange = (videoIndex, file) => {
    setUploadedAssignments((prev) => ({
      ...prev,
      [videoIndex]: file,
    }));
  };

  const handleAssignmentUpload = async (videoIndex) => {
    const formData = new FormData();
    formData.append('assignmentFile', uploadedAssignments[videoIndex]);
    formData.append('studentId', userId);
    formData.append('courseId', courseId);
    formData.append('videoIndex', videoIndex);

    try {
      await axios.post('http://localhost:5000/api/submit-assignment', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Assignment submitted successfully!');
    } catch (error) {
      console.error('Error uploading assignment', error);
      alert('❌ Failed to upload assignment.');
    }
  };

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const goToQuiz = (moduleId) => {
    navigate(`/course/${courseId}/module/${moduleId}/quiz`);
  };

  if (loading) return <div className="p-6 text-center text-xl">⏳ Loading...</div>;
  if (!course) return <div className="p-6 text-center text-red-500">❌ Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab="CourseDetail" />
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{course.title}</h1>

        {course.modules?.map((module, moduleIndex) => (
          <div key={module._id} className="mb-8 border rounded-lg shadow bg-white">
            <button
              onClick={() => toggleModule(moduleIndex)}
              className="w-full text-left px-6 py-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 transition rounded-t-lg"
            >
              {expandedModules[moduleIndex] ? '🔽' : '▶'} Module {moduleIndex + 1}: {module.title}
            </button>

            {expandedModules[moduleIndex] && (
              <div className="p-6 space-y-6">
                {/* Videos Section */}
                {module.videos.map((video, videoIndex) => {
                  const progressPercent = progressMap[video._id] || 0;
                  const initialProgressSeconds = Math.floor((progressPercent / 100) * video.duration);

                  return (
                    <div key={video._id} className="border p-4 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">
                        🎬 {video.title}
                      </h3>

                      <ProgressBar progress={progressPercent} />
                      <div className="mt-3 aspect-video">
                        <RestrictedVideoPlayer
                          videoUrl={`http://localhost:5000${video.videoUrl}`}
                          courseId={course._id}
                          videoId={video._id}
                          userId={userId}
                          onProgressUpdate={handleProgressUpdate}
                          initialProgressSeconds={initialProgressSeconds}
                          videoDuration={video.duration}
                        />
                      </div>

                      {/* Assignment Upload */}
                      {video.assignment && (
                        <div className="mt-4">
                          <p className="font-medium mb-2">📥 Assignment: {video.assignment.name}</p>
                          <iframe
                            src={`http://localhost:5000${video.assignment.fileUrl}`}
                            className="w-full h-64 border"
                            title={video.assignment.name}
                            frameBorder="0"
                          ></iframe>

                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(`${moduleIndex}-${videoIndex}`, e.target.files[0])}
                            className="mt-3 block"
                          />
                          <button
                            onClick={() => handleAssignmentUpload(`${moduleIndex}-${videoIndex}`)}
                            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                          >
                            Upload Assignment
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Documents */}
                <div>
                  <h4 className="text-lg font-semibold text-green-800">📄 Module Documents</h4>
                  {module.documents?.length > 0 ? (
                    module.documents.map((doc, idx) => {
                      const fileUrl = `http://localhost:5000${encodeURI(doc.fileUrl)}`;
                      const fileName = doc.name || decodeURIComponent(doc.fileUrl.split('/').pop());

                      return (
                        <div key={idx} className="border p-3 mt-2 rounded">
                          <p className="font-medium">{fileName}</p>
                          <iframe
                            src={fileUrl}
                            className="w-full h-64 border"
                            title={fileName}
                            frameBorder="0"
                          ></iframe>

                          <div className="mt-2 flex gap-3">
                            <a href={fileUrl} target="_blank" className="text-blue-600 hover:underline">
                              🔍 View Fullscreen
                            </a>
                            <a href={fileUrl} download className="text-green-600 hover:underline">
                              ⬇ Download
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 italic">No documents available.</p>
                  )}
                </div>

                {/* Quiz Button */}
                {module.quiz && module.quiz.questions?.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => goToQuiz(module._id)}
                      className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                    >
                      🧠 Take Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
