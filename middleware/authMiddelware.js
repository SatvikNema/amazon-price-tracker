const isLoggedIn = (req, res, next) => {
	if (req.session.userId) {
		next();
	} else {
		res.status(401).json(
			"sorry you are not authenticated to use this feature"
		);
	}
};

const homeRedirect = (req, res, next) => {
	if (req.session.userId) {
		res.status(406).json("You are already logged in!");
	} else {
		next();
	}
};

module.exports = {
	isLoggedIn,
	homeRedirect,
};
