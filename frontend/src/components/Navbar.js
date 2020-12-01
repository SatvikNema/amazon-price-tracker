import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getThisUser, logout } from "../actions/authActions";

const Navbar = (props) => {
	useEffect(() => {
		props.getThisUser();
	}, [props.baseURL]);

	const logoutCurrentUser = async () => {
		props.logout();
	};

	return (
		<div>
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<Link className="navbar-brand" to="/">
					Amazon Price Tracker
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse mt-0" id="navbarNav">
					{props.isAuthenticated ? (
						<ul className="navbar-nav ml-auto">
							<li className="nav-item active">
								<Link className="nav-link" to="/addProduct">
									Add Product
									<span className="sr-only">(current)</span>
								</Link>
							</li>
							<li className="nav-item active">
								<Link className="nav-link" to="/productList">
									View product list
									<span className="sr-only">(current)</span>
								</Link>
							</li>
							<li className="nav-item active">
								<a className="nav-link">
									<strong>{props.user} is singed in</strong>
								</a>
							</li>
							<li className="nav-item active">
								<a className="nav-link">
									<button onClick={logoutCurrentUser}>
										Logout
									</button>
								</a>
							</li>
						</ul>
					) : (
						<ul className="navbar-nav ml-auto">
							<li className="nav-item active">
								<Link className="nav-link" to="/login">
									Login
									<span className="sr-only">(current)</span>
								</Link>
							</li>
							<li className="nav-item active">
								<Link className="nav-link" to="/register">
									Register
									<span className="sr-only">(current)</span>
								</Link>
							</li>
						</ul>
					)}
				</div>
			</nav>
			<br />
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
	isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps, { getThisUser, logout })(Navbar);
