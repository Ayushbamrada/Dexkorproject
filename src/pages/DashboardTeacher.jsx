import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CreateCourseForm from './CreateCourseForm';
import { generateThumbnail } from '../utils/generateThumbnails';
import { Link } from 'react-router-dom';

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
          let firstVideoUrl = null;

          // find the first available video in the module structure
          for (let mod of course.modules) {
            if (mod.videos.length > 0 && mod.videos[0].videoUrl) {
              firstVideoUrl = `http://localhost:5000${mod.videos[0].videoUrl}`;
              break;
            }
          }

          try {
            const thumbnail = firstVideoUrl
              ? await generateThumbnail(firstVideoUrl)
              : null;
            return { ...course, thumbnail };
          } catch (err) {
            console.error('Error generating thumbnail:', err);
            return { ...course, thumbnail: null };
          }
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
    setCourses((prev) => [...prev, newCourse]);
    setShowForm(false);
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
                  <div key={course._id} className="bg-white p-4 rounded shadow border relative">
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

                    {/* Module-wise Documents Display */}
                    {course.modules.map((mod, i) =>
                      mod.documents.length > 0 ? (
                        <div key={i} className="mt-4">
                          <h4 className="font-semibold">Documents in {mod.moduleTitle}</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {mod.documents.map((doc, j) => (
                              <li key={j}>
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
                      ) : null
                    )}

                    {/* View Course Button */}
                    <Link to={`/teacher-dashboard/course/${course._id}`}>
                      <button className="mt-3 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                        View Course
                      </button>
                    </Link>
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
