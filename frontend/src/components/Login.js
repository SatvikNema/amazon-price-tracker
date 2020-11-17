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
						<div class="form-group">
							<label htmlFor="UN">Username: </label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								name="username"
								id="UN"
								class="form-control ip"
							/>
						</div>
						<div class="form-group">
							<label htmlFor="PW">Password: </label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								name="password"
								id="PW"
								class="form-control ip"
							/>
						</div>
						<div>
							<button
								// class="form-control"
								type="submit"
								onClick={handleSubmit}
								class="btn btn-sm btn-primary"
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default Login;
