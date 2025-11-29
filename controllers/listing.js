const Listing = require('../MODELS/listing');




// Index
module.exports.index = async (req, res, next) => {
    const listings = await Listing.find({}).populate('reviews');
    let savedListingIds = [];
    if (req.user) {
      const User = require('../MODELS/user');
      const user = await User.findById(req.user._id);
      savedListingIds = user.savedListings.map(id => id.toString());
    }
    res.render('index', { listings, savedListingIds });
  }

// New listing Form
module.exports.renderNewForm = async (req, res) => {
res.render('newlisting');
}
// Create listing
module.exports.createListing = async (req, res,next) => {
  const listing = new Listing(req.body);
  listing.owner = req.user._id;
  listing.image.url = req.file.path;
listing.image.filename = req.file.filename;
  await listing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect(`/listings`); // or res.redirect('/listings');
}
// Edit listing Form
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    }
    const previewImageUrl = listing.image.url;
    previewImageUrl.replace("/upload", '/upload/h_300,w_300/');

  res.render('editlisting', { listing, previewImageUrl });
}
// Show one listing
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews', populate:{path: 'author'}}).populate("owner");
    if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    }
    // console.log(listing);
    res.render('showlisting', { listing });
}
// Update listing
module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    
    // Remove image field from req.body to prevent overwriting
    delete req.body.Listing?.image;
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });
    
    if (!listing) {
        req.flash('error', 'Listing Does Not Exist!');
        return res.redirect('/listings');
    }
    
    // Only update image if a new file was uploaded
    if (typeof req.file !== "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }
    
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${listing._id}`);
}
// Delete listing
  module.exports.deleteListing = async (req, res, next) => {
   const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
  }
// search listing
  module.exports.searchlisting = async (req, res, next) => {
    const searchQuery = req.query.q;
    console.log('Search query:', searchQuery);
    
    if (!searchQuery) {
      req.flash('error', 'Please enter a search term!');
      return res.redirect('/listings');
    }
    
    // Check if search query is a number (price search)
    const searchAsNumber = parseFloat(searchQuery);
    const isNumber = !isNaN(searchAsNumber);
    
    let searchConditions = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { location: { $regex: searchQuery, $options: 'i' } },
      { country: { $regex: searchQuery, $options: 'i' } }
    ];
    
    // If it's a number, search for listings with price less than or equal to the input
    if (isNumber) {
      searchConditions.push({ price: { $lte: searchAsNumber } });
    }
    
    const listings = await Listing.find({
      $or: searchConditions
    }).populate('reviews');
    
    let savedListingIds = [];
    if (req.user) {
      const User = require('../MODELS/user');
      const user = await User.findById(req.user._id);
      savedListingIds = user.savedListings.map(id => id.toString());
    }
    
    console.log('Found listings:', listings.length);
    res.render('index', { listings, savedListingIds });
  }

// Filter: Trending (most reviewed)
module.exports.filterTrending = async (req, res, next) => {
  const listings = await Listing.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: 'reviews',
        foreignField: '_id',
        as: 'reviewsList'
      }
    },
    {
      $addFields: {
        reviewCount: { $size: '$reviewsList' }
      }
    },
    {
      $sort: { reviewCount: -1 }
    }
  ]);
  
  await Listing.populate(listings, { path: 'reviews' });
  
  let savedListingIds = [];
  if (req.user) {
    const User = require('../MODELS/user');
    const user = await User.findById(req.user._id);
    savedListingIds = user.savedListings.map(id => id.toString());
  }
  
  res.render('index', { listings, savedListingIds });
}

// Filter: Best Rated
module.exports.filterBestRated = async (req, res, next) => {
  const listings = await Listing.find({}).populate('reviews');
  
  // Sort by average rating (highest first)
  listings.sort((a, b) => {
    const avgA = a.averageRating || 0;
    const avgB = b.averageRating || 0;
    return avgB - avgA;
  });
  
  let savedListingIds = [];
  if (req.user) {
    const User = require('../MODELS/user');
    const user = await User.findById(req.user._id);
    savedListingIds = user.savedListings.map(id => id.toString());
  }
  
  res.render('index', { listings, savedListingIds });
}

// Filter: Price Low to High
module.exports.filterPriceLowToHigh = async (req, res, next) => {
  const listings = await Listing.find({}).populate('reviews').sort({ price: 1 });
  
  let savedListingIds = [];
  if (req.user) {
    const User = require('../MODELS/user');
    const user = await User.findById(req.user._id);
    savedListingIds = user.savedListings.map(id => id.toString());
  }
  
  res.render('index', { listings, savedListingIds });
}

// Filter: Latest
module.exports.filterLatest = async (req, res, next) => {
  const listings = await Listing.find({}).populate('reviews').sort({ createdAt: -1 });
  
  let savedListingIds = [];
  if (req.user) {
    const User = require('../MODELS/user');
    const user = await User.findById(req.user._id);
    savedListingIds = user.savedListings.map(id => id.toString());
  }
  
  res.render('index', { listings, savedListingIds });
}

// Save Listings
module.exports.saveListing = async (req, res, next) => {
  const { id } = req.params;
  const User = require('../MODELS/user');
  
  // Check if already saved
  const user = await User.findById(req.user._id);
  const isAlreadySaved = user.savedListings.some(listingId => listingId.equals(id));
  
  
  
  // Add to saved listings
  await User.findByIdAndUpdate(req.user._id, {
    $push: { savedListings: id }
  });
  res.redirect('/listings');
}

// Unsave Listings
module.exports.unsaveListing = async (req, res, next) => {
  const { id } = req.params;
  const User = require('../MODELS/user');
  
  // Remove from saved listings
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedListings: id }
  });
  const redirectUrl = req.get('Referer') || '/listings';
  res.redirect(redirectUrl);
}
//book listings
module.exports.bookListing= async(req,res,next)=>{
  console.log("Booking Request Received");
  const { checkin, checkout, guests } = req.body;
  
  const date1 = new Date(checkin);
  const date2 = new Date(checkout);
  // Convert to days
  const diffDays = (date2 - date1) / (1000 * 60 * 60 * 24);
  const Listing = require('../MODELS/listing');
  const listing = await Listing.findById(req.params.id).populate('owner');
  // Calculate total price
  const totalPrice = listing.price * diffDays;
  // Create bookings
  const Booking = require('../MODELS/bookings');
  
  console.log('Owner details:', {
    email: listing.owner.email,
    contactNumber: listing.owner.contactNumber
  });
  
  const newBooking = new Booking({
    user: req.user._id,
    ownerContactEmail: listing.owner.email || 'Not provided',
    ownerContactNumber: listing.owner.contactNumber || 'Not provided',
    listing: listing._id,
    checkin: date1,  
    checkout: date2,
    guests: guests,
    amount: totalPrice
  });
  await newBooking.save();
  
  // Add booking to user's bookings array
  const User = require('../MODELS/user');
  await User.findByIdAndUpdate(req.user._id, {
    $push: { bookings: newBooking._id }
  });
  
  console.log(`Booking created: Days: ${diffDays}, Guests: ${guests}, Total: ₹${totalPrice}`);
  res.render('bookingconfirmation.ejs', { booking: newBooking, listing, diffDays });
}
//show booking receipt
module.exports.showBookingReceipt = async (req, res, next) => {
  const { id } = req.params;
  const  Booking = require('../MODELS/bookings');
  const booking = await Booking.findById(id).populate('listing').populate('user');
  if (!booking) {
    req.flash('error', 'Booking not found!');
    return res.redirect('/listings');
  }
  
  // Calculate duration
  const diffDays = (new Date(booking.checkout) - new Date(booking.checkin)) / (1000 * 60 * 60 * 24);
  
  res.render('bookingReciept', { booking, listing: booking.listing, diffDays });
} 