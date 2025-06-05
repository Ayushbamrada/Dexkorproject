import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { generateThumbnail } from '../utils/generateThumbnails';
import CourseCard from '../components/CourseCard';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/all-courses');

        const coursesWithThumbnails = await Promise.all(
          res.data.map(async (course) => {
            let firstVideoUrl = null;

            // ✅ Updated logic to extract video URL from modules
            if (Array.isArray(course.modules)) {
              for (let mod of course.modules) {
                if (mod.videos && mod.videos.length > 0 && mod.videos[0].videoUrl) {
                  firstVideoUrl = `http://localhost:5000${mod.videos[0].videoUrl}`;
                  break;
                }
              }
            }

            try {
              const thumbnail = firstVideoUrl
                ? await generateThumbnail(firstVideoUrl)
                : null;
              return { ...course, thumbnail };
            } catch (error) {
              console.error('Thumbnail generation error:', error);
              return { ...course, thumbnail: null };
            }
          })
        );

        setCourses(coursesWithThumbnails);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar activeTab="Dashboard" />
      <div className="text-3xl font-bold text-center mt-10 mb-6">All Courses</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-10">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.title}
            thumbnail={course.thumbnail}
            link={`/course/${course._id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
