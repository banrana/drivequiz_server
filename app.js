var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');

// Import routes
var usersRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var quizRouter = require('./routes/quiz');
var questionRouter = require('./routes/question');
var resultRouter = require('./routes/result');

// Import models
require('./models/userModel');
require('./models/quizModel');
require('./models/questionModel');
require('./models/resultModel');

var app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/quizApp')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: 'http://localhost:5000', credentials: true }));

// Use routes
app.use('/user', usersRouter);
app.use('/auth', authRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/questions', questionRouter);
app.use('/api/results', resultRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;