const User = require("../models/user"),
	Product = require("../models/product");

const isAdminAccount = async (req, res, next) => {
	try {
		if (req.session.userId) {
			const user = await User.findById(req.session.userId);
			if (user.username === "satvik") {
				next();
			} else {
				res.status(401).json({ err: "lol no" });
			}
		} else {
			res.status(401).json({ err: "lol no" });
		}
	} catch (e) {
		console.log(e);
		res.status(406).json({ err: "lol no" });
	}
};

const isAuthorized = async (req, res, next) => {
	const productOnwer = await User.findById(req.session.userId);
	if (!productOnwer) {
		return res
			.status(401)
			.json({ err: "You are not authhorized to add a product." });
	}
	if (!productOnwer.emailVerified) {
		return res.status(401).json({ err: "Please verify your email first." });
	}
	return next();
};

const checkProductOwnership = async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return res.status(404).json("product does not exists");
	}
	if (
		product &&
		req.session.userId &&
		product.owner.id.equals(req.session.userId)
	) {
		return next();
	}
	return res.status(401).json("Not allowed to access other person's product");
};

module.exports = {
	isAdminAccount,
	checkProductOwnership,
	isAuthorized,
};
