if(process.env.NODE_ENV!=='production'){
require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./MODELS/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const MONGOATLAS_URI= process.env.MONGOATLAS_URI; 

// View engine + ejs-mate
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'VIEWS'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// DB Connection -
mongoose.connect(MONGOATLAS_URI)
  .then(()=> console.log('✅ MongoDB Atlas Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Session configuration with MongoDB store
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGOATLAS_URI,
    touchAfter: 24 * 3600 // lazy session update (24 hours)
  }),
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

// Session and Flash Middleware
app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware for flash messages and current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Home route
app.get('/', (req, res) => {
  res.redirect('/listings');
});

// Routes
const reviewroute = require("./routes/reviewroute.js");
const listingroute = require('./routes/listingroute.js');
const userroute = require('./routes/userroute.js');

app.use("/listings", listingroute);
app.use("/listings/:id/reviews",reviewroute)
app.use("/", userroute);

 
// Favicon route (prevents 404 errors)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// 404 handler - must be last route
app.use((req, res, next) => {
  console.warn('404 request for:', req.originalUrl);
  next(new ExpressError('Page Not Found', 404));
});

// Basic error handler
app.use((err, req, res, next) => {
  // Only log non-404 errors to reduce noise
  if (err.statusCode!==404) {
    console.error(err);
  }
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.render('error', { statusCode, message });
});
app.listen(3000, () => {
  console.log('server is running on: http://localhost:3000');
});