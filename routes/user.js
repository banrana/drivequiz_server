const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkUser = require('../validators/userValidator');
const protect = require('../middlewares/protect');
const checkRole = require('../middlewares/checkrole');

router.get('/', protect, checkRole("ADMIN"), userController.getAllUsers);

router.get('/:id', protect, checkRole("ADMIN"), userController.getUserById);

router.post('/', checkUser(), userController.createUser);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
