export function isSignedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		//if signed in, store current url to session
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must sign in first");
		return res.redirect("/signIn");
	}
	next();
}

//remain at the same page (i.e. giving flash message) when check authentication
export function isSignedInSamePage(req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash("error", "You must sign in first");
		//go back to the previous URL
		let pathParts = req.originalUrl.split("/");
		if (pathParts.length > 2) {
			pathParts.pop();
		}
		let backOneEndpoint = pathParts.join("/");
		//if signed in, store current url to session
		req.session.returnTo = backOneEndpoint;
		return res.redirect(backOneEndpoint);
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
