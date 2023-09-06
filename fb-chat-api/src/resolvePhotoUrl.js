"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function resolvePhotoUrl(photoID, callback) {
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

		defaultFuncs
			.get("https://www.facebook.com/mercury/attachments/photo", ctx.jar, {
				photo_id: photoID
			})
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(resData => {
				if (resData.error) {
					throw resData;
				}

				const photoUrl = resData.jsmods.require[0][3][0];

				return callback(null, photoUrl);
			})
			.catch(err => {
				log.error("resolvePhotoUrl", err);
				return callback(err);
			});

		return returnPromise;
	};
};
