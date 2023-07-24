"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	/**
	 * Refreshes the fb_dtsg and jazoest values.
	 * @param {Function} callback
	 * @returns {Promise}
	 * @description if you don't update the value of fb_dtsg and jazoest for a long time an error "Please try closing and re-opening your browser window" will appear
	 * @description you should refresh it every 48h or less
	 */
	return function refreshFb_dtsg(obj, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (utils.getType(obj) === "Function" || utils.getType(obj) === "AsyncFunction") {
			callback = obj;
			obj = {};
		}

		if (!obj) {
			obj = {};
		}

		if (utils.getType(obj) !== "Object") {
			throw new utils.CustomError("the first parameter must be an object or a callback function");
		}

		if (!callback) {
			callback = function (err, friendList) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(friendList);
			};
		}

		if (Object.keys(obj).length == 0) {
			utils
				.get('https://m.facebook.com/', ctx.jar, null, ctx.globalOptions, { noRef: true })
				.then(function (resData) {
					const html = resData.body;
					const fb_dtsg = utils.getFrom(html, 'name="fb_dtsg" value="', '"');
					const jazoest = utils.getFrom(html, 'name="jazoest" value="', '"');
					if (!fb_dtsg) {
						throw new utils.CustomError("Could not find fb_dtsg in HTML after requesting https://www.facebook.com/");
					}
					ctx.fb_dtsg = fb_dtsg;
					ctx.jazoest = jazoest;
					callback(null, {
						data: {
							fb_dtsg: fb_dtsg,
							jazoest: jazoest
						},
						message: "refreshed fb_dtsg and jazoest"
					});
				})
				.catch(function (err) {
					log.error("refreshFb_dtsg", err);
					return callback(err);
				});
		}
		else {
			Object.keys(obj).forEach(function (key) {
				ctx[key] = obj[key];
			});
			callback(null, {
				data: obj,
				message: "refreshed " + Object.keys(obj).join(", ")
			});
		}

		return returnPromise;
	};
};
