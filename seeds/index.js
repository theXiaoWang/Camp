import { mongoose, connect } from "mongoose";
import Campground from "../models/Campground.js";
import cities from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";

main()
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));

async function main() {
	await connect("mongodb://127.0.0.1:27017/camp");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const textGenerator = () => {
	const lorem =
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
	const random = (e) => Math.floor(Math.random() * e);
	return lorem.slice(
		parseInt(random(lorem.length / 3)),
		parseInt(lorem.length / 3) + parseInt(random(lorem.length / 3))
	);
};

const price = Math.floor(Math.random() * 20) + 10;

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		let random1000 = Math.floor(Math.random() * 1000);
		const camp = new Campground({
			author: "65dbc5337b2da937c981689c",
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random1000].city},${cities[random1000].state}`,
			description: textGenerator(),
			price,
			images: [
				{
					url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708969889/Camp/qqtqv6n9wefvhfm1a3nw.jpg",
					filename: "Camp/qqtqv6n9wefvhfm1a3nw",
				},
				{
					url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708969890/Camp/qo51k5xlt7oebmdqvazu.jpg",
					filename: "Camp/qo51k5xlt7oebmdqvazu",
				},
				{
					url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708969891/Camp/cgfwx0wyvxbhricgy0oe.jpg",
					filename: "Camp/cgfwx0wyvxbhricgy0oe",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());
