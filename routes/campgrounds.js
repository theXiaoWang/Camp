import express from "express";
const router = express.Router();
import Campground from "../models/Campground.js";
import catchAsync from "../utils/catchAsync.js";
import { isSignedIn } from "../middlewares/middlewares.js";
import { validateCampground, isAuthor } from "../middlewares/campgroundMiddleware.js";

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
		campground.author = req.user._id;
		await campground.save();
		req.flash("success", "New campground added!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		//populates nested references with the actual documents from the referenced MongoDB collection by mongoose.
		const campground = await Campground.findById(id)
			.populate({ path: "reviews", populate: { path: "author" } })
			.populate("author");
		if (!campground) {
			req.flash("error", "Cannot find the campground!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/details", { campground });
	})
);

router.get(
	"/:id/edit",
	isSignedIn,
	catchAsync(isAuthor),
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash("error", "Cannot find the campground!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	isSignedIn,
	catchAsync(isAuthor),
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const newCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
		req.flash("success", "Campground updated!");
		res.redirect(`/campgrounds/${id}`);
	})
);

router.delete(
	"/:id",
	isSignedIn,
	catchAsync(isAuthor),
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Campground deleted!");
		res.redirect("/campgrounds");
	})
);

export default router;
