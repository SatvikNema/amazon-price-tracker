import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addThisProduct } from "../actions/productActions";
import PropTypes from "prop-types";

const AddProduct = (props) => {
	const [link, setLink] = useState("");
	const [price, setPrice] = useState("");
	const [checkIn, setCheckIn] = useState("");

	// useEffect(() => {
	// 	if (props.status === "finished") {
	// 		props.history.push("/productList");
	// 	}
	// }, [props.status]);

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			let finalLink = link;
			console.log(price, finalLink, checkIn);
			const obj = {
				link: finalLink,
				targetPrice: price,
				checkInMins: checkIn,
			};
			setLink("");
			setPrice("");
			setCheckIn("");
			props.addThisProduct(obj);
		} catch (e) {
			console.log("Error occured: " + e);
		}
	};

	return (
		<div>
			{props.status === "start" && <h1>Adding the product</h1>}
			{props.status === "finished" && <h1>Added!</h1>}
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

AddProduct.prototype = {
	addThisProduct: PropTypes.func.isRequired,
	status: PropTypes.string,
};

const mapStateToProps = (state) => ({
	status: state.profile.status,
});

export default connect(mapStateToProps, { addThisProduct })(AddProduct);
