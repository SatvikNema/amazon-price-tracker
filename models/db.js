const mongoose = require("mongoose"),
	{
		MONGODB_CONNECTION_URI_LOCAL,
		MONGODB_CONNECTION_URI_ATLAS,
	} = process.env;

mongoose.connect(MONGODB_CONNECTION_URI_ATLAS, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

mongoose.connection.once("open", () => {
	console.log("connection with mongoose established");
});

const db = mongoose.connection;

module.exports = db;
