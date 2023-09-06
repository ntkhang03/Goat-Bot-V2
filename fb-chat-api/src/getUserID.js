"use strict";

const utils = require("../utils");
const log = require("npmlog");

function formatData(data) {
	return {
		userID: utils.formatID(data.uid.toString()),
		photoUrl: data.photo,
		indexRank: data.index_rank,
		name: data.text,
		isVerified: data.is_verified,
		profileUrl: data.path,
		category: data.category,
		score: data.score,
		type: data.type
	};
}

module.exports = function (defaultFuncs, api, ctx) {
	return function getUserID(name, callback) {
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
			value: name.toLowerCase(),
			viewer: ctx.i_userID || ctx.userID,
			rsp: "search",
			context: "search",
			path: "/home.php",
			request_id: utils.getGUID()
		};

		defaultFuncs
			.get("https://www.facebook.com/ajax/typeahead/search.php", ctx.jar, form)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error) {
					throw resData;
				}

				const data = resData.payload.entries;

				callback(null, data.map(formatData));
			})
			.catch(function (err) {
				log.error("getUserID", err);
				return callback(err);
			});

		return returnPromise;
	};
};
