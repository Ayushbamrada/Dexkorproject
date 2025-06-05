export const evaluateQuiz = (questions, userAnswers) => {
  let correct = 0;

  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswerIndex) {
      correct++;
    }
  });

  return correct;
};
