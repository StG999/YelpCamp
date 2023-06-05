const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoic3RnOTk5IiwiYSI6ImNsaWgyeGFjejB2YngzcHQ0MmtyYnNqMm0ifQ.g243_rySRS3f0a1sd_G7cg' });

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++) {
        let rand1000 = Math.ceil(Math.random() * 1000);
        let price = Math.ceil(Math.random() * 50 + 10);
        const location = `${cities[rand1000].city}, ${cities[rand1000].state}`;
        const geometry = {
            type: 'Point',
            coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
        }

        // Use this to reseed the data and input the 'geometry' value from MapBox.
        // Otherwise, we can simply have the data from our 'cities.js' seeding file.

        // const geoData = await geocoder.forwardGeocode({
        //     query: location,
        //     limit: 1
        // }).send()
        // geometry = geoData.body.features[0].geometry;


        const c = new Campground({
            author: '6478354c68a193e826b96c47',
            location,
            // location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry,
            // geometry: { type: 'Point', coordinates: [-112.357645, 36.270099] },
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit cupiditate delectus consectetur exercitationem quod expedita similique omnis, aliquam labore nostrum sunt tempora quam id non libero perferendis quibusdam nulla beatae?',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dsj08kdma/image/upload/v1685778728/YelpCamp/lgaangc7ib76gzl8tkkv.jpg',
                    filename: 'YelpCamp/lgaangc7ib76gzl8tkkv'
                },
                {
                    url: 'https://res.cloudinary.com/dsj08kdma/image/upload/v1685778728/YelpCamp/ssgkrycjwa6hmaqgaous.jpg',
                    filename: 'YelpCamp/ssgkrycjwa6hmaqgaous'
                }
            ]
        })
        await c.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })