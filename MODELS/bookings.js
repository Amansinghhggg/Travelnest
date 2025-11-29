const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookingSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerContactEmail: {
        type: String,
        required: false
    },
    ownerContactNumber: {
        type: String,
        required: false
    },

    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    checkin: {
        type: Date, 
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    }
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;   