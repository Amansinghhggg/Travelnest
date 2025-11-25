const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const {saveRedirectUrl, isloggedIn} = require('../authenticatefuncN')
const userController = require('../controllers/user');

// Signup routes
router.route('/signup')
  .get(wrapAsync(userController.renderSignupForm))
  .post(saveRedirectUrl, wrapAsync(userController.createUser));

// Login routes
router.route('/login')
  .get(wrapAsync(userController.renderLoginForm))
  .post(
    saveRedirectUrl,
    passport.authenticate('local', { 
      failureRedirect: '/login',
      failureFlash: true 
    }),
    wrapAsync(userController.loginUser)
  );

// Logout route
router.get("/logout", userController.logoutUser);

// Profile route
router.get("/profile", isloggedIn, wrapAsync(userController.renderProfile));

module.exports = router;