const Review = require('../MODELS/review');
const Listing = require('../MODELS/listing');

//Helper function to calculate and update average rating
async function updateAverageRating(listingId) {
  const listing = await Listing.findById(listingId).populate('reviews');
  if (!listing) return;
  
  if (listing.reviews.length === 0) {
    listing.averageRating = 0;
  } else {
    const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    listing.averageRating = (totalRating / listing.reviews.length).toFixed(1);
  }
  
  await listing.save();
}

//create review
module.exports.createReview = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  let newReview= new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  await updateAverageRating(listing._id);
  req.flash('success', 'Successfully Posted a Review!');
  res.redirect(`/listings/${listing._id}`);
};
//delete review
module.exports.deleteReview = async (req, res, next) => {
  const listingId = req.params.id;
  const { reviewId } = req.params;
  console.log(`listingid = ${listingId}, reviewid = ${reviewId}`);
  const listing = await Listing.findByIdAndUpdate(listingId,{$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  // Update average rating after deleting review
  await updateAverageRating(listingId);
  req.flash('success', 'Successfully Deleted a Review!');
  res.redirect(`/listings/${listingId}`);
}