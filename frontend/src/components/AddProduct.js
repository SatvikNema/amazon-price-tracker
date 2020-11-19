import React, { useState } from "react";
import { addProduct } from "../utils";

const AddProduct = (props) => {
	const [link, setLink] = useState("");
	const [price, setPrice] = useState("");
	const [checkIn, setCheckIn] = useState("");

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			//remove the gibberish from link - handle afterwards
			// let slash_dp_index = link.indexOf("/dp/");
			// if (slash_dp_index === -1) {
			// 	throw new Error("Link not valid");
			// }
			// let lastRequiredIndex = link.indexOf("/", slash_dp_index + 4);
			// let finalLink =
			// 	lastRequiredIndex === -1
			// 		? link
			// 		: link.slice(0, lastRequiredIndex);
			let finalLink = link;
			console.log(price, finalLink, checkIn);
			const obj = {
				link: finalLink,
				targetPrice: price,
				checkInMins: checkIn,
			};
			const res = await addProduct(obj);
			const response = await res.json();
			console.log(response);
			props.history.push("/productList");
		} catch (e) {
			console.log("Error occured: " + e);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div class="form-group">
					<label htmlFor="link">Amazon product link: </label>
					<input
						type="text"
						name="link"
						id="link"
						onChange={(e) => setLink(e.target.value)}
						value={link}
						class="from-control ip"
					/>
				</div>
				<div class="form-group">
					<label htmlFor="target">Target price: </label>
					<input
						type="number"
						name="targetPrice"
						id="target"
						onChange={(e) => setPrice(e.target.value)}
						value={price}
						class="from-control ip"
					/>
				</div>
				<div class="form-group">
					<label htmlFor="check">Check in (mins): </label>
					<input
						type="number"
						name="checkIn"
						id="check"
						onChange={(e) => setCheckIn(e.target.value)}
						value={checkIn}
						class="from-control ip"
					/>
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-success btn-sm">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddProduct;
