require("dotenv").config();
const express = require("express"),
	db = require("./models/db"),
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
const { SESSION_NAME, SESSION_SECRET, PORT = 5000 } = process.env;

app.use(
	cors({
		credentials: true,
	})
);

app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: SESSION_SECRET,
		store: new MongoStore({
			mongooseConnection: db,
		}),
		name: SESSION_NAME,
		cookie: {
			maxAge: 1000 * 60 * 60,
		},
	})
);

// Session debugging

// app.use((req, res, next) => {
// 	console.log(req.session.id);
//  db.collection("sessions")
// 	.find({ _id: "Zx41ehEQh0Ve58lcAtLn3Rjt955UKGIt" })
// 		.toArray((err, stuff) => {
// 			if (err) console.log(err);
// 			else console.log(stuff);
// 		});
// 	console.log("---------------------------");
// 	next();
// });

// app.use((req, res, next) => {
// 	console.log(req.get("host"));
// 	console.log(req.hostname);
// 	return next();
// });

app.use("/api", productRoutes);
app.use("/api", localAuthRoutes);
app.use("/api", googleAuthRoutes);
app.use("/api", cronRoute);

app.use(express.static("frontend/build"));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});
// if (process.env.NODE_ENV == "production") {
// 	app.use(express.static("frontend/build"));
// 	app.get("*", (req, res) => {
// 		res.sendFile(
// 			path.resolve(__dirname, "frontend", "build", "index.html")
// 		);
// 	});

// }

app.listen(PORT, () => {
	console.log("server started...");
});
