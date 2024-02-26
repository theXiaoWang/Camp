import express from "express";
const router = express.Router();
import * as campgrounds from "../controllers/campgrounds.js";
import catchAsync from "../utils/catchAsync.js";
import { isSignedIn } from "../middlewares/middlewares.js";
import { validateCampground, isAuthor } from "../middlewares/campgroundMiddleware.js";
import multer from "multer";
import { storage } from "../cloudinaryConfig/index.js";
const upload = multer({ storage });

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isSignedIn, campgrounds.renderNewForm);

// router.post("/", isSignedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.post("/", upload.array("image"), (req, res) => {
	console.log(req.body, req.files);
	res.send("worked");
});

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get("/:id/edit", isSignedIn, catchAsync(isAuthor), catchAsync(campgrounds.renderEditForm));

router.put("/:id", isSignedIn, catchAsync(isAuthor), validateCampground, catchAsync(campgrounds.editCampground));

router.delete("/:id", isSignedIn, catchAsync(isAuthor), catchAsync(campgrounds.deleteCampground));

export default router;
