/* index.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * Feburary 21, 2023
=================================================== */
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const myTitle = "Johnny Z. Song\'s Portfolio Website";
let name = "", email="", message="";

// #region Index sections
/* GET root */
router.get('/', function (req, res, next) {
    res.render('index', {
      title: myTitle,
      username: name,
      useremail: email,
      usermessage: message
    });
});

/* GET home page. */
router.get('/home', function (req, res, next) {
  res.redirect('/#home');
});

/* GET about */
router.get('/about', function (req, res, next) {
  res.redirect('/#about');
});

/* GET projects */
router.get('/projects', function (req, res, next) {
  res.redirect('/#projects');
});

/* GET services */
router.get('/services', function (req, res, next) {
  res.redirect('/#services');
});

/* GET contacts */
router.get('/contact', function (req, res, next) {
  res.redirect('/#contact');
});


/* POST contacts */
router.post('/contact', function (req, res, next) {
  name = req.body.name;
  email = req.body.email;
  message = req.body.message;
  console.log(`user name is received as: ${name}\nuser email is received as: ${email}\nuser message is received as: ${message}`);
  res.redirect('/#contact');
});
// #endregion

/* Contact List*/
router.route("/contactlist")
      .get((req,res)=>{
        if(req.isAuthenticated) res.render("/contactlist");
        res.render('../views/auth/login');
      });

// #region Authentication
router.route('/register')
      .get(authCtrl.displayRegistration)
      .post(authCtrl.handleRegistration);

router.route('/login')
      .get(authCtrl.displayLogin)
      .post(authCtrl.handleLogin);
// #endregion
module.exports = router;