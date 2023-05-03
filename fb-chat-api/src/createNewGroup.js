"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function createNewGroup(participantIDs, groupTitle, callback) {
		if (utils.getType(groupTitle) == "Function") {
			callback = groupTitle;
			groupTitle = null;
		}

		if (utils.getType(participantIDs) !== "Array") {
			throw { error: "createNewGroup: participantIDs should be an array." };
		}

		if (participantIDs.length < 2) {
			throw { error: "createNewGroup: participantIDs should have at least 2 IDs." };
		}

		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			callback = function (err, threadID) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(threadID);
			};
		}

		const pids = [];
		for (const n in participantIDs) {
			pids.push({
				fbid: participantIDs[n]
			});
		}
		pids.push({ fbid: ctx.i_userID || ctx.userID });

		const form = {
			fb_api_caller_class: "RelayModern",
			fb_api_req_friendly_name: "MessengerGroupCreateMutation",
			av: ctx.i_userID || ctx.userID,
			//This doc_id is valid as of January 11th, 2020
			doc_id: "577041672419534",
			variables: JSON.stringify({
				input: {
					entry_point: "jewel_new_group",
					actor_id: ctx.i_userID || ctx.userID,
					participants: pids,
					client_mutation_id: Math.round(Math.random() * 1024).toString(),
					thread_settings: {
						name: groupTitle,
						joinable_mode: "PRIVATE",
						thread_image_fbid: null
					}
				}
			})
		};

		defaultFuncs
			.post(
				"https://www.facebook.com/api/graphql/",
				ctx.jar,
				form
			)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.errors) {
					throw resData;
				}
				return callback(null, resData.data.messenger_group_thread_create.thread.thread_key.thread_fbid);
			})
			.catch(function (err) {
				log.error("createNewGroup", err);
				return callback(err);
			});

		return returnPromise;
	};
};
