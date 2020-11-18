const nodemailer = require("nodemailer"),
	Product = require("../models/product"),
	User = require("../models/user"),
	cheerio = require("cheerio"),
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
const updateDetail = async (product) => {
	try {
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
				console.log(
					product.title + " price changed to - INR " + productPrice
				);
			}
			console.log("No change in " + product.title);
		} else {
			throw "kuch jhol ho gaya bhau! for: " + product.title;
		}
	} catch (e) {
		throw "error occured: " + e;
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

const loadHTML = async (url) => {
	try {
		// Sending the request to get the product page of amazon, in raw html
		const productHtmlPage = await sendHTTPRequest(
			(method = "GET"),
			(url = url),
			(obj = {}),
			(isJSON = false)
		);
		const loadedHTML = cheerio.load(productHtmlPage);
		return loadedHTML;
	} catch (e) {
		console.log(e);
	}
};

const fetchProductDetails = async (url) => {
	try {
		// Fetching the price
		const pageHandle = await loadHTML(url);
		const firstPriceElement = pageHandle("#priceblock_dealprice");
		let price = fetchNumericalPrice(firstPriceElement);
		if (!price) {
			const thridPriceElement = pageHandle("#priceblock_ourprice");
			price = fetchNumericalPrice(thridPriceElement);
		}
		if (!price) {
			const fourthPriceElement = pageHandle("#priceblock_saleprice");
			price = fetchNumericalPrice(fourthPriceElement);
		}
		if (!price) {
			const secondPriceElement = pageHandle(
				"span .a-size-base.a-color-price.a-color-price"
			);
			price = fetchNumericalPrice(secondPriceElement);
		}

		//Fetching the title
		const title = pageHandle("#productTitle").text().trim();

		// fetching the image url
		// $("#imgTagWrapperId img") || $("#img-canvas img")
		let imageLinkHandle = pageHandle("#imgBlkFront"),
			productImage = null;

		if (imageLinkHandle.length == 0) {
			imageLinkHandle = pageHandle("#imgTagWrapperId img");
			productImage = imageLinkHandle.attr("data-old-hires");
		} else {
			const parsed = JSON.parse(
				imageLinkHandle.attr("data-a-dynamic-image")
			);
			productImage = Object.keys(parsed)[0];
		}
		return {
			title,
			price,
			productImage,
		};
	} catch (e) {
		throw "Error occcured in fetchProductDeatils.js: " + e;
	}
};

const fetchNumericalPrice = (priceElement) => {
	return parseInt(priceElement.text().trim().slice(2).replace(/,/g, ""));
};

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
	}
};

module.exports = {
	dispatchMail,
	sendHTTPRequest,
	isLoggedIn,
	homeRedirect,
	checkProductOwnership,
	updateDetail,
	fetchProductDetails,
	isAdminAccount,
};
