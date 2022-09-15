module.exports = async function (uriConnect) {
	const mongoose = require("mongoose");

	const threadModel = require("../models/mongodb/thread.js");
	const userModel = require("../models/mongodb/user.js");
	const dashBoardModel = require("../../models/mongodb/userDashBoard.js");

	await mongoose.connect(uriConnect, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	return {
		threadModel,
		userModel,
		dashBoardModel
	};
};