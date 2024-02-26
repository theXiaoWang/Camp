import express from "express";
const router = express.Router();
import * as users from "../controllers/users.js";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";
import { storeReturnTo } from "../middlewares/middlewares.js";

router.get("/signUp", users.renderSignUpForm);

router.post("/signUp", catchAsync(users.signUp));

router.get("/signIn", users.renderSignInForm);

router.post(
	"/signIn",
	storeReturnTo, //check if we have url stored before being signed out, and return back to the history
	passport.authenticate("local", { failureRedirect: "/signIn", failureFlash: true }),
	users.signIn
);

router.get("/signOut", users.signOut);

export default router;
