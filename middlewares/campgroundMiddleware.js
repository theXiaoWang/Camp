import Campground from "../models/Campground.js";
import ExpressError from "../utils/ExpressError.js";
import { CampgroundSchema } from "../utils/ValidateSchemas.js";

//Joi for validating form data
export function validateCampground(req, res, next) {
	const { error } = CampgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((e) => e.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
}

export async function isAuthor(req, res, next) {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}
