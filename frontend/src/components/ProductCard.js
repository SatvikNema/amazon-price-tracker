import React from "react";

const ProductCard = (props) => {
	const item = props.item;
	const properDateFormat = (s) => {
		let d = new Date(s);
		return d.toLocaleString();
	};
	return (
		<div key={item._id} className="col-sm-6 col-md-4 col-lg-4 mb-4">
			<div className="card h-100">
				<img
					src={item.productImage}
					className="card-img product-img"
					alt="..."
				/>
				<div className="card-body">
					<a href={item.link} target="_blank" className="card-link">
						{item.title}
					</a>
					<br />
					<p className="card-text">
						Price (in INR):{" "}
						{item.price[item.price.length - 1].value}
						<br />
						Your target: {item.targetPrice}
					</p>
				</div>
				<div className="card-footer">
					<small className="text-muted">
						<button
							onClick={() => props.updateStatus(item._id)}
							className="btn btn-success mr-2 mb-2"
						>
							Update price!
						</button>
						<button
							onClick={() => props.goToEditPage(item._id)}
							className="btn btn-warning mr-2 mb-2"
						>
							Edit
						</button>
						<button
							onClick={() => props.deleteThisProduct(item._id)}
							className="btn btn-danger mr-2 mb-2"
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
