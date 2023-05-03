"use strict";

const utils = require("../utils");
const log = require("npmlog");
const bluebird = require("bluebird");

module.exports = function (defaultFuncs, api, ctx) {
	function handleUpload(image, callback) {
		const uploads = [];

		const form = {
			profile_id: ctx.i_userID || ctx.userID,
			photo_source: 57,
			av: ctx.i_userID || ctx.userID,
			file: image
		};

		uploads.push(
			defaultFuncs
				.postFormData(
					"https://www.facebook.com/profile/picture/upload/",
					ctx.jar,
					form,
					{}
				)
				.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
				.then(function (resData) {
					if (resData.error) {
						throw resData;
					}
					return resData;
				})
		);

		// resolve all promises
		bluebird
			.all(uploads)
			.then(function (resData) {
				callback(null, resData);
			})
			.catch(function (err) {
				log.error("handleUpload", err);
				return callback(err);
			});
	}

	return function changeAvatar(image, caption = "", timestamp = null, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!timestamp && utils.getType(caption) === "Number") {
			timestamp = caption;
			caption = "";
		}

		if (!timestamp && !callback && (utils.getType(caption) == "Function" || utils.getType(caption) == "AsyncFunction")) {
			callback = caption;
			caption = "";
			timestamp = null;
		}

		if (!callback) callback = function (err, data) {
			if (err) {
				return rejectFunc(err);
			}
			resolveFunc(data);
		};

		if (!utils.isReadableStream(image))
			return callback("Image is not a readable stream");

		handleUpload(image, function (err, payload) {
			if (err) {
				return callback(err);
			}

			const form = {
				av: ctx.i_userID || ctx.userID,
				fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
				fb_api_caller_class: "RelayModern",
				doc_id: "5066134240065849",
				variables: JSON.stringify({
					input: {
						caption,
						existing_photo_id: payload[0].payload.fbid,
						expiration_time: timestamp,
						profile_id: ctx.i_userID || ctx.userID,
						profile_pic_method: "EXISTING",
						profile_pic_source: "TIMELINE",
						scaled_crop_rect: {
							height: 1,
							width: 1,
							x: 0,
							y: 0
						},
						skip_cropping: true,
						actor_id: ctx.i_userID || ctx.userID,
						client_mutation_id: Math.round(Math.random() * 19).toString()
					},
					isPage: false,
					isProfile: true,
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
					return callback(null, resData[0].data.profile_picture_set);
				})
				.catch(function (err) {
					log.error("changeAvatar", err);
					return callback(err);
				});
		});

		return returnPromise;
	};
};
