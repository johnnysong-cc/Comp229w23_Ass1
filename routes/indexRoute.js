/** indexRoute.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * March 1, 2023
 * ============================== */

//#region dependencies
const router = require('express').Router();
const myTitle = "Johnny Z. Song\'s Portfolio Website";
const authController = require('../controllers/authController');
//#endregion dependencies

//#region routes
/* GET root */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: myTitle,
    username: req.body.name,
    useremail: req.body.email,
    usermessage: req.body.message,
    scrollTo: ""
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

/* GET+POST contacts */
router.route('/contact')
  .get((req, res, next)=>{
    res.redirect('/#contact');
  })
  .post((req, res, next)=>{
    console.log(`user name is received as: ${name}\nuser email is received as: ${email}\nuser message is received as: ${message}`);
    res.render('index', {
      title: myTitle,
      username: req.body.name,
      useremail: req.body.email,
      usermessage: req.body.message,
      scrollTo: 'contact'
    });
  });
//#endregion routes

module.exports = router;