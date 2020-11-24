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
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<Link class="navbar-brand" to="/">
					Amazon Price Tracker
				</Link>
				<button
					class="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse mt-0" id="navbarNav">
					{props.isAuthenticated ? (
						<ul class="navbar-nav ml-auto">
							<li class="nav-item active">
								<Link class="nav-link" to="/addProduct">
									Add Product
									<span class="sr-only">(current)</span>
								</Link>
							</li>
							<li class="nav-item active">
								<Link class="nav-link" to="/productList">
									View product list
									<span class="sr-only">(current)</span>
								</Link>
							</li>
							<li class="nav-item active">
								<a class="nav-link">
									<strong>{props.user} is singed in</strong>
								</a>
							</li>
							<li class="nav-item active">
								<a class="nav-link">
									<button onClick={logoutCurrentUser}>
										Logout
									</button>
								</a>
							</li>
						</ul>
					) : (
						<ul class="navbar-nav ml-auto">
							<li class="nav-item active">
								<Link class="nav-link" to="/login">
									Login<span class="sr-only">(current)</span>
								</Link>
							</li>
							<li class="nav-item active">
								<Link class="nav-link" to="/register">
									Register
									<span class="sr-only">(current)</span>
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
