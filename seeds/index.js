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

const imageDummies = [
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997307/Camp/xvbup0z0hyefemacqwzk.jpg",
		filename: "Camp/xvbup0z0hyefemacqwzk",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997298/Camp/gdsbrxwavonlqdch8vnz.jpg",
		filename: "Camp/gdsbrxwavonlqdch8vnz",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997283/Camp/bsoycxlmpveli6gefz8e.jpg",
		filename: "Camp/bsoycxlmpveli6gefz8e",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997283/Camp/bsoycxlmpveli6gefz8e.jpg",
		filename: "Camp/jccvn9ixcqfsuwc4fdif",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997261/Camp/nhbd3ohc8kbwitrtxavc.jpg",
		filename: "Camp/nhbd3ohc8kbwitrtxavc",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997252/Camp/h9c6d95xg50jwo3tqohx.jpg",
		filename: "Camp/h9c6d95xg50jwo3tqohx",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997241/Camp/euch36iddey0ghghrkeg.jpg",
		filename: "Camp/euch36iddey0ghghrkeg",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997227/Camp/ebuzlpe9sbg9hnrcvvra.jpg",
		filename: "Camp/ebuzlpe9sbg9hnrcvvra",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997198/Camp/jf0yhmqhmg7hnbrn15sr.jpg",
		filename: "Camp/jf0yhmqhmg7hnbrn15sr",
	},
	{
		url: "https://res.cloudinary.com/dwi7fnlkj/image/upload/v1708997026/Camp/z8ksrgtr243fmqkjztbi.jpg",
		filename: "Camp/z8ksrgtr243fmqkjztbi",
	},
];

function getRandomImages(imagesArray, numImages) {
	const shuffled = [...imagesArray].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, numImages);
}

const selectedImages = getRandomImages(imageDummies, 3);

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		let random680 = Math.floor(Math.random() * 680);
		const camp = new Campground({
			author: "65dbc5337b2da937c981689c",
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random680].city},${cities[random680].country}`,
			description: textGenerator(),
			price,
			geometry: {
				type: "Point",
				coordinates: [cities[random680].lng, cities[random680].lat],
			},
			images: getRandomImages(imageDummies, 3),
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());
