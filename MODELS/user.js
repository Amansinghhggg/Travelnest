const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    contactNumber:{
      type: String,
      required: true,
      match: [/^\d{10}$/, "Enter a valid Contact Number"],
    },
    savedListings: [{
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }]
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);