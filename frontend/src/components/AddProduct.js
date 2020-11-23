import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addThisProduct } from "../actions/productActions";
import PropTypes from "prop-types";

const AddProduct = (props) => {
	const [link, setLink] = useState("");
	const [price, setPrice] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [validInput, setValidInput] = useState(true);

	const removeGibberish = (link) => {
		let refIndex = link.indexOf("/ref");
		if (refIndex == -1) {
			let questionIndex = link.indexOf("?");
			if (questionIndex == -1) {
				return link;
			}
			return link.slice(0, questionIndex);
		}
		return link.slice(0, refIndex);
	};

	const isUrl = (s) => {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return regexp.test(s);
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			let finalLink = null;
			if (link && price && checkIn && isUrl(link)) {
				//clean the link
				finalLink = removeGibberish(link);
				setValidInput(true);
				const obj = {
					link: finalLink,
					targetPrice: price,
					checkInMins: checkIn,
				};
				setLink("");
				setPrice("");
				setCheckIn("");
				props.addThisProduct(obj);
			} else {
				throw new Error("input me locha");
			}
		} catch (e) {
			console.log("Error occured: " + e);
			setValidInput(false);
		}
	};

	return (
		<div>
			{!validInput && <h1>The link should be a proper URL</h1>}
			{props.status === "start" && <h1>Adding the product</h1>}
			{props.status === "finished" &&
				(props.errStatus ? <h1>{props.errMsg}</h1> : <h1>Added!</h1>)}
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
						required
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
						required
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
						required
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
	errMsg: state.error.msg,
	errStatus: state.error.status,
});

export default connect(mapStateToProps, { addThisProduct })(AddProduct);
