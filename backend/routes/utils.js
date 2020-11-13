const nodemailer = require("nodemailer"),
	Product = require("../models/product"),
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const isLoggedIn = (req, res, next) => {
	if (req.session.userId) {
		next();
	} else {
		res.status(401).json(
			"sorry you are not authenticated to use this feature"
		);
	}
};

const homeRedirect = (req, res, next) => {
	if (req.session.userId) {
		res.status(406).json("You are already logged in!");
	} else {
		next();
	}
};

const dispatchMail = (transporterDetails, mailOptions) => {
	const transporter = nodemailer.createTransport(transporterDetails);

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

const sendHTTPRequest = (method, url, obj, isJSON) => {
	const promise = new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.open(method, url);
		if (obj) {
			request.setRequestHeader("Content-Type", "application/json");
		}
		request.send(JSON.stringify(obj));
		request.onload = () => {
			if (request.status >= 400) {
				reject(request.responseText);
			} else {
				if (isJSON) {
					resolve(JSON.parse(request.responseText));
				} else {
					resolve(request.responseText);
				}
			}
		};
		request.onerror = () => {
			reject(
				"Something went wrong. Either the url is incorrect, or there are some network issues!"
			);
		};
	});
	return promise;
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
	dispatchMail,
	sendHTTPRequest,
	isLoggedIn,
	homeRedirect,
	checkProductOwnership,
};
