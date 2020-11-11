const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	owner: {
		id: mongoose.Schema.Types.ObjectId,
		username: String,
	},
	link: {
		type: String,
		trim: true,
	},
	title: {
		type: String,
		trim: true,
	},
	price: [
		{
			value: {
				type: Number,
				trim: true,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	targetPrice: {
		type: Number,
		trim: true,
	},
	checkInMins: {
		type: Number,
	},
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
