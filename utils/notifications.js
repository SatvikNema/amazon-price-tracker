import nodemailer from "nodemailer";
import { fetchProductDetails } from "./fetchProductDetails";
import User from "../models/user";

export const updateDetail = async (product) => {
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

export const sendNotificationEmail = (
	recipientEmail,
	title,
	currentPrice,
	targetPrice
) => {
	let mailOptions = {
		from: process.env.SENDER_USERNAME,
		to: recipientEmail,
		subject: "Notification: Amazon product price drop",
		html: `The price of <em>${title}</em> dropped to: <strong><em>INR ${currentPrice}</em></strong>.<br/> 
			Get it before it gets out of stock :).
			<hr>
			Delete this product from your profile to stop getting repeated emails. Thank you`,
	};
	dispatchMail(mailOptions);
};

const sendVerificationEmail = (recipientEmail, verificationLink) => {
	let mailOptions = {
		from: process.env.SENDER_USERNAME,
		to: recipientEmail,
		subject: "Email verification",
		html: `Thank you for registering :) <br> 
			<a href="${verificationLink}">Click on this link to verify</a>
			<hr>
			If you cannot go to the above hyperlink, click here: ${verificationLink}
			If this is still not a link, kindly copy paste this URL in your browser and proceed.
		`,
	};
	dispatchMail(mailOptions);
};

export const dispatchMail = (mailOptions) => {
	let transporterDetails = {
		service: "gmail",
		auth: {
			user: process.env.SENDER_USERNAME,
			pass: process.env.PASSWORD,
		},
	};
	const transporter = nodemailer.createTransport(transporterDetails);
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};
