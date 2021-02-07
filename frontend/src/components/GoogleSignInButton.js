import React from "react";
import { GoogleLogin } from "react-google-login";
import { authStuff } from "../config";

const GoogleSignInButton = (props) => {
	return (
		<div>
			<GoogleLogin
				clientId={authStuff.GOOGLE_CLIENT_ID}
				buttonText="Login"
				onSuccess={props.onSuccess}
				onFailure={props.onSuccess}
				autoload={false}
			/>
		</div>
	);
};

export default GoogleSignInButton;
