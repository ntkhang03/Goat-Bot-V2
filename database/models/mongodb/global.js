const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema({
	key: {
		type: String,
		unique: true
	},
	data: {
		type: Object,
		default: {}
	}
}, {
	timestamps: true,
	minimize: false
});

module.exports = mongoose.model("globals", userModel);