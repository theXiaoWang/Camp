const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const { Campground } = require("./models/campground");
const engine = require("ejs-mate");

const app = express();

main()
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/camp");
}

app.engine("ejs", engine);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	const campgroundObject = campground.toObject();
	res.render("campgrounds/details", { ...campgroundObject });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	const campgroundObject = campground.toObject();
	res.render("campgrounds/edit", { ...campgroundObject });
});

app.put("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const campgroundBody = req.body.campground;
	const newCampground = await Campground.findByIdAndUpdate(
		id,
		{ ...campgroundBody },
		{ new: true }
	);
	res.redirect(`/campgrounds/${id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
});

app.listen(3000, () => {
	console.log("Serving on port 3000");
});
