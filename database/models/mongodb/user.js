const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema({
	userID: {
		type: String,
		unique: true
	},
	name: String,
	gender: Number,
	vanity: String,
	exp: {
		type: Number,
		default: 0
	},
	money: {
		type: Number,
		default: 0
	},
	banned: {
		type: Object,
		default: {}
	},
	settings: {
		type: Object,
		default: {}
	},
	data: {
		type: Object,
		default: {}
	}
}, {
	timestamps: true,
	minimize: false
});

module.exports = mongoose.model("users", userModel);