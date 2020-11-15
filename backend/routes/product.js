const router = require("express").Router(),
	{
		isLoggedIn,
		checkProductOwnership,
		updateDetail,
		fetchProductDetails,
	} = require("./utils"),
	Product = require("../models/product"),
	User = require("../models/user");

router.post("/addProduct", isLoggedIn, async (req, res) => {
	try {
		const { targetPrice, link, checkInMins } = req.body;
		const details = await fetchProductDetails(link);
		const productPrice = details.price,
			title = details.title;
		const productOnwer = await User.findById(req.session.userId);
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
		return res.status(406).json(e);
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
				return res.status(201).json("Price is updated!");
			}
			return res.status(200).json("No change in the product price");
		} else {
			return res.status(406).json("Failed to update the product's price");
		}
	} catch (e) {
		return res.status(406).json("Something went wrong: " + e);
	}
});

router.get("/updateAll/", async (req, res) => {
	try {
		const products = await Product.find();
		const promisedOfUpdates = products.map(updateDetail);
		await Promise.all(promisedOfUpdates);

		console.log("challo bhai ho gaya");
		res.json("every product was updated!");
	} catch (e) {
		return res.status(406).json(e);
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

router.get("/product/:id", checkProductOwnership, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			throw new Error("product not found");
		}
		const { link, targetPrice, checkInMins } = product;
		res.status(200).send({ link, targetPrice, checkInMins });
	} catch (e) {
		return res.status(406).json("Something went wrong: " + e);
	}
});

router.post("/editProduct/:id", checkProductOwnership, async (req, res) => {
	try {
		const { targetPrice, link, checkInMins } = req.body;
		const oldProduct = await Product.findById(req.params.id);
		if (!oldProduct) {
			return res.status(404).json("This product does not exists");
		}
		let updateObject = {};
		if (targetPrice && targetPrice !== oldProduct.targetPrice) {
			updateObject.targetPrice = targetPrice;
		}
		if (link && link !== oldProduct.link) {
			updateObject.link = link;
		}
		if (checkInMins && checkInMins !== oldProduct.checkInMins) {
			updateObject.checkInMins = checkInMins;
		}
		if (Object.keys(updateObject).length > 0) {
			const oldProduct = await Product.findByIdAndUpdate(
				req.params.id,
				updateObject
			);
			return res.status(201).json("Product details were updated!");
		} else {
			return res.json("Nothing to update");
		}
	} catch (e) {
		return res.status(406).json("Something went wrong: " + e);
	}
});

router.delete("/deleteProduct/:id", checkProductOwnership, async (req, res) => {
	try {
		const oldProduct = await Product.findByIdAndDelete(req.params.id);
		const user = await User.findById(req.session.userId);
		if (!oldProduct || !user) {
			return res.status(404).json(e);
		}
		const itemIndex = user.items.indexOf(req.params.id);
		if (itemIndex !== -1) {
			user.items.splice(itemIndex, 1);
		}
		await user.save();
		return res
			.status(200)
			.json("product and its other refernces were deleted!");
	} catch (e) {
		res.status(406).json(e);
	}
});
// router.post(
// 	"/updateCheckFrequency/:id",
// 	checkProductOwnership,
// 	async (req, res) => {}
// );

module.exports = router;
