var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var Twitter = require('twitter');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').config();


//mongodb connection
mongoose.connect("mongodb://localhost:27017/sentball", {useNewUrlParser: true});

//twitter
var client = new Twitter({
  consumer_key: 'YszIiRTfxjBnM6nV2xwgd1V9Y',
  consumer_secret: 'hmjbIyxdsVsZp6fWqDZWw5iYIlZzOlnBVkjMTwbswqD8js0rRw',
  access_token_key: '3396999435-AAqmnvjrtHYpd7LnhlCknYgM9zdipKJ5VOOKbBO',
  access_token_secret: 'qbAblN3g0jxiF0orJQWHouPsBPMMz5yYr9a9JwglXT7ZO'
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//bodyparser
app.use(bodyParser.urlencoded({extended: true}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
