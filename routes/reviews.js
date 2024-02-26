import express from "express";
const router = express.Router({ mergeParams: true }); //merge all params from nested routes so all params are accessible
import * as reviews from "../controllers/reviews.js";
import catchAsync from "../utils/catchAsync.js";
import { isSignedIn, isSignedInSamePage } from "../middlewares/middlewares.js";
import { validateReview, isReviewAuthor } from "../middlewares/reviewMiddlewares.js";

router.post("/", isSignedInSamePage, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isSignedIn, catchAsync(isReviewAuthor), catchAsync(reviews.deleteReview));

export default router;
