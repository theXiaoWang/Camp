import { Schema, model } from "mongoose";

const CampGroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
});

const Campground = model("Campground", CampGroundSchema);

export default Campground;
