"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function unfriend(userID, callback) {
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
			uid: userID,
			unref: "bd_friends_tab",
			floc: "friends_tab",
			"nctr[_mod]": "pagelet_timeline_app_collection_" + (ctx.i_userID || ctx.userID) + ":2356318349:2"
		};

		defaultFuncs
			.post(
				"https://www.facebook.com/ajax/profile/removefriendconfirm.php",
				ctx.jar,
				form
			)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error) {
					throw resData;
				}

				return callback(null, true);
			})
			.catch(function (err) {
				log.error("unfriend", err);
				return callback(err);
			});

		return returnPromise;
	};
};
