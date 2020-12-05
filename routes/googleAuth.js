const router = require("express").Router(),
	{ getAuthUrl } = require("../utils/googleKaKaam"),
	User = require("../models/user"),
	fetch = require("node-fetch"),
	{ homeRedirect } = require("../middleware/authMiddelware");

router.get("/getGoogleAuthURL", (req, res) => {
	const url = getAuthUrl();
	return res.json({ url });
});

router.post("/useAccessToken", homeRedirect, async (req, res) => {
	try {
		const { access_token } = req.body;
		const userProfile = await (
			await fetch(
				`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
			)
		).json();
		if (!userProfile) {
			return res.status(401).json({ err: err.message });
		} else {
			const { email, name } = userProfile;
			const oldUser = await User.findOne({ email });
			if (oldUser && !oldUser.googleUser) {
				return res.status(401).json({
					err:
						"This email is already in use here (using local sign in).",
				});
			} else {
				req.session.googleTokens = { access_token };

				if (!oldUser) {
					const newUser = new User({
						googleUser: true,
						googleUserName: name,
						email,
						items: [],
						emailVerified: true,
					});
					await newUser.save();
					req.session.userId = newUser._id;
					return res.json({
						msg: "User registered - google OAuth",
						username: name,
					});
				} else {
					req.session.userId = oldUser._id;
					res.status(200).json({
						msg: "logged in - google OAuth",
						username: oldUser.googleUserName,
					});
				}
			}
		}
	} catch (e) {
		return res.status(406).json({ err: e.message });
	}
});

module.exports = router;
