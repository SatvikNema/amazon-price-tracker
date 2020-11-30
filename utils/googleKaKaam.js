const { google } = require("googleapis"),
	OAuth2 = google.auth.OAuth2,
	REDIRECT_URL_LOCAL = "http://localhost:5000/oauth/google/callback";

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET } = process.env;

const getOAuthClient = () => {
	return new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, REDIRECT_URL_LOCAL);
};

const getAuthUrl = () => {
	const oauth2Client = getOAuthClient();
	// generate a url that asks permissions for Google+ and Google Calendar scopes ?? doubt
	const scopes = [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	];

	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes,
	});

	return url;
};

module.exports = {
	getAuthUrl,
	getOAuthClient,
};
