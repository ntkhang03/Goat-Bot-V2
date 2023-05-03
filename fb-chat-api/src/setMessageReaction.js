"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function setMessageReaction(reaction, messageID, callback, forceCustomReaction) {
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

		switch (reaction) {
			case "\uD83D\uDE0D": //:heart_eyes:
			case "\uD83D\uDE06": //:laughing:
			case "\uD83D\uDE2E": //:open_mouth:
			case "\uD83D\uDE22": //:cry:
			case "\uD83D\uDE20": //:angry:
			case "\uD83D\uDC4D": //:thumbsup:
			case "\uD83D\uDC4E": //:thumbsdown:
			case "\u2764": //:heart:
			case "\uD83D\uDC97": //:glowingheart:
			case "":
				//valid
				break;
			case ":heart_eyes:":
			case ":love:":
				reaction = "\uD83D\uDE0D";
				break;
			case ":laughing:":
			case ":haha:":
				reaction = "\uD83D\uDE06";
				break;
			case ":open_mouth:":
			case ":wow:":
				reaction = "\uD83D\uDE2E";
				break;
			case ":cry:":
			case ":sad:":
				reaction = "\uD83D\uDE22";
				break;
			case ":angry:":
				reaction = "\uD83D\uDE20";
				break;
			case ":thumbsup:":
			case ":like:":
				reaction = "\uD83D\uDC4D";
				break;
			case ":thumbsdown:":
			case ":dislike:":
				reaction = "\uD83D\uDC4E";
				break;
			case ":heart:":
				reaction = "\u2764";
				break;
			case ":glowingheart:":
				reaction = "\uD83D\uDC97";
				break;
			default:
				if (forceCustomReaction) {
					break;
				}
				return callback({ error: "Reaction is not a valid emoji." });
		}

		const variables = {
			data: {
				client_mutation_id: ctx.clientMutationId++,
				actor_id: ctx.i_userID || ctx.userID,
				action: reaction == "" ? "REMOVE_REACTION" : "ADD_REACTION",
				message_id: messageID,
				reaction: reaction
			}
		};

		const qs = {
			doc_id: "1491398900900362",
			variables: JSON.stringify(variables),
			dpr: 1
		};

		defaultFuncs
			.postFormData(
				"https://www.facebook.com/webgraphql/mutation/",
				ctx.jar,
				{},
				qs
			)
			.then(utils.parseAndCheckLogin(ctx.jar, defaultFuncs))
			.then(function (resData) {
				if (!resData) {
					throw { error: "setReaction returned empty object." };
				}
				if (resData.error) {
					throw resData;
				}
				callback(null);
			})
			.catch(function (err) {
				log.error("setReaction", err);
				return callback(err);
			});

		return returnPromise;
	};
};
