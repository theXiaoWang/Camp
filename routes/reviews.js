import express from "express";
//merge all params from nested routes so all params are accessible
const router = express.Router({ mergeParams: true });
import Campground from "../models/Campground.js";
import Review from "../models/Review.js";
import catchAsync from "../utils/catchAsync.js";
import { isSignedIn, isSignedInSamePage } from "../middlewares/middlewares.js";
import { validateReview, isReviewAuthor } from "../middlewares/reviewMiddlewares.js";

router.post(
	"/",
	isSignedInSamePage,
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		campground.reviews.push(review);
		await campground.save();
		await review.save();
		req.flash("success", "Created new review!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:reviewId",
	isSignedIn,
	catchAsync(isReviewAuthor),
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Review.findByIdAndDelete(reviewId);
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		req.flash("success", "Reviewed deleted!");
		res.redirect(`/campgrounds/${id}`);
	})
);

export default router;
