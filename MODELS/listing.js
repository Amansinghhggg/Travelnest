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
		type: String,
		default: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000",
		set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000" : v
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
	]
});
listingSchema.post('findOneAndDelete', async function(listing) {
    if (listing) {
 await Review.deleteMany({_id: { $in: listing.reviews } });
}})

const Listing = mongoose.model('Listing', listingSchema);

module.exports= Listing;