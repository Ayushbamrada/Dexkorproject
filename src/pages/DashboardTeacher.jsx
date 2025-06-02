import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CreateCourseForm from './CreateCourseForm';
import { generateThumbnail } from '../utils/generateThumbnails';

const DashboardTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/teacher/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coursesWithThumbnails = await Promise.all(
        res.data.map(async (course) => {
          if (course.videos && course.videos.length > 0) {
            const videoUrl = `http://localhost:5000${course.videos[0].videoUrl}`;
            try {
              const thumbnail = await generateThumbnail(videoUrl);
              return { ...course, thumbnail };
            } catch (err) {
              console.error('Error generating thumbnail for course:', course.title, err);
              return { ...course, thumbnail: null };
            }
          }
          return { ...course, thumbnail: null };
        })
      );

      setCourses(coursesWithThumbnails);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = (newCourse) => {
    setCourses([...courses, newCourse]);
    setShowForm(false);
  };

  const handleAddVideo = async (courseId) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      const title = prompt('Enter video title:');
      if (!file || !title) return;

      try {
        const thumbnailBase64 = await generateThumbnail(file);

        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('thumbnail', thumbnailBase64);

        const res = await axios.post(
          `http://localhost:5000/api/course/${courseId}/add-video`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const updated = res.data.updatedCourse;
        setCourses((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
      } catch (err) {
        console.error('Video upload error:', err);
      }
    };
  };

  const handleDeleteVideo = async (courseId, videoId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/course/${courseId}/video/${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = res.data.updatedCourse;
      setCourses((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab="Dashboard" />
      <div className="p-6">
        {showForm ? (
          <CreateCourseForm
            onSubmit={handleCreateCourse}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Create New Course
            </button>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Your Courses</h2>
            {loading ? (
              <p>Loading courses...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white p-4 rounded shadow border relative"
                  >
                    {/* Thumbnail Section */}
                    <div className="relative mb-2 h-40 w-full">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt="Thumbnail"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                          No Thumbnail
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold">{course.title}</h3>

                    {/* Videos List */}
                    <div className="mt-2">
                      <h4 className="font-semibold">Videos</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {course.videos.map((vid) => (
                          <li key={vid._id} className="flex justify-between items-center">
                            {vid.title}
                            <button
                              onClick={() => handleDeleteVideo(course._id, vid._id)}
                              className="text-xs text-red-500 ml-2"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleAddVideo(course._id)}
                        className="text-blue-600 text-sm mt-1 underline"
                      >
                        + Add Video
                      </button>
                    </div>

                    {/* Documents List */}
                    {course.documents.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold">Documents</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {course.documents.map((doc, i) => (
                            <li key={i}>
                              <a
                                href={`http://localhost:5000${doc.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600"
                              >
                                {doc.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardTeacher;
