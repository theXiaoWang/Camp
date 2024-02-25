import express from "express";
const router = express.Router();
import Campground from "../models/Campground.js";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { CampgroundSchema } from "../utils/ValidateSchemas.js";
import { isSignedIn } from "../middleware.js";

//#region Middlewares
//Joi for validating form data
const validateCampground = (req, res, next) => {
	const { error } = CampgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((e) => e.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};
//#endregion

router.get(
	"/",
	catchAsync(async (req, res, next) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get("/new", isSignedIn, (req, res) => {
	res.render("campgrounds/new");
});

router.post(
	"/",
	isSignedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash("success", "New campground added!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate("reviews"); //it populates references with the actual documents from the referenced MongoDB collection by mongoose.
		if (!campground) {
			req.flash("error", "Cannot find the campground!");
			return res.redirect("/campgrounds");
		}
		const campgroundObject = campground.toObject();
		res.render("campgrounds/details", { ...campgroundObject });
	})
);

router.get(
	"/:id/edit",
	isSignedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash("error", "Cannot find the campground!");
			return res.redirect("/campgrounds");
		}
		const campgroundObject = campground.toObject();
		res.render("campgrounds/edit", { ...campgroundObject });
	})
);

router.put(
	"/:id",
	isSignedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campgroundBody = req.body.campground;
		const newCampground = await Campground.findByIdAndUpdate(id, { ...campgroundBody }, { new: true });
		req.flash("success", "Campground updated!");
		res.redirect(`/campgrounds/${id}`);
	})
);

router.delete(
	"/:id",
	isSignedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Campground deleted!");
		res.redirect("/campgrounds");
	})
);

export default router;
