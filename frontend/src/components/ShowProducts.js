import React, { useEffect, useState } from "react";
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

	const properDateFormat = (s) => {
		let d = new Date(s);
		return d.toLocaleString();
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
							<h2 id="num-products">
								Number of products tracking:
								{" " + props.profile.profile.items.length}
							</h2>
							<p>All prices are updated everyday at 6 am IST</p>
							{props.profile.profile.recieveEmails ? (
								<p class="email-notification">
									<strong>
										Email notifications for the same are on.
									</strong>
									<button
										class="btn btn-sm btn-danger ml-2"
										onClick={props.stopEmailNotification}
									>
										Turn off
									</button>
								</p>
							) : (
								<p class="email-notification">
									<strong>
										Email notifications for the same are
										off.
									</strong>
									<button
										class="btn btn-sm btn-success ml-2"
										onClick={props.startEmailNotification}
									>
										Turn on
									</button>
								</p>
							)}
							<ul>
								<div class="row">
									{props.profile.profile.items.map((item) => {
										return (
											<div
												key={item._id}
												class="col-sm-6 col-md-4 col-lg-4 mb-4"
											>
												<div class="card h-100">
													<img
														src={item.productImage}
														class="card-img product-img"
														alt="..."
													/>
													<div class="card-body">
														<a
															href={item.link}
															target="_blank"
															class="card-link"
														>
															{item.title}
														</a>
														<br />
														<p class="card-text">
															Price (in INR):{" "}
															{
																item.price[
																	item.price
																		.length -
																		1
																].value
															}
															<br />
															Your target:{" "}
															{item.targetPrice}
														</p>
													</div>
													<div class="card-footer">
														<small class="text-muted">
															<button
																onClick={() =>
																	updateStatus(
																		item._id
																	)
																}
																class="btn btn-success mr-2 mb-2"
															>
																Update price!
															</button>
															<button
																onClick={() =>
																	goToEditPage(
																		item._id
																	)
																}
																class="btn btn-warning mr-2 mb-2"
															>
																Edit
															</button>
															<button
																onClick={() =>
																	deleteThisProduct(
																		item._id
																	)
																}
																class="btn btn-danger mr-2 mb-2"
															>
																Delete
															</button>
															<br />
															Last change in
															price:
															<em>
																{properDateFormat(
																	item.price[
																		item
																			.price
																			.length -
																			1
																	].date
																)}
															</em>
														</small>
													</div>
												</div>
											</div>
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
