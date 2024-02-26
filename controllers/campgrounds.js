import Campground from "../models/Campground.js";

export const index = async (req, res, next) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
};

export const renderNewForm = (req, res) => {
	res.render("campgrounds/new");
};

export const createCampground = async (req, res) => {
	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	// console.log(campground);
	campground.author = req.user._id;
	await campground.save();
	req.flash("success", "New campground added!");
	res.redirect(`/campgrounds/${campground._id}`);
};

export const showCampground = async (req, res) => {
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
};

export const renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash("error", "Cannot find the campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { campground });
};

export const editCampground = async (req, res) => {
	const { id } = req.params;
	const newCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
	const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	console.log(images);
	newCampground.images = images;
	// console.log(newCampground);
	await newCampground.save();
	req.flash("success", "Campground updated!");
	res.redirect(`/campgrounds/${id}`);
};

export const deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Campground deleted!");
	res.redirect("/campgrounds");
};
