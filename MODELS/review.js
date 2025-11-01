const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewsSchema = new mongoose.Schema({
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	comment: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

const Review = mongoose.model('Review',reviewsSchema)

 module.exports = Review;