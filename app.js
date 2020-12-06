import {} from "dotenv/config";
import express from "express";
import session from "express-session";
import store from "connect-mongo";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/product";
import localAuthRoutes from "./routes/localAuth";
import googleAuthRoutes from "./routes/googleAuth";
import cronRoute from "./routes/cronSettings";
import db from "./models/db";

const app = express(),
	MongoStore = store(session),
	{ SESSION_NAME, SESSION_SECRET, PORT = 5000 } = process.env;

app.use(express.json());

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

app.use("/api", productRoutes);
app.use("/api", localAuthRoutes);
app.use("/api", googleAuthRoutes);
app.use("/api", cronRoute);

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
