import express, { urlencoded } from "express";
import methodOverride from "method-override";
import { connect } from "mongoose";
import Campground from "./models/campground.js";
import engine from "ejs-mate";
import catchAsync from "./utils/catchAsync.js";
import path from "path";
import { fileURLToPath } from "url";
import ExpressError from "./utils/ExpressError.js";
import { CampgroundSchema } from "./utils/ValidateSchemas.js";

const app = express();

main()
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));

async function main() {
	await connect("mongodb://127.0.0.1:27017/camp");
}

app.engine("ejs", engine);
const __filename = fileURLToPath(import.meta.url);
app.set("views", path.dirname(__filename) + "/views");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(urlencoded({ extended: true }));

const validateCampground = (req, res, next) => {
	const { error } = CampgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((e) => e.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

app.get("/", (req, res) => {
	res.render("home");
});

app.get(
	"/campgrounds",
	catchAsync(async (req, res, next) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.get(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const campgroundObject = campground.toObject();
		res.render("campgrounds/details", { ...campgroundObject });
	})
);

app.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const campgroundObject = campground.toObject();
		res.render("campgrounds/edit", { ...campgroundObject });
	})
);

app.put(
	"/campgrounds/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campgroundBody = req.body.campground;
		const newCampground = await Campground.findByIdAndUpdate(
			id,
			{ ...campgroundBody },
			{ new: true }
		);
		res.redirect(`/campgrounds/${id}`);
	})
);

app.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);

app.all("*", (req, res, next) => next(new ExpressError("404 Not Found", 404))); // Pass the error to the next middleware);

app.use((err, req, res, next) => {
	if (!err.message) err.message = "something went wrong";
	res.status(err.status || 500).render("error", { err });
});

app.listen(3000, () => {
	console.log("Serving on port 3000");
});
