export const isLoggedIn = (req, res, next) => {
	if (req.session.userId) {
		next();
	} else {
		res.status(401).json({
			err: "sorry you are not authenticated to use this feature",
		});
	}
};

export const homeRedirect = (req, res, next) => {
	if (req.session.userId) {
		return res.status(406).json({ err: "You are already logged in!" });
	} else {
		next();
	}
};
