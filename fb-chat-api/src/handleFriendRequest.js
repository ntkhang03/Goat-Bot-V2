"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function handleFriendRequest(userID, accept, callback) {
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
			fb_api_caller_class: "RelayModern",
			fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
			doc_id: "7303313029748461",
			variables: JSON.stringify({
				input: {
					friend_requester_id: String(userID),
					source: "friends_tab",
					actor_id: ctx.i_userID || ctx.userID,
					client_mutation_id: Math.round(Math.random() * 1024).toString()
				},
				scale: 1,
				refresh_num: 0
			}),
			av: ctx.i_userID || ctx.userID
		};

		defaultFuncs
			.post(
				"https://www.facebook.com/api/graphql/",
				ctx.jar,
				form
			)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error || resData.errors) {
					throw {
						err: resData.payload.err
					};
				}

				return callback(null, resData);
			})
			.catch(function (err) {
				log.error("handleFriendRequest", err);
				return callback(err);
			});

		return returnPromise;
	};
};
