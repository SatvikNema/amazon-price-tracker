import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import User from "../models/user";
import db from "../models/db";
import { homeRedirect, isLoggedIn } from "../middleware/authMiddelware";
import { sendVerificationEmail } from "../utils/notifications";

const validateEmail = (email) => {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};

router.post("/register", homeRedirect, async (req, res) => {
	try {
		const { username, password, email } = req.body;
		if (!username || !password || !email) {
			return res.status(401).json({ err: "All fields are compulsory" });
		}
		if (!validateEmail(email)) {
			return res.status(401).json({ err: "Email invalid" });
		}
		const user = await User.findOne({
			$or: [{ username }, { email }],
		});
		if (user) {
			return res.status(404).json({ err: "This user already exists" });
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({
				username,
				password: hashedPassword,
				email,
				items: [],
			});
			req.session.userId = newUser._id;
			await newUser.save();
			// send verification email
			const verificationLink =
				process.env.HOSTED_DOMAIN_HEROKU +
				"/api/verifyEmail/" +
				req.session.id +
				"/" +
				email;
			sendVerificationEmail(email, verificationLink);
			return res.status(201).json({
				msg: "Registered! Now please verify your email",
				username,
			});
		}
	} catch (e) {
		res.status(406).json({ err: e.message + "lol wtf" });
	}
});

router.get("/verifyEmail/:sessionID/:email", async (req, res) => {
	try {
		const { sessionID, email } = req.params;
		const sessionObject = await db
			.collection("sessions")
			.find({
				_id: sessionID,
			})
			.toArray();
		const { userId } = JSON.parse(sessionObject[0].session);

		if (!userId) {
			const deletedUser = await User.findOneAndRemove({
				email,
			});
			return res.status(401).json({
				err:
					"Sorry the link is invalid, or has been expired. Try registering again",
			});
		}
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ err: "user not found" });
		}
		if (user.emailVerified) {
			return res.json({ err: "The link has already been used." });
		} else {
			user.emailVerified = true;
			await user.save();
			return res.json({
				msg: "Email is verified. Now you can close this tab.",
			});
			// return res.redirect("/");
		}
	} catch (e) {
		res.status(406).json({ err: e.message });
	}
});

router.post("/login", homeRedirect, async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({
			username,
		});
		if (!user) {
			return res.status(404).json({ err: "This user does not exist" });
		} else if (user.googleUser) {
			return res.status(401).json({
				err: "This user has an account through google sing in",
			});
		} else {
			const matched = await bcrypt.compare(password, user.password);
			if (matched) {
				req.session.userId = user._id;

				return res
					.status(200)
					.json({ msg: "Logged in!", username: user.username });
			} else {
				return res.status(401).json({ err: "Wrong password" });
			}
		}
	} catch (e) {
		res.status(406).json({ err: e.message });
	}
});

router.get("/getUser", async (req, res) => {
	if (req.session.userId) {
		const user = await User.findById(req.session.userId);
		if (user) {
			if (user.googleUser) {
				return res.json({ username: user.googleUserName });
			} else {
				return res.json({ username: user.username });
			}
		} else {
			return res.status(404).json({ username: null });
		}
	} else {
		return res.status(404).json({ username: null });
	}
});

router.get("/stopGettingEmails", isLoggedIn, async (req, res) => {
	try {
		const user = await User.findById(req.session.userId);
		user.recieveEmails = false;
		await user.save();
		res.status(200).json({ msg: "unsubsribed from the emailing service" });
	} catch (e) {
		return res.status(406).json({ err: e.message });
	}
});

router.get("/startGettingEmails", isLoggedIn, async (req, res) => {
	try {
		const user = await User.findById(req.session.userId);
		user.recieveEmails = true;
		await user.save();
		res.status(200).json({ msg: "subsribed to the emailing service" });
	} catch (e) {
		return res.status(406).json({ err: e.message });
	}
});

router.get("/logout", isLoggedIn, (req, res) => {
	try {
		req.session.destroy((err) => {
			res.clearCookie(process.env.SESSION_NAME);
			return res
				.status(200)
				.json({ msg: "Logged out. The session was destroyed." });
		});
	} catch (e) {
		return res.status(406).json({ err: e.message });
	}
});

export default router;
