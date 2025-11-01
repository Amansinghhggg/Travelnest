const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const Listing = require('../MODELS/listing');
const { listingSchema} = require('../validationschema');
const ExpressError = require('../utils/ExpressError');


//validateListing 
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};
// Routes For Listings
// Index
router.get('/', wrapAsync(async (req, res, next) => {
    const listings = await Listing.find({});
    res.render('index', { listings });
  }));

// New listing Form

router.get('/new', wrapAsync(async (req, res) => {
  res.render('newlisting');
}));

// Create listing
router.post('/', validateListing, wrapAsync(async (req, res,next) => {
  const listing = new Listing(req.body);
  await listing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect(`/listings`); // or res.redirect('/listings');
}));

// Edit listing Form
router.get('/:id/edit', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    }
  res.render('editlisting', { listing });
}));
// Show one listing
router.get('/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    }
    res.render('showlisting', { listing });
}));
// Update listing
router.put('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
     if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    };
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${listing._id}`);
  }));
// Deletelisting
router.delete('/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
  }));

  module.exports = router;