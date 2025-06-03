// src/pages/TeacherCourseDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherCourseDetails = () => {
  const navigate = useNavigate()
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

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

  if (!course) return <div>Loading course...</div>;

  return (
    <div className="p-4">
      <div className=' flex items-center justify-between '>
        <h1 className="text-2xl font-bold mb-4">Course: {course.title}</h1>
        <button 
          onClick={() => navigate(`/teacher-dashboard/course/edit/${courseId}`)}
          className=' border rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 px-4 flex items-center justify-center' 
        >Edit Course</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Videos:</h2>
        {course.videos.length > 0 ? (
          <ul>
            {course.videos.map((video) => (
              <li key={video._id} className="mb-4 border p-2 rounded">
                <p><strong>Title:</strong> {video.title}</p>
                <video
                  src={`http://localhost:5000${video.videoUrl}`}
                  controls
                  className="w-full max-w-md mt-2"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No videos uploaded yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Documents:</h2>
        {course.documents.length > 0 ? (
          <ul>
            {course.documents.map((doc, index) => (
              <li key={index} className="mb-2">
                <a
                  href={`http://localhost:5000${doc.documentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseDetails;
