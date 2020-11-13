import React, { useEffect, useState } from "react";
import { getProductList, updatePrice, deleteProduct } from "../utils";
import { useHistory } from "react-router-dom";

const ShowProducts = (props) => {
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(true);
	const load = false,
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
		if (res.ok) {
			props.history.go(0);
		}
	};

	return (
		<div>
			<h1>View all your products here!</h1>
			{loading === true ? (
				<h3>Loading...</h3>
			) : loading === false ? (
				<div>
					Number of products tracking: {profile.items.length}
					<ul>
						{profile.items.map((item) => {
							return (
								<div key={item._id}>
									<li>
										<a href={item.link} target="_blank">
											{item.title}
										</a>
										<br />
										Price (in INR):{" "}
										{
											item.price[item.price.length - 1]
												.value
										}
										<br />
										You want in it: {item.targetPrice}
										<br />
										checking in (min): {item.checkInMins}
										<br />
										<button
											onClick={() =>
												updateStatus(item._id)
											}
										>
											Update price!
										</button>
										<button
											onClick={() =>
												goToEditPage(item._id)
											}
										>
											Edit
										</button>
										<button
											onClick={() =>
												deleteThisProduct(item._id)
											}
										>
											Delete
										</button>
										<br />
										<em>
											(Last change in price:
											{properDateFormat(
												item.price[
													item.price.length - 1
												].date
											)}
											)
										</em>
									</li>
									<br />
								</div>
							);
						})}
					</ul>
				</div>
			) : (
				<h1>Chalbe login kar pehele</h1>
			)}
		</div>
	);
};

export default ShowProducts;
