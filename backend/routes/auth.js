const router = require("express").Router(),
	bcrypt = require("bcrypt"),
	User = require("../models/user"),
	{ homeRedirect, isLoggedIn } = require("./utils");

router.post("/register", homeRedirect, async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({
			username,
		});
		if (user) {
			return res.status(404).json("This user already exists");
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({
				username,
				password: hashedPassword,
				items: [],
			});
			req.session.userId = newUser._id;
			await newUser.save();
			return res.status(201).json("Registered!");
		}
	} catch (e) {
		res.status(406).json("Something went wrong: " + e);
	}
});

router.post("/login", homeRedirect, async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({
			username,
		});
		if (!user) {
			return res.status(404).json("This user does not exist");
		} else {
			const matched = await bcrypt.compare(password, user.password);
			if (matched) {
				req.session.userId = user._id;

				return res.status(200).json("Logged in!");
			} else {
				return res.status(401).json("Wrong password");
			}
		}
	} catch (e) {
		res.status(406).json("Something went wrong: " + e);
	}
});

router.get("/getUser", async (req, res) => {
	if (req.session.userId) {
		const user = await User.findById(req.session.userId);
		if (user) return res.json({ username: user.username });
		else {
			return res.status(404).json({ username: null });
		}
	} else {
		return res.status(404).json({ username: null });
	}
});

router.get("/logout", isLoggedIn, (req, res) => {
	try {
		req.session.destroy((err) => {
			res.clearCookie(process.env.SESSION_NAME);
			return res
				.status(200)
				.json("Logged out. The session was destroyed.");
		});
	} catch (e) {
		return res.status(406).json("Something went wrong: " + e);
	}
});

module.exports = router;
