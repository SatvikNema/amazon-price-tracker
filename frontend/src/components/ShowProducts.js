import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getProfile, deleteProduct } from "../actions/productActions";
import PropTypes from "prop-types";

const ShowProducts = (props) => {
	useEffect(() => {
		console.log("effect!!!!!!!!!");
		props.getProfile();
		console.log(props.profile);
	}, []);
	const updateStatus = async (id) => {
		console.log("Clicked on update");
		// try {
		// 	const res = await (await updatePrice(id)).json();
		// 	console.log(res);
		// 	if (res.status === 201) {
		// 		history.go(0);
		// 	}
		// } catch (e) {
		// 	console.log("Erorr coccured: " + e);
		// }
	};

	const properDateFormat = (s) => {
		let d = new Date(s);
		return d.toLocaleString();
	};

	const goToEditPage = (id) => {
		console.log("Clicked on edit");
		// history.push("/editProduct/" + id);
	};

	const deleteThisProduct = async (id) => {
		console.log("Clicked on delete " + id);
		props.deleteProduct(id);
		console.log(props.profile.profile);
		// const res = await deleteProduct(id);
		// const response = await res.json();
		// await fetchProducts();
	};
	const printShit = () => {
		console.log("hooray");
		console.log(props.profile.profile.items);
		return <h1>haalao</h1>;
	};
	return (
		<div>
			{props.profile.loading || !props.profile.profile.items ? (
				<h1>Data is loading...</h1>
			) : (
				<div>
					<p id="num-products">
						Number of products tracking:
						{props.profile.profile.items.length}, owned by:
						{props.profile.profile.username}
					</p>
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
															item.price.length -
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
													Last change in price:
													<em>
														{properDateFormat(
															item.price[
																item.price
																	.length - 1
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
	);
};

ShowProducts.prototype = {
	getProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	loading: state.loading,
});

export default connect(mapStateToProps, { getProfile, deleteProduct })(
	ShowProducts
);
