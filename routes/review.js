const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapasync');
const Review = require('../MODELS/review');
const {reviewSchema} = require('../validationschema');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../MODELS/listing');
//validate review
const validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};
//routes
//post review
router.post('/', validatereview, wrapAsync(async (req, res, next) => {
  const listingId = req.params.id  
  console.log('listingId from params:', listingId);
  console.log('All params:', req.params);
  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).send('Listing not found');
  console.log(req.body);
  const review = new Review(req.body);
  listing.reviews.push(review);
   let r1 = await review.save();
  let r2 = await listing.save();
  // console.log(`yeh r1 hai = ${r1}, r2 = ${r2}`);
  req.flash('success', 'Successfully Posted a Review!');
  res.redirect(`/listings/${listingId}`);
}));

//delete listing
router.delete('/:reviewId', wrapAsync(async (req, res, next) => {
  const listingId = req.params.id;
  const { reviewId } = req.params;
  console.log(`listingid = ${listingId}, reviewid = ${reviewId}`);
  const listing = await Listing.findByIdAndUpdate(listingId,{$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully Deleted a Review!');
  res.redirect(`/listings/${listingId}`);
}));

module.exports = router;