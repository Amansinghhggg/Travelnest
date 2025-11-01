const mongoose = require('mongoose');
const Listing = require('../MODELS/models');
const { data } = require('./data');

async function main() {
   mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => console.log("Mongo Connection Open"))
.catch(err => console.log(err));


const init = async () => {
    await Listing.deleteMany({});
    const listings = data.map(item => ({
        ...item,
        image: item.image.url // use only the image URL
    }));
    await Listing.insertMany(listings);
    console.log("Data Inserted");
};
init();
