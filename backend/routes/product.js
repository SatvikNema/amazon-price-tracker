const router = require("express").Router(),
	{ fetchProductDetails } = require("./fetchProductDetails"),
	{ isLoggedIn, checkProductOwnership } = require("./utils"),
	Product = require("../models/product"),
	User = require("../models/user");

router.post("/addProduct", isLoggedIn, async (req, res) => {
	try {
		const { targetPrice, link, checkInMins } = req.body;
		const details = await fetchProductDetails(link);
		const productPrice = details.price,
			title = details.title;
		const productOnwer = await User.findById(req.session.userId);
		// console.log(details);
		if (!productOnwer) {
			return res
				.status(401)
				.json("You are not authhorized to add a product.");
		}
		if (typeof productPrice === "number") {
			const newProduct = new Product({
				owner: {
					id: productOnwer._id,
					username: productOnwer.username,
				},
				link,
				title,
				price: [
					{
						value: productPrice,
					},
				],
				targetPrice,
				checkInMins,
			});
			await newProduct.save();
			productOnwer.items.push(newProduct);
			await productOnwer.save();
			return res.status(200).json({ title, productPrice });
		} else {
			return res.status(404).json("Product not found");
		}
	} catch (e) {
		return res.status(406).json("Something went wrong: " + e);
	}
});

router.get("/scheduledUpdate/:id", async (req, res) => {
	try {
		const productId = req.params.id;
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json("The product does not exist.");
		}
		const details = await fetchProductDetails(product.link);
		const productPrice = details.price,
			title = details.title;
		if (typeof productPrice === "number") {
			const prices = product.price;
			if (productPrice !== prices[prices.length - 1].value) {
				product.price.push({
					value: productPrice,
				});
				await product.save();
				return res.status(200).json("Price is updated!");
			}
			return res.status(200).json("No change in the product price");
		} else {
			return res.status(406).json("Failed to update the product's price");
		}
	} catch (e) {
		return res.status(406).json("Something went wrong: " + e);
	}
});

router.get("/productList", isLoggedIn, async (req, res) => {
	try {
		const user = await User.findById(req.session.userId);
		const userWithProducts = await user.populate("items").execPopulate();
		res.status(200).json(userWithProducts);
	} catch (e) {
		return res.status(406).json("Something went wrong: " + e);
	}
});

// router.post(
// 	"/updateTargetPrice/:id",
// 	checkProductOwnership,
// 	async (req, res) => {}
// );
// router.post(
// 	"/updateCheckFrequency/:id",
// 	checkProductOwnership,
// 	async (req, res) => {}
// );

module.exports = router;
