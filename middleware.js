export function isSignedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		//if signed in, store current url to session
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must sign in first");
		return res.redirect("/signIn");
	}
	next();
}

export function storeReturnTo(req, res, next) {
	//because session will be cleared after each authentication by passport, we store current url to locals as a history
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
}
