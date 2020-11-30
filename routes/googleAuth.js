const router = require("express").Router(),
	{ getAuthUrl, getOAuthClient } = require("../utils/googleKaKaam"),
	{ google } = require("googleapis"),
	User = require("../models/user");

router.get("/getGoogleAuthURL", (req, res) => {
	const url = getAuthUrl();
	return res.json({ url });
});

router.get("/oauth/google/callback", async (req, res) => {
	try {
		const oauth2Client = getOAuthClient(),
			code = req.query.code;
		const response = await oauth2Client.getToken(code);
		if (response.tokens) {
			oauth2Client.setCredentials(response.tokens);

			const oauth2 = google.oauth2({
				auth: oauth2Client,
				version: "v2",
			});
			const userProfile = await oauth2.userinfo.get();
			if (!userProfile) {
				return res.status(401).json({ err: err.message });
			} else {
				const { email, name } = userProfile.data;
				console.log({ email, name });
				const oldUser = await User.findOne({ email });
				if (oldUser && !oldUser.googleUser) {
					return res.status(401).json({
						err:
							"This email is already in use here (using local sign in).",
					});
				} else {
					req.session.googleTokens = response.tokens;

					if (!oldUser) {
						const newUser = new User({
							googleUser: true,
							googleUserName: name,
							email,
							items: [],
						});
						await newUser.save();
						req.session.userId = newUser._id;
						return res.json({
							msg: "User registered - google OAuth",
						});
					} else {
						req.session.userId = oldUser._id;
						res.status(200).json({
							msg: "logged in - google OAuth",
						});
					}
				}
			}
		} else {
			res.status(401).json({ err: "Nahi hua login: " + e.message });
		}
	} catch (e) {
		return res.status(406).json({ err: e.message });
	}
});

router.get("/registerGoogleUser", async (req, res) => {
	try {
		const oauth2Client = getOAuthClient();
		oauth2Client.setCredentials(req.session.googleTokens);
		const oauth2 = google.oauth2({
			auth: oauth2Client,
			version: "v2",
		});
		const response = await oauth2.userinfo.get();
		if (!response) {
			return res.status(401).json({ err: err.message });
		} else {
			const { email, name } = response.data;
			console.log({ email, name });
			const oldUser = await User.findOne({ email });
			if (oldUser) {
				return res
					.status(401)
					.json({ err: "This email is already in use here." });
			}
			const newUser = new User({
				googleUser: true,
				googleUserName: name,
				email,
				items: [],
			});
			return res.json({ msg: "User registered" });
		}
	} catch (e) {
		return res.status(406).json({ err: e.message });
	}
});

router.get("/loginGoogleUser", async (req, res) => {
	try {
	} catch (e) {
		return res.status(406).json({ err: e.message });
	}
});

// router.get("/logoutGoogleUser");

module.exports = router;
