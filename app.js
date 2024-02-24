import express, { urlencoded } from "express";
import methodOverride from "method-override";
import { connect } from "mongoose";
import engine from "ejs-mate";
import path from "path";
import { fileURLToPath } from "url";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import flash from "connect-flash";
//routes
import campgrounds from "./routes/campgrounds.js";
import reviews from "./routes/reviews.js";

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
app.use(express.static(path.dirname(__filename) + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(urlencoded({ extended: true }));

const sessionConfig = {
	secret: "placeholder",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // store for 1 week
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	next();
});
app.use((req, res, next) => {
	res.locals.error = req.flash("error");
	next();
});

//Campgrounds route
app.use("/campgrounds", campgrounds);
//Reviews route
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
	res.render("home");
});

//Middlewares, error handler
app.all("*", (req, res, next) => next(new ExpressError("404 Not Found", 404))); // Pass the error to the next middleware);

app.use((err, req, res, next) => {
	if (!err.message) err.message = "something went wrong";
	res.status(err.status || 500).render("error", { err });
});

app.listen(3000, () => {
	console.log("Serving on port 3000");
});
