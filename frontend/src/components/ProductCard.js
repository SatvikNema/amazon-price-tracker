import React from "react";

const ProductCard = (props) => {
	const item = props.item;
	const properDateFormat = (s) => {
		let d = new Date(s);
		return d.toLocaleString();
	};
	return (
		<div key={item._id} class="col-sm-6 col-md-4 col-lg-4 mb-4">
			<div class="card h-100">
				<img
					src={item.productImage}
					class="card-img product-img"
					alt="..."
				/>
				<div class="card-body">
					<a href={item.link} target="_blank" class="card-link">
						{item.title}
					</a>
					<br />
					<p class="card-text">
						Price (in INR):{" "}
						{item.price[item.price.length - 1].value}
						<br />
						Your target: {item.targetPrice}
					</p>
				</div>
				<div class="card-footer">
					<small class="text-muted">
						<button
							onClick={() => props.updateStatus(item._id)}
							class="btn btn-success mr-2 mb-2"
						>
							Update price!
						</button>
						<button
							onClick={() => props.goToEditPage(item._id)}
							class="btn btn-warning mr-2 mb-2"
						>
							Edit
						</button>
						<button
							onClick={() => props.deleteThisProduct(item._id)}
							class="btn btn-danger mr-2 mb-2"
						>
							Delete
						</button>
						<br />
						Last change in price:
						<em>
							{properDateFormat(
								item.price[item.price.length - 1].date
							)}
						</em>
					</small>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
