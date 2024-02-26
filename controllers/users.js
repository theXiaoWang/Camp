import User from "../models/User.js";

export const renderSignUpForm = (req, res) => {
	res.render("users/signUp");
};

export const signUp = async (req, res, next) => {
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
};

export const renderSignInForm = (req, res) => {
	res.render("users/signIn");
};

export const signIn = (req, res) => {
	const redirectUrl = res.locals.returnTo || "/campgrounds";
	req.flash("success", `Welcome, ${req.body.username}.`);
	res.redirect(redirectUrl);
};

export const signOut = (req, res, next) => {
	req.logOut((err) => {
		if (err) return next(err);
		req.flash("success", "Goodbye!");
		res.redirect("/campgrounds");
	});
};
