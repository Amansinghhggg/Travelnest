const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const listingSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		url: String,
		filename: String
	},
	location: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	averageRating: {
	  type: Number,
	  default: 0
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});
listingSchema.post('findOneAndDelete', async function(listing) {
    if (listing) {
 await Review.deleteMany({_id: { $in: listing.reviews } });
}})

const Listing = mongoose.model('Listing', listingSchema);

module.exports= Listing;