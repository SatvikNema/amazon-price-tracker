const cheerio = require("cheerio"),
	{ sendHTTPRequest } = require("./sendHTTPRequest");

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
		let imageLinkHandle = pageHandle("#imgBlkFront"),
			productImage = null;

		if (imageLinkHandle.length == 0) {
			imageLinkHandle = pageHandle("#imgTagWrapperId img");
			productImage = imageLinkHandle.attr("data-old-hires");
		}
		if (imageLinkHandle.length == 0) {
			imageLinkHandle = pageHandle("#ebooksImgBlkFront");
			const parsed = JSON.parse(
				imageLinkHandle.attr("data-a-dynamic-image")
			);
			productImage = Object.keys(parsed)[0];
		}
		if (imageLinkHandle.length == 0) {
			imageLinkHandle = pageHandle("#landingImage");
			productImage = imageLinkHandle.attr("data-old-hires");
		} else {
			const parsed = JSON.parse(
				imageLinkHandle.attr("data-a-dynamic-image")
			);
			productImage = Object.keys(parsed)[0];
		}

		// console.log({
		// 	title,
		// 	price,
		// 	productImage,
		// });

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

module.exports = {
	fetchProductDetails,
};
