const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	owner: {
		id: mongoose.Schema.Types.ObjectId,
		username: String,
		email: String,
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
		default: 1440,
	},
	productImage: {
		type: String,
		default: "404Error4.png",
	},
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
