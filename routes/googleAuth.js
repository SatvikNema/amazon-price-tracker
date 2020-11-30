const router = require("express").Router(),
	{ getAuthUrl, getOAuthClient } = require("../utils/googleKaKaam"),
	{ google } = require("googleapis"),
	plus = google.plus("v1");

router.get("/getGoogleAuthURL", (req, res) => {
	const url = getAuthUrl();
	return res.json({ url });
});

router.get("/oauth/google/callback", (req, res) => {
	console.log("ohhb boii");
	const oauth2Client = getOAuthClient(),
		session = req.session,
		code = req.query.code; // the query param code
	console.log(req.query);
	oauth2Client.getToken(code, (e, tokens) => {
		// Now tokens contains an access_token and an optional refresh_token. Save them.

		if (!e) {
			oauth2Client.setCredentials(tokens);
			//saving the token to current session
			session.tokens = tokens;
			res.status(200).json({ msg: "logged in - google OAuth" });
		} else {
			res.status(401).json({ err: "Nahi hua login: " + e.message });
		}
	});
});

router.get("/googleUserDetails", function (req, res) {
	const oauth2Client = getOAuthClient();
	oauth2Client.setCredentials(req.session.tokens);
	const oauth2 = google.oauth2({
		auth: oauth2Client,
		version: "v2",
	});
	oauth2.userinfo.get(function (err, data) {
		if (err) {
			return res.status(401).json({ err: err.message });
		} else {
			return res.json(data);
		}
	});
});

// router.get("/logoutGoogleUser");

module.exports = router;
