import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getThisUser, registerThisUser } from "../actions/authActions";

const Register = (props) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [inputError, setInputError] = useState(null);

	const handleSubmit = async (e) => {
		setInputError(null);
		try {
			e.preventDefault();
			if (username && email && password) {
				const obj = {
					username,
					password,
					email,
				};
				props.registerThisUser(obj);
			} else {
				throw new Error("All fields are compulsory");
			}
		} catch (e) {
			setInputError(e.message);
		}
	};

	useEffect(() => {
		props.getThisUser();
	}, []);

	return (
		<div>
			{inputError ? (
				<h1>{inputError}</h1>
			) : (
				props.errStatus && <h1>{props.errMsg}</h1>
			)}
			{props.isLoading ? (
				<h1>Getting the user...</h1>
			) : (
				<div>
					{props.isAuthenticated ? (
						<div>
							Your are now logged in.{" "}
							<Link to="/">
								<button>Go to home page</button>
							</Link>
						</div>
					) : (
						<div>
							<h1>Register page</h1>
							<form method="post">
								<div class="form-group">
									<label htmlFor="UN">Username: </label>
									<input
										type="text"
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
										name="username"
										id="UN"
										class="form-control ip"
										required
									/>
								</div>
								<div class="form-group">
									<label htmlFor="EMAIL">Email: </label>
									<input
										type="email"
										value={email}
										required
										onChange={(e) =>
											setEmail(e.target.value)
										}
										name="email"
										id="EMAIL"
										class="form-control ip"
										required
									/>
								</div>
								<div class="form-group">
									<label htmlFor="PW">Password: </label>
									<input
										type="password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										name="password"
										id="PW"
										class="form-control ip"
										required
									/>
								</div>
								<div class="form-group">
									<button
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
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	isLoading: state.auth.isLoading,
	errMsg: state.error.msg,
	errStatus: state.error.status,
});

export default connect(mapStateToProps, { registerThisUser, getThisUser })(
	Register
);
