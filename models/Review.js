import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

const Review = model("Review", reviewSchema);

export default Review;
