const mongoose = require("mongoose");
const { Campground } = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

main()
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/camp");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 100; i++) {
		let random1000 = Math.floor(Math.random() * 1000);
		const camp = new Campground({
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random1000].city},${cities[random1000].state}`,
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());
