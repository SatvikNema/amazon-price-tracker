import React, { useEffect, useState } from "react";
import { getProductList } from "../utils";

const ShowProducts = (props) => {
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(true);
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
		fetchProducts();
	}, []);
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
								<li key={item._id}>
									<a href={item.link} target="_blank">
										{item.title}
									</a>
									<br />
									Price now (in INR):{" "}
									{item.price[item.price.length - 1].value}
								</li>
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
