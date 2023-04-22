"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function handleMessageRequest(threadID, accept, callback) {
		if (utils.getType(accept) !== "Boolean") {
			throw {
				error: "Please pass a boolean as a second argument."
			};
		}

		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			callback = function (err, friendList) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(friendList);
			};
		}

		const form = {
			client: "mercury"
		};

		if (utils.getType(threadID) !== "Array") {
			threadID = [threadID];
		}

		const messageBox = accept ? "inbox" : "other";

		for (let i = 0; i < threadID.length; i++) {
			form[messageBox + "[" + i + "]"] = threadID[i];
		}

		defaultFuncs
			.post(
				"https://www.facebook.com/ajax/mercury/move_thread.php",
				ctx.jar,
				form
			)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error) {
					throw resData;
				}

				return callback();
			})
			.catch(function (err) {
				log.error("handleMessageRequest", err);
				return callback(err);
			});

		return returnPromise;
	};
};
