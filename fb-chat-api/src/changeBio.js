"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function changeBio(bio, publish, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			if (utils.getType(publish) == "Function" || utils.getType(publish) == "AsyncFunction") {
				callback = publish;
			} else {
				callback = function (err) {
					if (err) {
						return rejectFunc(err);
					}
					resolveFunc();
				};
			}
		}

		if (utils.getType(publish) != "Boolean") {
			publish = false;
		}

		if (utils.getType(bio) != "String") {
			bio = "";
			publish = false;
		}

		const form = {
			fb_api_caller_class: "RelayModern",
			fb_api_req_friendly_name: "ProfileCometSetBioMutation",
			// This doc_is is valid as of May 23, 2020
			doc_id: "2725043627607610",
			variables: JSON.stringify({
				input: {
					bio: bio,
					publish_bio_feed_story: publish,
					actor_id: ctx.i_userID || ctx.userID,
					client_mutation_id: Math.round(Math.random() * 1024).toString()
				},
				hasProfileTileViewID: false,
				profileTileViewID: null,
				scale: 1
			}),
			av: ctx.i_userID || ctx.userID
		};

		defaultFuncs
			.post(
				"https://www.facebook.com/api/graphql/",
				ctx.jar,
				form
			)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.errors) {
					throw resData;
				}

				return callback();
			})
			.catch(function (err) {
				log.error("changeBio", err);
				return callback(err);
			});

		return returnPromise;
	};
};
