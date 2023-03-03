/** authRoute.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * March 1, 2023
 * ============================== */

//#region dependencies
const authCtrl = require('../controllers/authController');
const router = require("express").Router();
//#endregion dependencies

//#region routes
router.route('/register')
      .get(authCtrl.regPresenter)
      .post(authCtrl.regHandler);
      
router.route('/login')
      .get(authCtrl.loginPresenter)
      .post(authCtrl.loginHandler);
//#endregion routes

module.exports = router;