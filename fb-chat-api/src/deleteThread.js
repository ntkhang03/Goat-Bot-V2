"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function deleteThread(threadOrThreads, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});
		if (!callback) {
			callback = function (err) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc();
			};
		}

		const form = {
			client: "mercury"
		};

		if (utils.getType(threadOrThreads) !== "Array") {
			threadOrThreads = [threadOrThreads];
		}

		for (let i = 0; i < threadOrThreads.length; i++) {
			form["ids[" + i + "]"] = threadOrThreads[i];
		}

		defaultFuncs
			.post(
				"https://www.facebook.com/ajax/mercury/delete_thread.php",
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
				log.error("deleteThread", err);
				return callback(err);
			});

		return returnPromise;
	};
};
