const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	googleUser: {
		type: Boolean,
		default: false,
	},
	googleUserName: {
		type: String,
	},
	username: {
		type: String,
		trim: true,
	},
	password: {
		type: String,
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: "Email address is required",
	},
	items: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
	],
	recieveEmails: {
		type: Boolean,
		default: true,
	},
});

const User = mongoose.model("User", userSchema);
module.exports = User;
