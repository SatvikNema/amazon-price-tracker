const { google } = require("googleapis"),
	OAuth2 = google.auth.OAuth2,
	plus = google.plus("v1"),
	REDIRECT_URL_LOCAL = "http://localhost:5000/oauth/google/callback";

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET } = process.env;

const getOAuthClient = () => {
	return new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, REDIRECT_URL_LOCAL);
};

const getAuthUrl = () => {
	var oauth2Client = getOAuthClient();
	// generate a url that asks permissions for Google+ and Google Calendar scopes ?? doubt
	var scopes = [
		"https://www.googleapis.com/auth/plus.login",
		"email",
		"profile",
		"https://www.googleapis.com/auth/userinfo.profile",
	];

	var url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes, // If you only need one scope you can pass it as string
	});

	return url;
};

module.exports = {
	getAuthUrl,
	getOAuthClient,
};
