const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const protect = require('../middlewares/protect');
const checkRole = require('../middlewares/checkrole');

router.post('/', protect, checkRole("ADMIN"), questionController.createQuestion);
router.get('/quiz/:quizId', questionController.getQuestions);
router.put('/:id', protect, checkRole("ADMIN"), questionController.updateQuestion);
router.delete('/:id', protect, checkRole("ADMIN"), questionController.deleteQuestion);

module.exports = router;