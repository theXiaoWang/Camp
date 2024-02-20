const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const { Campground } = require("./models/campground");

const app = express();

main()
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/camp");
}

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/makeCampground", async (req, res) => {
	const dummy = { title: "Backyard", description: "This is a backyard" };
	const camp = new Campground(dummy);
	// await camp.save();
	res.send(camp);
});

app.listen(3000, () => {
	console.log("Serving on port 3000");
});
