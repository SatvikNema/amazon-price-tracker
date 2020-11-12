import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getUser, logoutUser } from "../utils";
// import Modal from "./Modal";

const Navbar = (props) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState(null);
	const history = useHistory();
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
			{loggedIn ? (
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>{username} is singed in</li>
					<li>
						<Link to="/addProduct">Add Product</Link>
					</li>
					<li>
						<Link to="/productList">View product list</Link>
					</li>
					<li>
						<button onClick={logoutCurrentUser}>Logout</button>
					</li>
				</ul>
			) : (
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/login">Login</Link>
					</li>
					<li>
						<Link to="/register">Register</Link>
					</li>
				</ul>
			)}
			{/* {showModal && (
				<Modal message={modalMessage} closeModal={closeModal} />
			)} */}
		</div>
	);
};

export default Navbar;
