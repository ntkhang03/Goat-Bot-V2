"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function changeNickname(nickname, threadID, participantID, callback) {
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
			nickname: nickname,
			participant_id: participantID,
			thread_or_other_fbid: threadID
		};

		defaultFuncs
			.post(
				"https://www.facebook.com/messaging/save_thread_nickname/?source=thread_settings&dpr=1",
				ctx.jar,
				form
			)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error === 1545014) {
					throw { error: "Trying to change nickname of user isn't in thread" };
				}
				if (resData.error === 1357031) {
					throw {
						error:
							"Trying to change user nickname of a thread that doesn't exist. Have at least one message in the thread before trying to change the user nickname."
					};
				}
				if (resData.error) {
					throw resData;
				}

				return callback();
			})
			.catch(function (err) {
				log.error("changeNickname", err);
				return callback(err);
			});

		return returnPromise;
	};
};
