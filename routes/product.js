import express from "express";
const router = express.Router();
import { updateDetail } from "../utils/notifications";
import { fetchProductDetails } from "../utils/fetchProductDetails";
import { isLoggedIn } from "../middleware/authMiddelware";
import {
	checkProductOwnership,
	isAuthorized,
} from "../middleware/checkUserMiddleware";
import Product from "../models/product";
import User from "../models/user";

router.post("/addProduct", isLoggedIn, isAuthorized, async (req, res) => {
	try {
		const { targetPrice, link, checkInMins } = req.body;
		const details = await fetchProductDetails(link);

		const productPrice = details.price,
			{ title, productImage } = details;
		if (productPrice < targetPrice) {
			throw new Error("Product price already less than target price");
		}
		const productOnwer = await User.findById(req.session.userId);
		if (typeof productPrice === "number") {
			const newProduct = new Product({
				owner: {
					id: productOnwer._id,
					username: productOnwer.username,
					email: productOnwer.email,
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
				productImage,
			});
			await newProduct.save();
			productOnwer.items.push(newProduct);
			await productOnwer.save();
			return res.status(200).json({ title, productPrice, productImage });
		} else {
			return res.status(404).json("Product not found");
		}
	} catch (e) {
		return res.status(406).json({ err: e.message });
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
		const productPrice = details.price;
		if (typeof productPrice === "number") {
			const prices = product.price;
			if (productPrice !== prices[prices.length - 1].value) {
				product.price.push({
					value: productPrice,
				});
				await product.save();
				const user = await User.findById(req.session.userId);
				const userWithProducts = await user
					.populate("items")
					.execPopulate();
				return res.status(201).json(userWithProducts);
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
			return res
				.status(404)
				.json({ err: "This product does not exists" });
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
		return res.status(406).json({ err: e });
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
		const userWithProducts = await user.populate("items").execPopulate();

		return res.status(200).json(userWithProducts);
	} catch (e) {
		res.status(406).json({ err: e.message });
	}
});

router.get("/updateAll/:pass", async (req, res) => {
	try {
		if (req.params.pass !== process.env.UPDATE_PASSWORD) {
			return res.status(401).json({ err: "wrong password" });
		}

		const products = await Product.find();
		const promisedOfUpdates = products.map(updateDetail);
		await Promise.all(promisedOfUpdates);
		res.json({ success: "every product was updated!" });
	} catch (e) {
		return res.status(406).json(e);
	}
});

export default router;
