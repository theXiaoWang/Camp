import express from "express";
const router = express.Router();
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";
import { storeReturnTo } from "../middlewares/middlewares.js";

router.get("/signUp", (req, res) => {
	res.render("users/signUp");
});

router.post(
	"/signUp",
	catchAsync(async (req, res, next) => {
		try {
			const { username, email, password } = req.body;
			const user = new User({ username, email });
			const registeredUser = await User.register(user, password);
			req.logIn(registeredUser, (err) => {
				if (err) return next(err);
				req.flash("success", "Welcome to Camp!");
				res.redirect("/campgrounds");
			});
		} catch (error) {
			req.flash("error", error.message);
			res.redirect("/signUp");
		}
	})
);

router.get("/signIn", (req, res) => {
	res.render("users/signIn");
});

router.post(
	"/signIn",
	storeReturnTo, //check if we have url stored before being signed out, and return back to the history
	passport.authenticate("local", { failureRedirect: "/signIn", failureFlash: true }),
	(req, res) => {
		const redirectUrl = res.locals.returnTo || "/campgrounds";
		req.flash("success", `Welcome, ${req.body.username}.`);
		res.redirect(redirectUrl);
	}
);

router.get("/signOut", (req, res, next) => {
	req.logOut((err) => {
		if (err) return next(err);
		req.flash("success", "Goodbye!");
		res.redirect("/campgrounds");
	});
});

export default router;
