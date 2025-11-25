const mongoose = require('mongoose');
const Listing = require('../MODELS/listing');
const { data } = require('./data');

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await main();
    console.log("Mongo Connection Open");
    
    // Delete all existing listings
    await Listing.deleteMany({});
    console.log("Old data deleted");
    
    // Add owner to all new listings
    const newData = data.map((listing) => ({
        ...listing,
        owner: "6907aea4273ddd08817a7ba3"
    }));
    
    // Insert new listings
    await Listing.insertMany(newData);
    console.log("New data inserted successfully");
    
    mongoose.connection.close();
};

initDB().catch(err => {
    console.error("Error:", err);
    mongoose.connection.close();
});
