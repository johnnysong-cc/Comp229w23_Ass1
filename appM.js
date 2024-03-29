/* app.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023 - Ass.1
 * February 27, 2023 - Ass.2
=================================================== */

// #region Dependencies
require("dotenv").config();
const express = require('express'), session = require('express-session'), mongoSessionStore = require('connect-mongo');
const sessionConf = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoSessionStore.create({
    mongoUrl: process.env.CONNSTRING,
    ttl: 2 * 24 * 60 * 60 // default ttl is 1 day
  })
};
const passport = require('passport'), passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require('mongoose'), findOrCreate = require("mongoose-findorcreate");
const path = require('path'), flash = require("connect-flash");
const createError = require('http-errors'), logger = require('morgan');
const indexRouter = require('./routes/indexRoute');
// const authCtrl = require('./controllers/authController');
const app = express();
// #endregion Dependencies

// #region View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// #endregion View Engine Setup

// #region HTTP Pipeline

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// session management
app.use(session(sessionConf));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// #region Database Configuration and User Modeling

// connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNSTRING,
  { useNewUrlParser: true, useUnifiedtopology: true },
  (err) => {
    if (err) console.error("Error connecting to MongoDB:", err);
    else console.log('Connected to MongoDB.');
  });
mongoose.connection.on('error', console.error.bind(console, 'connection Error:'));

// user modeling and injection of passport-local strategy
// const userSchemaDesc = { useremail: String, password: String };
const userSchemaDesc = { googleId: String, facebookId: String };
const userSchema = new mongoose.Schema(userSchemaDesc);
// schema injection
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

// passport local strategy using mongoDB
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(function (user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

// contact modeling
const contactSchemaDesc = { name: { type: String, required: true }, phone: String, email: String }
const contactSchema = new mongoose.Schema(contactSchemaDesc);
contactSchema.plugin(findOrCreate);
const Contact = mongoose.model("Contact", contactSchema);

// #endregion Database Configuration and User Modeling



// #region router
app.use('/', indexRouter);

app.route('/register')
  .get((req, res, next) => {
    console.log(req.session);
    res.render('auth/register', { message: "" });
  })
  .post(function (req, res) {
    User.register({ username: req.body.useremail }, req.body.password, function (err, user) {
      console.log(`the newly registered user is ${user}.`);
      if (err) {
        if (err.name == "UserExistsError") {
          req.flash('regErrMsg', 'Registration Error: User Already Exists!');
          console.error(err.name);
          console.error(err.message);
          console.error(err.username);
        }
        res.render("auth/register", {
          message: req.flash('regErrMsg')
        })
      } else {
        console.log(user.username);
        console.log(user.hash);
        // res.render("auth/login",{message:"User registered successfully. Please log in."});
        // passport.authenticate("local")(req,res,function(){
        //   // res.redirect("contactlist");
        //   // res.render("contactlist");
        //   req.login(user,(err)=>{
        //     if(err) console.error(err);
        //     else res.render("contactlist");
        //   });
        // });
        passport.authenticate("local", {
          successRedirect: "/contactlist",
          failureRedirect: "/contactlist",
          failureFlash: true
        }, err => {
          if (err) console.log(err);
          else res.redirect("contactlist");
        })(req, res, (err) => {
          if (err) console.log(err);
          else {
            req.login(user, (err) => {
              if (err) console.error(err);
              else res.redirect("/contactlist");
            });
          }
        });
      }
    });
  })
// app.post('/register', (req, res, next) => {
//   User.register({ username: req.body.useremail }, req.body.password, (err, user) => {
//     console.log(`the new user is ${user}.`);
//     if (err) {
//       console.error(err);
//       //  res.render("auth/register", { error: err.message });
//       res.redirect("/auth/register");
//       return;
//     } else {
//       req.login(user, (err) => {
//         if (err) console.error(err);
//         passport.authenticate("local", {
//           successRedirect: "/contactlist",
//           failureRedirect: "/",
//           failureFlash: true
//         })(req, res, function () {
//           res.redirect("/contactlist")
//         })
//       });

//       // passport.authenticate("local", {
//       //   successRedirect: "contactlist",
//       //   failureRedirect: "register",
//       //   failureFlash: true
//       // })(req, res, ()=>res.redirect("/contactlist"));
//       // passport.authenticate('local')(req, res, () => {
//       //   res.redirect("contactlist");
//       // });

//       //  req.login(user, err => {
//       //    if (err) {
//       //      console.error(`An error occurred: ${err}`);
//       //      return next(err);
//       //    } else {
//       //      return passport.authenticate("local", {
//       //        successRedirect: "contactlist",
//       //        failureRedirect: "register",
//       //        failureFlash: true
//       //      })(req, res, next);
//       //    }
//       //  });
//     }
//   });
//   console.log(req.session);
// });

app.route('/login')
  .get((req, res, next) => {
    console.log(req.session);
    res.render('auth/login', { message: "" });
  })
  .post((req, res, next) => {
    const user = new User({ username: req.body.useremail, password: req.body.password });
    req.login(user, (err) => {
      if (err) console.error(`An error occurred: ${err}`);
      // passport.authenticate("local")(req,res,(err)=>{
      //   if(err){
      //     console.error(err)
      //     res.redirect("auth/login");
      //   }else{
      //     res.redirect("contactlist");
      //   }
      // });
      passport.authenticate("local", {
        successRedirect: "/contactlist",
        // failureRedirect: "auth/login", // route! NOT view path!
        failureRedirect: "/login",
        failureFlash: true,
        failureMessage: err.error
      })(req, res, () => res.redirect("/contactlist"));
      console.log(req.session);
    });
  });

app.route("/contactlist")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      console.log(req.isAuthenticated());
      Contact.find((err, contactlist) => {
        if (err) console.log(err);
        else {
          //#region debug
          //console.log("Try to access the first line of data");
          //console.log(`${contactlist[0].name}\n${contactlist[0].phone}\n${contactlist[0].email}`);
          //#endregion
        }
        res.render("contactlist", { data: contactlist, editLoad: {} });
      });
    } else {
      res.render('auth/login', { message: "" });
    }
  });

app.get("/contactlist/delete/:id", (req, res, next) => {
  // console.log(req.params.id);
  Contact.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      res.redirect("/contactlist");
    }
  });
});

app.route("/contactlist/edit/:id")
  .get(async (req, res, next) => {
    let contacts; let editItem;
    try {
      contacts = await Contact.find();
    } catch (err) {
      console.error(err.name);
    }
    try {
      editItem = await Contact.findById(req.params.id);
    } catch (err) {
      console.error(err.name);
    }
    //#region debug
    // console.log(contactlist);
    // console.log(editItem);
    //#endregion
    res.render("contactlist", { data: contacts, editLoad: editItem })
  });

app.post("/contactlist/update", (req, res, next) => {
  //#region debug
  console.log(`user clicked Update.`);
  console.log(req.body.nameinput);
  console.log(req.body.phoneinput);
  console.log(req.body.emailinput);
  console.log(req.body.button);
  //#endregion

  if (req.body.button) {
    console.log("updating...")
    Contact.findOrCreate(
      { _id: mongoose.Types.ObjectId(req.body.button) },
      {
        "name": req.body.nameinput,
        "phone": req.body.phoneinput,
        "email": req.body.emailinput
      }, { upsert: true }, (err, result) => {
        if (err) console.error(err);
        else console.log(result);
      })
  } else {
    console.log("find or create...")
    Contact.findOrCreate(
      { _id: mongoose.Types.ObjectId() },
      {
        "name": req.body.nameinput,
        "phone": req.body.phoneinput,
        "email": req.body.emailinput
      }, { upsert: true }, (err, result) => {
        if (err) console.error(err);
        else console.log(result);
      })
  }
  res.redirect("/contactlist")
});

app.route("/logout")
  .post((req, res) => {
    req.logout((err) => {
      if (err) console.error(err);
      res.redirect("/");
    });
  })

// #endregion router

// #endregion http pipeline

// #region Error Handler

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// #endregion

// EOF

module.exports = app;