var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require ('fs');
var env = process.env.NODE_ENV || 'development';

var index = require('./routes/index');
var moderate = require('./routes/moderate');
//var data = require('./routes/data');
//var data = require('./routes/users');

var app = express();
//var allowCrossDomain = function(req, res, next) {
//
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//  res.header('Access-Control-Allow-Credentials', false);
//  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//
//  // intercept OPTIONS method
//  if ('OPTIONS' == req.method) {
//    res.send(200);
//    res.end();
//  }
//  else {
//    next();
//  }
//};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// uncomment after placing your favicon in /public
app.use(cors());
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', cors(), index);
app.use('/moderate', cors(), moderate);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


module.exports = app;
