import Review from "../models/Review.js";
import Campground from "../models/Campground.js";

export const createReview = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await campground.save();
	await review.save();
	req.flash("success", "Created new review!");
	res.redirect(`/campgrounds/${campground._id}`);
};

export const deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Review.findByIdAndDelete(reviewId);
	await Campground.findByIdAndUpdate(id, {
		$pull: { reviews: reviewId },
	});
	req.flash("success", "Reviewed deleted!");
	res.redirect(`/campgrounds/${id}`);
};
