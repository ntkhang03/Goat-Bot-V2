"use strict";

const utils = require("../utils");
const log = require("npmlog");

function formatData(data) {
	const retObj = {};

	for (const prop in data) {
		// eslint-disable-next-line no-prototype-builtins
		if (data.hasOwnProperty(prop)) {
			const innerObj = data[prop];
			retObj[prop] = {
				name: innerObj.name,
				firstName: innerObj.firstName,
				vanity: innerObj.vanity,
				thumbSrc: innerObj.thumbSrc,
				profileUrl: innerObj.uri,
				gender: innerObj.gender,
				type: innerObj.type,
				isFriend: innerObj.is_friend,
				isBirthday: !!innerObj.is_birthday,
				searchTokens: innerObj.searchTokens,
				alternateName: innerObj.alternateName
			};
		}
	}

	return retObj;
}

module.exports = function (defaultFuncs, api, ctx) {
	return function getUserInfo(id, callback) {
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

		if (utils.getType(id) !== "Array") {
			id = [id];
		}

		const form = {};
		id.map(function (v, i) {
			form["ids[" + i + "]"] = v;
		});
		defaultFuncs
			.post("https://www.facebook.com/chat/user_info/", ctx.jar, form)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error) {
					throw resData;
				}
				return callback(null, formatData(resData.payload.profiles));
			})
			.catch(function (err) {
				log.error("getUserInfo", err);
				return callback(err);
			});

		return returnPromise;
	};
};
