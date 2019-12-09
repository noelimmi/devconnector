const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
userSchema.methods.generateAuthToken = function() {
	const payload = {
		user: {
			id: this.id,
		},
	};
	const token = jwt.sign(payload, config.get("jwtSecret"), {
		expiresIn: 360000,
	});
	return token;
};

module.exports = User = mongoose.model("User", userSchema);
