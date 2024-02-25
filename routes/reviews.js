import express from "express";
//merge all params from nested routes so all params are accessible
const router = express.Router({ mergeParams: true });
import Campground from "../models/Campground.js";
import Review from "../models/Review.js";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { ReviewSchema } from "../utils/ValidateSchemas.js";
import { isSignedIn } from "../middleware.js";

//#region Middlewares
//Joi for validating form data
const validateReview = (req, res, next) => {
	const { error } = ReviewSchema.validate(req.body);
	if (error) {
		const message = error.details.map((e) => e.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};
//#endregion

router.post(
	"/",
	isSignedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
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
