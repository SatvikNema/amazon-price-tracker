import React, { useEffect, useState } from "react";
import { getProductList, updatePrice, deleteProduct } from "../utils";
import { useHistory } from "react-router-dom";

const ShowProducts = (props) => {
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(true);
	let load = false,
		history = useHistory();

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const res = await getProductList();
			const response = await res.json();
			if (res.ok) {
				setProfile(response);
				setLoading(false);
			} else {
				throw new Error(response);
			}
		} catch (e) {
			setLoading(null);
			console.log("Error occured: " + e);
		}
	};

	useEffect(() => {
		console.log("effect!");
		fetchProducts();
	}, [load]);

	const updateStatus = async (id) => {
		try {
			const res = await (await updatePrice(id)).json();
			console.log(res);
			if (res.status === 201) {
				history.go(0);
			}
		} catch (e) {
			console.log("Erorr coccured: " + e);
		}
	};

	const properDateFormat = (s) => {
		let d = new Date(s);
		return d.toLocaleString();
	};

	const goToEditPage = (id) => {
		history.push("/editProduct/" + id);
	};

	const deleteThisProduct = async (id) => {
		const res = await deleteProduct(id);
		const response = await res.json();
		console.log(response);
		// if (res.ok) {
		// 	props.history.go(0);
		// }
		await fetchProducts();
	};

	return (
		<div>
			<h1>View all your products here!</h1>
			{loading === true ? (
				<h3>Loading...</h3>
			) : loading === false ? (
				<div>
					<p id="num-products">
						Number of products tracking: {profile.items.length}
					</p>

					<ul>
						{/* <div class="row row-cols-1 row-cols-md-3"> */}
						{/* <div class="card-deck row row-cols-1 row-cols-md-3"> */}
						<div class="row">
							{profile.items.map((item) => {
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
			) : (
				<h1>Chalbe login kar pehele</h1>
			)}
		</div>
	);
};

export default ShowProducts;
