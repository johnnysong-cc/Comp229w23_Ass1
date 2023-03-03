/** contactRoute.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * March 1, 2023
 * ============================== */

//#region dependencies
const contactCtrl = require('../controllers/contactController');
const authCtrl = require('../controllers/authController');
const router = require("express").Router();
//#endregion dependencies

//#region routes
router.route("/")
      .get(authCtrl.isAuth, contactCtrl.contactListing);

router.route("/edit/:id")
      .get(contactCtrl.contactEdit);

router.route("/delete/:id")
      .get(contactCtrl.contactDelete);

router.route("/update")
      .post(contactCtrl.contactUpdate);

router.route("/logout")
      .post((req, res) => {
         req.logout((err) => {
           if (err) console.error(err);
           res.redirect("/");
         });
      })
//#endregion routes

module.exports = router;