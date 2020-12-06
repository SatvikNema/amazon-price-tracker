import mongoose from "mongoose";

const {
	MONGODB_CONNECTION_URI_LOCAL,
	MONGODB_CONNECTION_URI_ATLAS,
} = process.env;

mongoose.connect(MONGODB_CONNECTION_URI_LOCAL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

mongoose.connection.once("open", () => {
	console.log("connection with mongoose established");
});

const db = mongoose.connection;

export default db;
