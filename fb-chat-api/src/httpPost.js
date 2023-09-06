"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function httpPost(url, form, customHeader, callback, notAPI) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };

		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (utils.getType(form) == "Function" || utils.getType(form) == "AsyncFunction") {
			callback = form;
			form = {};
		}

		if (utils.getType(customHeader) == "Function" || utils.getType(customHeader) == "AsyncFunction") {
			callback = customHeader;
			customHeader = {};
		}

		customHeader = customHeader || {};

		callback = callback || function (err, data) {
			if (err) return rejectFunc(err);
			resolveFunc(data);
		};

		if (notAPI) {
			utils
				.post(url, ctx.jar, form, ctx.globalOptions, ctx, customHeader)
				.then(function (resData) {
					callback(null, resData.body.toString());
				})
				.catch(function (err) {
					log.error("httpPost", err);
					return callback(err);
				});
		} else {
			defaultFuncs
				.post(url, ctx.jar, form, {}, customHeader)
				.then(function (resData) {
					callback(null, resData.body.toString());
				})
				.catch(function (err) {
					log.error("httpPost", err);
					return callback(err);
				});
		}

		return returnPromise;
	};
};
