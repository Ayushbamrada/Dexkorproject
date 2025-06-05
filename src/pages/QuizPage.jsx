import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const QuizPage = () => {
  const navigate = useNavigate(); // ✅ moved inside
  const { courseId, moduleId } = useParams(); // ✅ moved inside
  const token = localStorage.getItem('token');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const module = res.data.modules.find((mod) => mod._id === moduleId);
        if (module && module.quiz && module.quiz.questions) {
          setQuestions(module.quiz.questions);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      }
    };

    fetchCourse();
  }, [courseId, moduleId, token]);

  const handleAnswer = (index) => {
    setUserAnswers({ ...userAnswers, [currentIndex]: index });
  };

  const handleNext = () => {
    if (userAnswers[currentIndex] === undefined) {
      alert('Please select an answer first!');
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let correct = 0;

    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);
  };

  if (questions.length === 0) {
    return <div className="p-6 text-center text-xl">📦 No quiz available for this module.</div>;
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">🧠 Module Quiz</h1>

      {!submitted ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <p className="text-gray-800 mb-4">{currentQ.questionText}</p>

          <ul className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <li key={idx}>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    value={idx}
                    checked={userAnswers[currentIndex] === idx}
                    onChange={() => handleAnswer(idx)}
                  />
                  <span>{opt}</span>
                </label>
              </li>
            ))}
          </ul>

          <button
            onClick={handleNext}
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold text-green-700 mb-4">🎉 Quiz Completed!</h2>
          <p className="text-lg mb-6">
            You got <strong>{score}</strong> out of <strong>{questions.length}</strong> correct.
          </p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Go to Course Details
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
