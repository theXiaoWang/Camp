import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

userSchema.plugin(passportLocalMongoose);

const User = model("User", userSchema);

export default User;
