require("dotenv").config();
const express = require("express"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	MongoStore = require("connect-mongo")(session),
	cors = require("cors"),
	path = require("path"),
	productRoutes = require("./routes/product"),
	localAuthRoutes = require("./routes/localAuth"),
	googleAuthRoutes = require("./routes/googleAuth"),
	cronRoute = require("./routes/cronSettings");

const app = express();
app.use(express.json());
const {
	SESSION_NAME,
	SESSION_SECRET,
	PORT = 5000,
	MONGODB_CONNECTION_URI_LOCAL,
	MONGODB_CONNECTION_URI_ATLAS,
	FRONTEND_URL,
} = process.env;

app.use(
	cors({
		credentials: true,
	})
);

mongoose.connect(MONGODB_CONNECTION_URI_LOCAL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

mongoose.connection.once("open", () => {
	console.log("connection with mongoose established");
});

app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: SESSION_SECRET,
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
		}),
		name: SESSION_NAME,
		cookie: {
			maxAge: 1000 * 60 * 60,
		},
	})
);

// Session debugging
app.use((req, res, next) => {
	console.log(req.session);
	console.log("---------------------------");
	next();
});

app.use(productRoutes);
app.use(localAuthRoutes);
app.use(googleAuthRoutes);
app.use(cronRoute);

// Serve static assets (if in production)
if (process.env.NODE_ENV == "production") {
	app.use(express.static("frontend/build"));
	app.get("*", (req, res) => {
		res.sendFile(
			path.resolve(__dirname, "frontend", "build", "index.html")
		);
	});
}

app.listen(PORT, () => {
	console.log("server started...");
});
