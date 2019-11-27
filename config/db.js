const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const initDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Mongo Db connected.");
	} catch (error) {
		console.error("Db connection failed.");
		//Exit process with failure
		process.exit(1);
	}
};

module.exports = initDB;
