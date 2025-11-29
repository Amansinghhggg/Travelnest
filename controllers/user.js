const User = require('../MODELS/user');

// Render Signup Form
module.exports.renderSignupForm = async (req, res) => {
  res.render('users/signup.ejs');
};

//Render Login Form
module.exports.renderLoginForm =async (req, res) => {
  res.render('users/login.ejs');
};

//create User///signup Logic
module.exports.createUser = async (req, res, next) => {
try {
  let {username,email,contactNumber,password} = req.body;
  console.log('Creating user:', {username, email, contactNumber});
  const user = new User({username,email,contactNumber});
  const registeredUser = await User.register(user,password);
  console.log('User registered successfully:', registeredUser.username);
  req.login(registeredUser, (err) => {
    if (err) {
      console.error('Login error after registration:', err);
      return next(err);
    }
    console.log('User logged in successfully');
    req.flash('success', 'Account created successfully! Welcome to TravelNest!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
  });
} catch(e) {
  console.error('Signup error:', e.message);
  req.flash('error', e.message);
  res.redirect('/signup');
}
}

//login Logic
module.exports.loginUser = async (req, res) => {
  req.flash('success', `Welcome back ${req.user.username}! to TravelNest!`);
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
}

//logout Logic
module.exports.logoutUser = (req,res,next)=>{
 req.logOut((err)=>{
  if(err){
    return next(err)
  }
  req.flash("success","You Are Logged Out!")
  res.redirect('/listings');
 })
}

//render Profile
module.exports.renderProfile = async (req, res) => {
  const Listing = require('../MODELS/listing');
  const Review = require('../MODELS/review');
  
  const userListings = await Listing.find({ owner: req.user._id });
  const userReviews = await Review.find({ author: req.user._id });

  // Populate saved listings and bookings
  const user = await User.findById(req.user._id).populate('savedListings').populate({
    path: 'bookings',
    populate: {
      path: 'listing',
      model: 'Listing'
    }
  });
  const savedListings = user.savedListings || [];
  const bookings = user.bookings || [];
  
  console.log('User bookings count:', bookings.length);
  
  res.render('users/profile.ejs', { userListings, userReviews, savedListings, bookings });
}

