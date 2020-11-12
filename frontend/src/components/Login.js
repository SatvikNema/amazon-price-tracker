import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loginUser, getUser } from "../utils";

const Login = (props) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);
	let history = useHistory();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const obj = {
			username,
			password,
		};
		try {
			const loginStatus = await loginUser(obj);
			if (loginStatus.ok) {
				history.go(0);
			} else {
				const response = await loginStatus.json();
				throw new Error(response);
			}
		} catch (e) {
			console.log("Error occured: " + e);
		}
	};

	const fetchUser = async () => {
		try {
			const user = await getUser();
			if (user) {
				setLoggedIn(true);
			}
		} catch (e) {
			console.log("Erorr occured: " + e);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<div>
			{loggedIn ? (
				<div>
					Your are now logged in.{" "}
					<a href="http://localhost:3000/home">
						<button>Go to home page</button>
					</a>
				</div>
			) : (
				<div>
					<h1>Login page</h1>
					<form method="post">
						<label htmlFor="UN">Username: </label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							name="username"
							id="UN"
						/>
						<label htmlFor="PW">Username: </label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							name="password"
							id="PW"
						/>
						<button type="submit" onClick={handleSubmit}>
							Submit
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Login;
