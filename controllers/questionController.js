const Question = require('../models/questionModel');
const Quiz = require('../models/quizModel');

exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question({
      quizId: req.body.quizId,
      text: req.body.text,
      options: req.body.options,
      correctAnswer: req.body.correctAnswer
    });
    const savedQuestion = await newQuestion.save();

    // Cập nhật quiz với id của câu hỏi mới
    await Quiz.findByIdAndUpdate(req.body.quizId, { $push: { questions: savedQuestion._id } });

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });

    // Xóa id của câu hỏi khỏi quiz
    await Quiz.findByIdAndUpdate(deletedQuestion.quizId, { $pull: { questions: deletedQuestion._id } });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};