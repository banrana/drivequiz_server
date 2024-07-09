const Result = require('../models/resultModel');
const Quiz = require('../models/quizModel');

exports.submitQuizResult = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId).populate('questions');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz không tồn tại' });
    }

    let score = 0;
    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;
      return {
        question: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    const result = new Result({
      user: req.user._id,
      quiz: quizId,
      score,
      answers: processedAnswers,
      totalQuestions: quiz.questions.length
    });

    await result.save();

    res.status(201).json({
      message: 'Kết quả đã được lưu',
      score,
      totalQuestions: quiz.questions.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQuizResults = async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('user', 'username')
      .select('-answers');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title')
      .select('-answers');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDetailedResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate('quiz', 'title')
      .populate('answers.question', 'text options');
    
    if (!result) {
      return res.status(404).json({ message: 'Kết quả không tồn tại' });
    }

    if (result.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Không có quyền truy cập kết quả này' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};