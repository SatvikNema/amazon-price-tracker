const User = require("../models/user"),
	Product = require("../models/product");

const isAdminAccount = async (req, res, next) => {
	try {
		if (req.session.userId) {
			const user = await User.findById(req.session.userId);
			if (user.username === "satvik") {
				next();
			} else {
				res.status(401).json("lol no");
			}
		} else {
			res.status(401).json("lol no");
		}
	} catch (e) {
		console.log(e);
		res.status(406).json("lol no");
	}
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
};
