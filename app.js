if (process.env.NODE_ENV !== "production") {
	await import("dotenv").then((dotenv) => dotenv.config());
}
// console.log(
// 	"Cloudinary Config in app.js :",
// 	process.env.CLOUDINARY_CLOUD_NAME,
// 	process.env.CLOUDINARY_KEY,
// 	process.env.CLOUDINARY_SECRET
// );

import express, { urlencoded } from "express";
import methodOverride from "method-override";
import { connect } from "mongoose";
import engine from "ejs-mate";
import path from "path";
import { fileURLToPath } from "url";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import User from "./models/User.js";
import MongoStore from "connect-mongo";

//routes
import campgroundRoutes from "./routes/campgrounds.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/users.js";

const app = express();

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/camp";

main()
	.then(() => console.log("database connected"))
	.catch((err) => console.log(err));

async function main() {
	await connect(dbUrl);
}

app.engine("ejs", engine);
const __filename = fileURLToPath(import.meta.url);
app.set("views", path.dirname(__filename) + "/views");
app.use(express.static(path.dirname(__filename) + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(urlencoded({ extended: true }));

const secret = process.env.SECRET || "Thisisasecret";

const store = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 60 * 60,
	secret,
});

store.on("error", function (e) {
	console.log("Session store error", e);
});

const sessionConfig = {
	store,
	name: "session",
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // store for 1 week
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
//session should be initialized and used before strategies and flash
app.use(session(sessionConfig));
app.use(passport.session());

//passportLocalStrategy
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

//store in session
app.use((req, res, next) => {
	//On subsequent requests, Passport deserializes the user information (username, email, etc.) from the session and attaches it to the req object as req.user
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

//#region Routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
//#endregion

//
app.get("/", (req, res) => {
	res.render("home");
});

//Middlewares, error handler
app.all("*", (req, res, next) => next(new ExpressError("404 Not Found", 404))); // Pass the error to the next middleware

app.use((err, req, res, next) => {
	if (!err.message) err.message = "something went wrong";
	res.status(err.status || 500).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});
