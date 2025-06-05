import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
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

  if (!course) return <div className="p-4">Loading course...</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course: {course.title}</h1>
        <button
          onClick={() => navigate(`/teacher-dashboard/course/edit/${courseId}`)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit Course
        </button>
      </div>

      {course.modules.length === 0 ? (
        <p>No modules added yet.</p>
      ) : (
        course.modules.map((module, idx) => (
          <div key={idx} className="border rounded-md p-4 mb-6 bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">Module {idx + 1}: {module.moduleTitle}</h2>

            {/* Videos */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Videos:</h3>
              {module.videos.length > 0 ? (
                <ul>
                  {module.videos.map((video) => (
                    <li key={video._id} className="mb-3">
                      <p className="font-medium">{video.title}</p>
                      <video
                        src={`http://localhost:5000${video.videoUrl}`}
                        controls
                        className="w-full max-w-md mt-1"
                      />
                      {video.assignment?.fileUrl && (
                        <div className="mt-1">
                          <strong>Assignment: </strong>
                          <a
                            href={`http://localhost:5000${video.assignment.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            {video.assignment.name}
                          </a>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No videos uploaded.</p>
              )}
            </div>

            {/* Documents */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Documents:</h3>
              {module.documents.length > 0 ? (
                <ul className="list-disc list-inside">
                  {module.documents.map((doc, i) => (
                    <li key={i}>
                      <a
                        href={`http://localhost:5000${doc.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No documents uploaded.</p>
              )}
            </div>

            {/* Quiz */}
            <div>
              <h3 className="font-semibold mb-1">Quiz:</h3>
              {module.quiz.length > 0 ? (
                <ul className="list-decimal list-inside">
                  {module.quiz.map((q, i) => (
                    <li key={i} className="mb-2">
                      <p><strong>Q{i + 1}:</strong> {q.question}</p>
                      <ul className="ml-4 list-disc">
                        {q.options.map((opt, j) => (
                          <li key={j}>
                            {opt} {q.correctAnswer === opt && <span className="text-green-600 font-semibold">(Correct)</span>}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No quiz questions added.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherCourseDetails;
