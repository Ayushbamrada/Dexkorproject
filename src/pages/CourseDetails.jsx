import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RestrictedVideoPlayer from '../components/RestrictedVideoPlayer';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({}); // { videoId: progress% }
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

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/progress/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const map = {};
        res.data.forEach((item) => {
          if (item.videoDuration > 0) {
            map[item.videoId] = Math.floor((item.watchedSeconds / item.videoDuration) * 100);
          } else {
            map[item.videoId] = 0;
          }
        });
        setProgressMap(map);
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };

    fetchCourse();
    fetchProgress();
  }, [courseId, token]);

  const handleProgressUpdate = (videoId, progress) => {
    setProgressMap((prev) => ({ ...prev, [videoId]: progress }));
  };

  if (loading) return <div className="p-6 text-center text-xl">⏳ Loading...</div>;
  if (!course) return <div className="p-6 text-center text-red-500">❌ Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab="CourseDetail" />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Course Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-2">Watch course videos and access related documents below.</p>
        </div>

        {/* Videos with documents side by side */}
        <div className="space-y-12">
          {course.videos.map((video, index) => {
            // Calculate initial progress in seconds for the video
            const progressPercent = progressMap[video._id] || 0;
            const initialProgressSeconds = Math.floor((progressPercent / 100) * video.duration);

            return (
              <div
                key={video._id}
                className="bg-white shadow-md rounded-xl border border-gray-200 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Left: Video and progress bar */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {index + 1}. {video.title}
                  </h3>

                  {/* Progress Bar */}
                  <ProgressBar progress={progressPercent} />

                  <div className="w-full aspect-video rounded overflow-hidden">
                    <RestrictedVideoPlayer
                      videoUrl={`http://localhost:5000${video.videoUrl}`}
                      courseId={course._id}
                      videoId={video._id}
                      userId={userId}
                      onProgressUpdate={handleProgressUpdate}
                      initialProgressSeconds={initialProgressSeconds}
                      videoDuration={video.duration} // Pass duration for correct progress calc inside player
                    />
                  </div>
                </div>

                {/* Right: Related Documents */}
                <div>
                  <h4 className="text-lg font-medium text-green-700 mb-2">📄 Related Documents</h4>
                  {course.documents && course.documents.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-blue-600">
                      {course.documents.map((doc, docIndex) => (
                        <li key={docIndex}>
                          <a
                            href={`http://localhost:5000${encodeURI(doc.fileUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {doc.name || decodeURIComponent(doc.fileUrl.split('/').pop())}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No documents available.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
