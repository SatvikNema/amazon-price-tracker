import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser, logoutUser } from "../utils";
// import Modal from "./Modal";

const Navbar = (props) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState(null);
	// const [showModal, setShowModal] = useState(false);
	// const [modalMessage, setModalMessage] = useState("");

	// const closeModal = () => {
	// 	setShowModal(false);
	// 	setModalMessage("");
	// };

	const fetchUser = async () => {
		try {
			const user = await getUser();
			if (user) {
				setLoggedIn(true);
				setUsername(user);
				console.log(user);
			}
		} catch (e) {
			console.log("Erorr occured: " + e);
		}
	};
	useEffect(() => {
		console.log("effect");
		fetchUser();

		// Method 2
		// const fetchUser = async () => {
		// 	try {
		// 		const res = await fetch(props.baseURL + "/getUser", {
		// 			credentials: "include",
		// 		});
		// 		const response = await res.json();
		// 		if (response.username) {
		// 			setLoggedIn(true);
		// 			setUsername(response.username);
		// 		}
		// 	} catch (e) {
		// 		console.log("Erorroccured: " + e);
		// 	}
		// };
		// fetchUser();

		// Method 3
		// fetch(props.baseURL + "/getUser", { credentials: "include" })
		// 	.then((res) => res.json())
		// 	.then((jsonResponse) => {
		// 		if (jsonResponse.username) {
		// 			setLoggedIn(true);
		// 			setUsername(jsonResponse.username);
		// 		}
		// 	});
	}, [props.baseURL]);

	const logoutCurrentUser = async () => {
		try {
			const logout = await logoutUser();
			if (logout.ok) {
				setLoggedIn(false);
				setUsername(null);
				window.location.reload();
			} else {
				const response = await logout.json();
				throw new Error(response);
			}
		} catch (e) {
			console.log("Error occured: " + e);
		}
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
				<div class="collapse navbar-collapse" id="navbarNav">
					{loggedIn ? (
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
									<strong>{username} is singed in</strong>
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
							{/* <li class="nav-item active">
								<Link class="nav-link" to="/">
									Home<span class="sr-only">(current)</span>
								</Link>
							</li> */}
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
			{/* {showModal && (
				<Modal message={modalMessage} closeModal={closeModal} />
			)} */}
		</div>
	);
};

export default Navbar;
