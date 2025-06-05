import React from 'react';

const QuizForm = ({ quiz, onQuizChange }) => {
  const handleQuestionChange = (index, value) => {
    const updated = [...quiz];
    updated[index] = {
      ...updated[index],
      question: value,
    };
    onQuizChange(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quiz];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = value;
    updated[qIndex] = {
      ...updated[qIndex],
      options: newOptions,
    };
    onQuizChange(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...quiz];
    updated[qIndex] = {
      ...updated[qIndex],
      correctAnswer: parseInt(value, 10),
    };
    onQuizChange(updated);
  };

  return (
    <div className="mb-10 p-6 rounded-xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 shadow-xl">
      <h4 className="text-2xl font-bold text-purple-800 mb-6 text-center drop-shadow-md">
        ✨ Create Your Quiz (5 Questions) ✨
      </h4>
      {quiz.map((q, i) => (
        <div
          key={i}
          className="mb-8 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-purple-100"
        >
          <label className="block text-lg font-semibold text-purple-700 mb-2">
            Q{i + 1}: Question
          </label>
          <input
            type="text"
            value={q.question}
            onChange={(e) => handleQuestionChange(i, e.target.value)}
            className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
            placeholder={`Enter question ${i + 1}`}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {q.options.map((opt, idx) => (
              <div key={idx}>
                <label className="block font-medium text-purple-600 mb-1">
                  Option {idx + 1}
                </label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, idx, e.target.value)}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none transition-all"
                  placeholder={`Option ${idx + 1}`}
                  required
                />
              </div>
            ))}
          </div>

          <label className="block font-semibold text-purple-700 mb-1">
            Correct Answer
          </label>
          <select
            value={q.correctAnswer}
            onChange={(e) => handleCorrectAnswerChange(i, e.target.value)}
            className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
            required
          >
            {q.options.map((_, idx) => (
              <option key={idx} value={idx}>
                Option {idx + 1}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default QuizForm;
