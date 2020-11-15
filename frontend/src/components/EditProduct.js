import React, { useEffect, useState } from "react";
import { fetchProduct, editProduct } from "../utils";

const EditProduct = (props) => {
	const [localLink, setLocalLink] = useState("");
	const [price, setPrice] = useState("");
	const [checkIn, setCheckIn] = useState("");

	const fetchProductWrappper = async (id) => {
		try {
			const response = await (await fetchProduct(id)).json();
			console.log(response);
			const { link, targetPrice, checkInMins } = response;
			setLocalLink(link);
			setPrice(targetPrice);
			setCheckIn(checkInMins);
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		fetchProductWrappper(props.match.params.id);
	}, [props.match.params.id]);

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const obj = {
				link: localLink,
				targetPrice: price,
				checkInMins: checkIn,
			};
			const res = await editProduct(props.match.params.id, obj);
			const response = await res.json();
			console.log(response);
			props.history.push("/productList");
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label htmlFor="link">
					<label htmlFor="link">Amazon product link: </label>
					<input
						type="text"
						name="link"
						id="link"
						onChange={(e) => localLink(e.target.value)}
						value={localLink}
					/>
					<br />
					<label htmlFor="target">Target price: </label>
					<input
						type="number"
						name="targetPrice"
						id="target"
						onChange={(e) => setPrice(e.target.value)}
						value={price}
					/>
					<br />
					<label htmlFor="check">Check in (mins): </label>
					<input
						type="number"
						name="checkIn"
						id="check"
						onChange={(e) => setCheckIn(e.target.value)}
						value={checkIn}
					/>
					<br />
					<button type="submit">Submit</button>
				</label>
			</form>
		</div>
	);
};

export default EditProduct;