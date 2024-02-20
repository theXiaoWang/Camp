const express = require("express");
const methodOverride = require("method-override");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("home");
});

app.listen(3000, () => {
	console.log("Serving on port 3000");
});
