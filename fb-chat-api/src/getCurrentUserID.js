"use strict";

module.exports = function (defaultFuncs, api, ctx) {
	return function getCurrentUserID() {
		return ctx.i_userID || ctx.userID;
	};
};
