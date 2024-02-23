import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
	body: String,
	rating: Number,
});

const Review = model("Review", reviewSchema);

export default Review;
