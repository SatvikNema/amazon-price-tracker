const nodemailer = require("nodemailer"),
	{ fetchProductDetails } = require("./fetchProductDetails"),
	User = require("../models/user");

const updateDetail = async (product) => {
	try {
		const details = await fetchProductDetails(product.link);
		const productPrice = details.price,
			title = details.title;
		const owner = await User.findById(product.owner.id);
		if (typeof productPrice === "number") {
			const prices = product.price;
			if (productPrice !== prices[prices.length - 1].value) {
				product.price.push({
					value: productPrice,
				});
				await product.save();
				// console.log(
				// 	product.title + " price changed to - INR " + productPrice
				// );
			}
			if (owner.recieveEmails && productPrice < product.targetPrice) {
				// send email notification to associated user
				sendNotificationEmail(
					owner.email,
					title,
					productPrice,
					product.targetPrice
				);
				// console.log("email sent");
			}
		} else {
			throw "kuch jhol ho gaya bhau! for: " + product.title;
		}
	} catch (e) {
		throw "error occured: " + e;
	}
};

const sendNotificationEmail = (
	recipientEmail,
	title,
	currentPrice,
	targetPrice
) => {
	let transporter = {
		service: "gmail",
		auth: {
			user: process.env.SENDER_USERNAME,
			pass: process.env.PASSWORD,
		},
	};

	let mailOptions = {
		from: process.env.SENDER_USERNAME,
		to: recipientEmail,
		subject: "Notification: Amazon product price drop",
		html: `The price of <em>${title}</em> dropped to: <strong><em>INR ${currentPrice}</em></strong>.<br/> 
			Get it before it gets out of stock :).
			<hr>
			Delete this product from your profile to stop getting repeated emails. Thank you`,
	};
	dispatchMail(transporter, mailOptions);
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

module.exports = {
	dispatchMail,
	updateDetail,
};
