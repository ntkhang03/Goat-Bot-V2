"use strict";

const utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
	return function addExternalModule(moduleObj) {
		if (utils.getType(moduleObj) == "Object") {
			for (const apiName in moduleObj) {
				if (utils.getType(moduleObj[apiName]) == "Function") {
					api[apiName] = moduleObj[apiName](defaultFuncs, api, ctx);
				} else {
					throw new Error(`Item "${apiName}" in moduleObj must be a function, not ${utils.getType(moduleObj[apiName])}!`);
				}
			}
		} else {
			throw new Error(`moduleObj must be an object, not ${utils.getType(moduleObj)}!`);
		}
	};
};
