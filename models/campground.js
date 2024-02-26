import { Schema, model } from "mongoose";
import Review from "./Review.js";

const CampgroundSchema = new Schema({
	title: String,
	images: [{ url: String, filename: String }],
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
	console.log("Deleting reviews for campground:", doc.reviews);
	const result = await Review.deleteMany({ _id: { $in: doc.reviews } });
	console.log(result); // This will show you the outcome of the deleteMany operation
});

const Campground = model("Campground", CampgroundSchema);

export default Campground;
