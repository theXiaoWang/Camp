const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampGroudSchema = new Schema({
	title: String,
	price: String,
	description: String,
	location: String,
});

const Campground = mongoose.model("Campground", CampGroudSchema);

module.exports = { Campground };
