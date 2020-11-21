import React, { useEffect, useState } from "react";
import { fetchProduct } from "../utils";
import { connect } from "react-redux";
import { editThisProduct } from "../actions/productActions";
import PropTypes from "prop-types";

const EditProduct = (props) => {
	const [localLink, setLocalLink] = useState("");
	const [price, setPrice] = useState("");
	const [checkIn, setCheckIn] = useState("");

	const fetchProductWrappper = async (id) => {
		try {
			const response = await (await fetchProduct(id)).json();
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
			props.editThisProduct(props.match.params.id, obj);
			if (!props.loading) props.history.push("/productList");
		} catch (e) {
			console.log(e);
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
						onChange={(e) => localLink(e.target.value)}
						value={localLink}
						class="form-control ip"
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
						class="form-control ip"
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
						class="form-control ip"
					/>
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-sm btn-warning">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

EditProduct.prototype = {
	editThisProduct: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

const mapToStateProps = (state) => ({
	loading: state.profile.loading,
});

export default connect(mapToStateProps, { editThisProduct })(EditProduct);
