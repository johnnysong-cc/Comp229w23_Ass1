/* app.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023 - Ass.1
 * February 27, 2023 - Ass.2
=================================================== */

// #region Dependencies
require("dotenv").config();
const express = require('express'), session=require('express-session'), sessionConf = { secret: process.env.SECRET, resave: false, saveUninitialized: false };
const path = require('path');
const createError = require('http-errors'), logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
// const cookieParser = require('cookie-parser'); // no longer needed since express-session v1.5
// const cors = require("cors");
// const corsOptions = {
//   // origin: "http://127.0.0.1",
//   origin: "*",
//   methods: ["GET","POST"],
//   credentials:true
// };
// #endregion Dependencies

// #region  view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// #endregion  view engine setup

// # region http pipeline
// app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConf));
const passport = require('passport'), passportLocalMongoose = require("passport-local-mongoose");
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.session());  // express.session() is no longer part of the Express.js core package since version 4.x
// app.use(cookieParser());

//router
app.use('/', indexRouter);
// # endregion http pipeline


// #region error handler

// catch 404 and forward to error handler
app.use((req, res, next)=>next(createError(404)));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// #endregion

// #endregion ALL

module.exports = app;