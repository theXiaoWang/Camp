import express from "express";
const route = express.Router();
import Campground from "../models/Campground.js";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { CampgroundSchema } from "../utils/ValidateSchemas.js";

//Middleware for validating form data
const validateCampground = (req, res, next) => {
	const { error } = CampgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((e) => e.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

route.get(
	"/",
	catchAsync(async (req, res, next) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

route.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

route.post(
	"/",
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash("success", "New campground added!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

route.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate("reviews");
		if (!campground) {
			req.flash("error", "Cannot find the campground!");
			return res.redirect("/campgrounds");
		}
		const campgroundObject = campground.toObject();
		res.render("campgrounds/details", { ...campgroundObject });
	})
);

route.get(
	"/:id/edit",
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

route.put(
	"/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campgroundBody = req.body.campground;
		const newCampground = await Campground.findByIdAndUpdate(
			id,
			{ ...campgroundBody },
			{ new: true }
		);
		req.flash("success", "Campground updated!");
		res.redirect(`/campgrounds/${id}`);
	})
);

route.delete(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Campground deleted!");
		res.redirect("/campgrounds");
	})
);

export default route;
