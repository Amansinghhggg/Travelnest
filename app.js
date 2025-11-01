const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');

const session = require('express-session');
const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000 ,
    httpOnly: true
  }
};
// Home
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Session and Flash Middleware
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
//review and listing routes
const review = require("./routes/review.js")
const listing = require('./routes/listing.js')
// View engine + ejs-mate
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'VIEWS'));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// DB
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(()=> console.log('Mongo Connected'))
  .catch(err => console.error(err));

app.use("/listings",listing) ;
app.use("/listings/:id/reviews",review)


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
  if (err.statusCode !== 404) {
    console.error(err);
  }
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.render('error', { statusCode, message });
});
app.listen(3000, () => {
  console.log('server is running on: http://localhost:3000');
});