import Joi from "joi";

const CampgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		// image: Joi.string().required(),
		price: Joi.number().required().min(0),
		description: Joi.string().required(),
		location: Joi.string().required(),
	}).required(),
});

const ReviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(0).max(5),
	}).required(),
});

export { CampgroundSchema, ReviewSchema };
