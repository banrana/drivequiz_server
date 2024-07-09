const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const protect = require('../middlewares/protect');
const checkRole = require('../middlewares/checkrole');

router.post('/', protect, checkRole("ADMIN"), quizController.createQuiz);
router.get('/', quizController.getQuizzes);
router.get('/:id', quizController.getQuiz);
router.put('/:id', protect, checkRole("ADMIN"), quizController.updateQuiz);
router.delete('/:id', protect, checkRole("ADMIN"), quizController.deleteQuiz);

module.exports = router;