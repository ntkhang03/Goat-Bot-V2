"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function addExternalModule(moduleObj) {
		if (utils.getType(moduleObj) == "Object") {
			for (const apiName in moduleObj) {
				if (utils.getType(moduleObj[apiName]) == "Function") {
					api[apiName] = moduleObj[apiName](defaultFuncs, api, ctx, utils, log);
				} else {
					throw new Error(`Item "${apiName}" in moduleObj must be a function, not ${utils.getType(moduleObj[apiName])}!`);
				}
			}
		} else {
			throw new Error(`moduleObj must be an object, not ${utils.getType(moduleObj)}!`);
		}
	};
};

// example usage:
// api.addExternalModule({
// 	getCtx: (defaultFuncs, api, ctx, utils, log) => {
// 		return function getCtx() {
// 			return ctx;
// 		};
// 	}
// });
