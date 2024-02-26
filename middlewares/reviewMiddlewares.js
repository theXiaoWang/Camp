import Review from "../models/Review.js";
import ExpressError from "../utils/ExpressError.js";
import { ReviewSchema } from "../utils/ValidateSchemas.js";

//Joi for validating form data
export function validateReview(req, res, next) {
	const { error } = ReviewSchema.validate(req.body);
	if (error) {
		const message = error.details.map((e) => e.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
}

export async function isReviewAuthor(req, res, next) {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}
