const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const protect = require('../middlewares/protect');
const checkRole = require('../middlewares/checkrole');

router.post('/submit', protect, resultController.submitQuizResult);
router.get('/quiz/:quizId', protect, checkRole('ADMIN'), resultController.getQuizResults);
router.get('/user', protect, resultController.getUserResults);
router.get('/:resultId', protect, resultController.getDetailedResult);

module.exports = router;