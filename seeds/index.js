import { connect, connection } from "mongoose";
import Campground from "../models/campground";
import cities from "./cities";
import { descriptors, places } from "./seedHelpers";

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
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random1000].city},${cities[random1000].state}`,
			image: "https://source.unsplash.com/random/?camping",
			description: textGenerator(),
			price,
		});
		await camp.save();
	}
};

seedDB().then(() => connection.close());
