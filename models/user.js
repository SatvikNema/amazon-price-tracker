const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		unique: true,
		type: String,
		trim: true,
	},
	password: {
		type: String,
	},
	items: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
	],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
