var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var specializationRouter = require('./routes/specialization');
var doctorRouter = require('./routes/doctor');
var adminRouter = require('./routes/admin');
var timetableRouter = require('./routes/timetable');
var customerRouter = require('./routes/customer');
var statecityRouter = require('./routes/statecity');
var questionRouter = require('./routes/question');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/specialization', specializationRouter);
app.use('/doctor', doctorRouter);
app.use('/admin', adminRouter);
app.use('/timetable', timetableRouter);
app.use('/customer', customerRouter);
app.use('/statecity', statecityRouter);
app.use('/question', questionRouter);


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
