const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const ResHand = require('../helper/ResHandle');
const authController = require('../controllers/authController');
const checkAuth = require('../validators/authValidator');
const protect = require('../middlewares/protect');

router.get('/me', protect, authController.getMe);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', authController.login);

router.get('/logout', (req, res) => {
  //res.render('logout');
});

router.post('/logout', authController.logout);

router.get('/profile', protect, authController.getProfile);

router.post('/profile', protect, authController.updateProfile);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', checkAuth(), async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  authController.register(req, res);
});

router.get('/ResetPassword/:token', (req, res) => {
  res.render('ResetPassword', { token: req.params.token });
});

router.post('/ResetPassword/:token', authController.resetPassword);

router.get('/ForgotPassword', (req, res) => {
  res.render('ForgotPassword');
});

router.post('/ForgotPassword', authController.forgotPassword);

router.get('/ChangePassword', (req, res) => {
  res.render('ChangePassword');
});

router.post('/changepassword', protect, authController.changePassword);

module.exports = router;