require("dotenv").config();
const express = require("express"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	MongoStore = require("connect-mongo")(session),
	cors = require("cors"),
	productRoutes = require("./routes/product"),
	authRoutes = require("./routes/auth");
cronRoute = require("./routes/cronSettings");

const app = express();
app.use(express.json());
const {
	SESSION_NAME,
	SESSION_SECRET,
	PORT = 5000,
	MONGODB_CONNECTION_URI_LOCAL,
	FRONTEND_URL,
} = process.env;

app.use(
	cors({
		origin: FRONTEND_URL,
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
// app.use((req, res, next) => {
// 	console.log(req.session);
// 	console.log("---------------------------");
// 	next();
// });

app.use(productRoutes);
app.use(authRoutes);
app.use(cronRoute);

app.listen(PORT, () => {
	console.log("server started...");
});