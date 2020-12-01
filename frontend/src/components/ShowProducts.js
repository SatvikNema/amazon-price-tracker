import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { connect } from "react-redux";
import {
	getProfile,
	deleteThisProduct,
	updateCurrentPrice,
	startEmailNotification,
	stopEmailNotification,
} from "../actions/productActions";
import PropTypes from "prop-types";

const ShowProducts = (props) => {
	useEffect(() => {
		props.getProfile();
	}, []);
	const updateStatus = async (id) => {
		props.updateCurrentPrice(id);
	};

	const goToEditPage = (id) => {
		props.history.push("/editProduct/" + id);
	};

	const deleteThisProduct = async (id) => {
		props.deleteThisProduct(id);
	};
	return (
		<div>
			{props.status === "start" && <h1>Price is updating....</h1>}
			{props.status === "finished" && <h1>No change in price</h1>}
			{props.isAuthenticated ? (
				<div>
					{props.loading || !props.profile.profile.items ? (
						<h1>Data is loading...</h1>
					) : (
						<div>
							<div className="header-info">
								<h2 id="num-products">
									Number of products tracking:
									{" " + props.profile.profile.items.length}
								</h2>
								<p>
									<strong>
										All prices are updated everyday at 6 am
										IST
									</strong>
								</p>
								{props.profile.profile.recieveEmails ? (
									<p className="email-notification">
										Email notifications for the same are on.
										<button
											className="btn btn-sm btn-danger ml-2"
											onClick={
												props.stopEmailNotification
											}
										>
											Turn off
										</button>
									</p>
								) : (
									<p className="email-notification">
										Email notifications for the same are
										off.
										<button
											className="btn btn-sm btn-success ml-2"
											onClick={
												props.startEmailNotification
											}
										>
											Turn on
										</button>
									</p>
								)}
							</div>
							<ul>
								<div className="row">
									{props.profile.profile.items.map((item) => {
										return (
											<ProductCard
												item={item}
												updateStatus={updateStatus}
												goToEditPage={goToEditPage}
												deleteThisProduct={
													deleteThisProduct
												}
											/>
										);
									})}
								</div>
							</ul>
						</div>
					)}
				</div>
			) : (
				<h1>No user signed in</h1>
			)}
		</div>
	);
};

ShowProducts.prototype = {
	getProfile: PropTypes.func.isRequired,
	updateCurrentPrice: PropTypes.func.isRequired,
	deleteThisProduct: PropTypes.func.isRequired,
	startEmailNotification: PropTypes.func.isRequired,
	stopEmailNotification: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	loading: PropTypes.bool,
	status: PropTypes.string,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	loading: state.profile.loading,
	status: state.profile.status,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
	getProfile,
	deleteThisProduct,
	updateCurrentPrice,
	startEmailNotification,
	stopEmailNotification,
})(ShowProducts);
