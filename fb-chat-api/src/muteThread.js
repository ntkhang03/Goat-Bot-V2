"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	// muteSecond: -1=permanent mute, 0=unmute, 60=one minute, 3600=one hour, etc.
	return function muteThread(threadID, muteSeconds, callback) {
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
			thread_fbid: threadID,
			mute_settings: muteSeconds
		};

		defaultFuncs
			.post(
				"https://www.facebook.com/ajax/mercury/change_mute_thread.php",
				ctx.jar,
				form
			)
			.then(utils.saveCookies(ctx.jar))
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error) {
					throw resData;
				}

				return callback();
			})
			.catch(function (err) {
				log.error("muteThread", err);
				return callback(err);
			});

		return returnPromise;
	};
};
