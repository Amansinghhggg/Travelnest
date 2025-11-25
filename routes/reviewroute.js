const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapasync');
const {isloggedIn,validatereview,isAuthor} = require('../authenticatefuncN');
const reviewController = require('../controllers/review');

//routes
//post review
router.post('/', isloggedIn, validatereview, wrapAsync(reviewController.createReview));
//delete listing
router.delete('/:reviewId', isloggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;