import React from "react";
import { connect } from "react-redux";
const Home = (props) => {
	return (
		<div>
			<h1>Home page!</h1>
			{props.isAuthenticated ? (
				<h3>Go to "add product" to get started</h3>
			) : (
				<h3>Please login/register first</h3>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(Home);
