const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema({
	email: String,
	name: String,
	password: String,
	facebookUserID: {
		type: String,
		default: ""
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("usersDashboard", userModel);