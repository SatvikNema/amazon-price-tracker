import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import GoogleSignInButton from "./GoogleSignInButton";

import {
	loginThisUser,
	getThisUser,
	googleSignIn,
} from "../actions/authActions";

const Login = (props) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const obj = {
			username,
			password,
		};
		props.loginThisUser(obj);
	};

	useEffect(() => {
		props.getThisUser();
	}, []);

	const googleResponse = (response) => {
		props.googleSignIn(response.accessToken);
	};
	return (
		<div>
			{props.errStatus && <h1>{props.errMsg}</h1>}
			{props.isLoading && !props.googleAuthURL ? (
				<h1>Getting the user...</h1>
			) : (
				<div>
					{props.isAuthenticated ? (
						<div>
							Your are now logged in.{" "}
							<Link to="/">
								<button className="btn btn-xl btn-success">
									Go to home page
								</button>
							</Link>
						</div>
					) : (
						<div>
							<h1>Login page</h1>
							<form method="post">
								<div className="form-group">
									<label htmlFor="UN">Username: </label>
									<input
										type="text"
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
										name="username"
										id="UN"
										className="form-control ip"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="PW">Password: </label>
									<input
										type="password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										name="password"
										id="PW"
										className="form-control ip"
									/>
								</div>
								<div>
									<button
										// className="form-control"
										type="submit"
										onClick={handleSubmit}
										className="btn btn-sm btn-primary"
									>
										Submit
									</button>
								</div>
							</form>
							{/* <h4>OR</h4>
							<GoogleSignInButton onSuccess={googleResponse} /> */}
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
	googleSignIn: state.auth.googleSignIn,
});

export default connect(mapStateToProps, {
	loginThisUser,
	getThisUser,
	googleSignIn,
})(Login);
