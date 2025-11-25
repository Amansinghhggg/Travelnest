const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const {isloggedIn,isOwner,validateListing} = require('../authenticatefuncN')
const listingController = require('../controllers/listing');
const multer = require('multer');
  const {storage} = require('../cloudConfig');

const upload = multer({storage});
// Routes For Listings
// All Listings And Create Listing
router.route('/')
.get(wrapAsync(listingController.index))
.post(isloggedIn,upload.single('Listing[image]'), validateListing,wrapAsync(listingController.createListing));

// New listing
router.get('/new',isloggedIn, wrapAsync(listingController.renderNewForm));

// Search listing - MUST be before /:id routes
router.get('/search', wrapAsync(listingController.searchlisting));

// Filter routes
router.get('/filter/trending', wrapAsync(listingController.filterTrending));
router.get('/filter/bestrated', wrapAsync(listingController.filterBestRated));
router.get('/filter/price-low-high', wrapAsync(listingController.filterPriceLowToHigh));
router.get('/filter/latest', wrapAsync(listingController.filterLatest));

// Edit listing 
router.get('/:id/edit',isloggedIn,isOwner, wrapAsync(listingController.renderEditForm));
// Show, Update, Delete listing
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isloggedIn,upload.single('Listing[image]') ,validateListing, wrapAsync(listingController.updateListing))
.delete(isloggedIn,isOwner,wrapAsync(listingController.deleteListing));

// Save listing to wishlist
router.post('/:id/save', isloggedIn, wrapAsync(listingController.saveListing));

// Unsave listing from wishlist
router.delete('/:id/unsave', isloggedIn, wrapAsync(listingController.unsaveListing));

module.exports = router;
