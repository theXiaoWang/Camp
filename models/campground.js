import { Schema, model } from "mongoose";
import Review from "./Review.js";

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
	{
		title: String,
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
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
	},
	opts
);

CampgroundSchema.virtual("properties.popUpMarkUp").get(function () {
	return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
	<p>${this.description.substring(0, 20)} ...</p>`;
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
	console.log("Deleting reviews for campground:", doc.reviews);
	const result = await Review.deleteMany({ _id: { $in: doc.reviews } });
	console.log(result); // This will show you the outcome of the deleteMany operation
});

const Campground = model("Campground", CampgroundSchema);

export default Campground;
