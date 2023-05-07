/**
 * @fix by NTKhang
 * update as Thursday, 10 February 2022
 * do not remove the author name to get more updates
 */

"use strict";

const utils = require("../utils");
const log = require("npmlog");

function formatData(resData) {
	return {
		viewer_feedback_reaction_info: resData.feedback_react.feedback.viewer_feedback_reaction_info,
		supported_reactions: resData.feedback_react.feedback.supported_reactions,
		top_reactions: resData.feedback_react.feedback.top_reactions.edges,
		reaction_count: resData.feedback_react.feedback.reaction_count
	};
}

module.exports = function (defaultFuncs, api, ctx) {
	return function setPostReaction(postID, type, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			if (utils.getType(type) === "Function" || utils.getType(type) === "AsyncFunction") {
				callback = type;
				type = 0;
			}
			else {
				callback = function (err, data) {
					if (err) {
						return rejectFunc(err);
					}
					resolveFunc(data);
				};
			}
		}

		const map = {
			unlike: 0,
			like: 1,
			heart: 2,
			love: 16,
			haha: 4,
			wow: 3,
			sad: 7,
			angry: 8
		};

		if (utils.getType(type) !== "Number" && utils.getType(type) === "String") {
			type = map[type.toLowerCase()];
		}

		if (utils.getType(type) !== "Number" && utils.getType(type) !== "String") {
			throw {
				error: "setPostReaction: Invalid reaction type"
			};
		}

		if (type != 0 && !type) {
			throw {
				error: "setPostReaction: Invalid reaction type"
			};
		}

		const form = {
			av: ctx.i_userID || ctx.userID,
			fb_api_caller_class: "RelayModern",
			fb_api_req_friendly_name: "CometUFIFeedbackReactMutation",
			doc_id: "4769042373179384",
			variables: JSON.stringify({
				input: {
					actor_id: ctx.i_userID || ctx.userID,
					feedback_id: (new Buffer("feedback:" + postID)).toString("base64"),
					feedback_reaction: type,
					feedback_source: "OBJECT",
					is_tracking_encrypted: true,
					tracking: [],
					session_id: "f7dd50dd-db6e-4598-8cd9-561d5002b423",
					client_mutation_id: Math.round(Math.random() * 19).toString()
				},
				useDefaultActor: false,
				scale: 3
			})
		};

		defaultFuncs
			.post("https://www.facebook.com/api/graphql/", ctx.jar, form)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.errors) {
					throw resData;
				}
				return callback(null, formatData(resData.data));
			})
			.catch(function (err) {
				log.error("setPostReaction", err);
				return callback(err);
			});

		return returnPromise;
	};
};