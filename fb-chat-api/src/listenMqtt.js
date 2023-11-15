/* eslint-disable no-redeclare */
"use strict";
const utils = require("../utils");
const log = require("npmlog");
const mqtt = require('mqtt');
const websocket = require('websocket-stream');
const HttpsProxyAgent = require('https-proxy-agent');
const EventEmitter = require('events');

const identity = function () { };

const topics = [
	"/legacy_web",
	"/webrtc",
	"/rtc_multi",
	"/onevc",
	"/br_sr", //Notification
	//Need to publish /br_sr right after this
	"/sr_res",
	"/t_ms",
	"/thread_typing",
	"/orca_typing_notifications",
	"/notify_disconnect",
	//Need to publish /messenger_sync_create_queue right after this
	"/orca_presence",
	//Will receive /sr_res right here.

	"/legacy_web_mtouch"
	// "/inbox",
	// "/mercury",
	// "/messaging_events",
	// "/orca_message_notifications",
	// "/pp",
	// "/webrtc_response",
];

function listenMqtt(defaultFuncs, api, ctx, globalCallback) {
	//Don't really know what this does but I think it's for the active state?
	//TODO: Move to ctx when implemented
	const chatOn = ctx.globalOptions.online;
	const foreground = false;

	const sessionID = Math.floor(Math.random() * 9007199254740991) + 1;
	const username = {
		u: ctx.i_userID || ctx.userID,
		s: sessionID,
		chat_on: chatOn,
		fg: foreground,
		d: utils.getGUID(),
		ct: "websocket",
		//App id from facebook
		aid: "219994525426954",
		mqtt_sid: "",
		cp: 3,
		ecp: 10,
		st: [],
		pm: [],
		dc: "",
		no_auto_fg: true,
		gas: null,
		pack: [],
		a: ctx.globalOptions.userAgent,
		aids: null
	};
	const cookies = ctx.jar.getCookies("https://www.facebook.com").join("; ");

	let host;
	if (ctx.mqttEndpoint) {
		host = `${ctx.mqttEndpoint}&sid=${sessionID}`;
	} else if (ctx.region) {
		host = `wss://edge-chat.facebook.com/chat?region=${ctx.region.toLocaleLowerCase()}&sid=${sessionID}`;
	} else {
		host = `wss://edge-chat.facebook.com/chat?sid=${sessionID}`;
	}

	const options = {
		clientId: "mqttwsclient",
		protocolId: 'MQIsdp',
		protocolVersion: 3,
		username: JSON.stringify(username),
		clean: true,
		wsOptions: {
			headers: {
				'Cookie': cookies,
				'Origin': 'https://www.facebook.com',
				'User-Agent': ctx.globalOptions.userAgent,
				'Referer': 'https://www.facebook.com/',
				'Host': new URL(host).hostname //'edge-chat.facebook.com'
			},
			origin: 'https://www.facebook.com',
			protocolVersion: 13
		},
		keepalive: 10,
		reschedulePings: false
	};

	if (typeof ctx.globalOptions.proxy != "undefined") {
		const agent = new HttpsProxyAgent(ctx.globalOptions.proxy);
		options.wsOptions.agent = agent;
	}

	ctx.mqttClient = new mqtt.Client(_ => websocket(host, options.wsOptions), options);

	const mqttClient = ctx.mqttClient;

	mqttClient.on('error', function (err) {
		log.error("listenMqtt", err);
		mqttClient.end();
		if (ctx.globalOptions.autoReconnect) {
			listenMqtt(defaultFuncs, api, ctx, globalCallback);
		} else {
			utils.checkLiveCookie(ctx, defaultFuncs)
				.then(res => {
					globalCallback({
						type: "stop_listen",
						error: "Connection refused: Server unavailable"
					}, null);
				})
				.catch(err => {
					globalCallback({
						type: "account_inactive",
						error: "Maybe your account is blocked by facebook, please login and check at https://facebook.com"
					}, null);
				});
		}
	});

	mqttClient.on('close', function () {

	});

	mqttClient.on('connect', function () {
		topics.forEach(function (topicsub) {
			mqttClient.subscribe(topicsub);
		});

		let topic;
		const queue = {
			sync_api_version: 10,
			max_deltas_able_to_process: 1000,
			delta_batch_size: 500,
			encoding: "JSON",
			entity_fbid: ctx.i_userID || ctx.userID
		};

		if (ctx.syncToken) {
			topic = "/messenger_sync_get_diffs";
			queue.last_seq_id = ctx.lastSeqId;
			queue.sync_token = ctx.syncToken;
		} else {
			topic = "/messenger_sync_create_queue";
			queue.initial_titan_sequence_id = ctx.lastSeqId;
			queue.device_params = null;
		}

		mqttClient.publish(topic, JSON.stringify(queue), { qos: 1, retain: false });
		// set status online
		// fix by NTKhang
		mqttClient.publish("/foreground_state", JSON.stringify({ foreground: chatOn }), { qos: 1 });
		mqttClient.publish("/set_client_settings", JSON.stringify({ make_user_available_when_in_foreground: true }), { qos: 1 });

		const rTimeout = setTimeout(function () {
			mqttClient.end();
			listenMqtt(defaultFuncs, api, ctx, globalCallback);
		}, 5000);

		ctx.tmsWait = function () {
			clearTimeout(rTimeout);
			ctx.globalOptions.emitReady ? globalCallback({
				type: "ready",
				error: null
			}) : "";
			delete ctx.tmsWait;
		};

	});

	mqttClient.on('message', function (topic, message, _packet) {
		let jsonMessage = Buffer.isBuffer(message) ? Buffer.from(message).toString() : message;
		try {
			jsonMessage = JSON.parse(jsonMessage);
		}
		catch (e) {
			jsonMessage = {};
		}

		if (jsonMessage.type === "jewel_requests_add") {
			globalCallback(null, {
				type: "friend_request_received",
				actorFbId: jsonMessage.from.toString(),
				timestamp: Date.now().toString()
			});
		}
		else if (jsonMessage.type === "jewel_requests_remove_old") {
			globalCallback(null, {
				type: "friend_request_cancel",
				actorFbId: jsonMessage.from.toString(),
				timestamp: Date.now().toString()
			});
		}
		else if (topic === "/t_ms") {
			if (ctx.tmsWait && typeof ctx.tmsWait == "function") {
				ctx.tmsWait();
			}

			if (jsonMessage.firstDeltaSeqId && jsonMessage.syncToken) {
				ctx.lastSeqId = jsonMessage.firstDeltaSeqId;
				ctx.syncToken = jsonMessage.syncToken;
			}

			if (jsonMessage.lastIssuedSeqId) {
				ctx.lastSeqId = parseInt(jsonMessage.lastIssuedSeqId);
			}

			//If it contains more than 1 delta
			for (const i in jsonMessage.deltas) {
				const delta = jsonMessage.deltas[i];
				parseDelta(defaultFuncs, api, ctx, globalCallback, { "delta": delta });
			}
		} else if (topic === "/thread_typing" || topic === "/orca_typing_notifications") {
			const typ = {
				type: "typ",
				isTyping: !!jsonMessage.state,
				from: jsonMessage.sender_fbid.toString(),
				threadID: utils.formatID((jsonMessage.thread || jsonMessage.sender_fbid).toString())
			};
			(function () { globalCallback(null, typ); })();
		} else if (topic === "/orca_presence") {
			if (!ctx.globalOptions.updatePresence) {
				for (const i in jsonMessage.list) {
					const data = jsonMessage.list[i];
					const userID = data["u"];

					const presence = {
						type: "presence",
						userID: userID.toString(),
						//Convert to ms
						timestamp: data["l"] * 1000,
						statuses: data["p"]
					};
					(function () { globalCallback(null, presence); })();
				}
			}
		}

	});

}

function parseDelta(defaultFuncs, api, ctx, globalCallback, v) {
	if (v.delta.class == "NewMessage") {
		//Not tested for pages
		if (ctx.globalOptions.pageID &&
			ctx.globalOptions.pageID != v.queue
		)
			return;

		(function resolveAttachmentUrl(i) {
			if (i == (v.delta.attachments || []).length) {
				let fmtMsg;
				try {
					fmtMsg = utils.formatDeltaMessage(v);
				} catch (err) {
					return globalCallback({
						error: "Problem parsing message object. Please open an issue at https://github.com/ntkhang03/fb-chat-api/issues.",
						detail: err,
						res: v,
						type: "parse_error"
					});
				}
				if (fmtMsg) {
					if (ctx.globalOptions.autoMarkDelivery) {
						markDelivery(ctx, api, fmtMsg.threadID, fmtMsg.messageID);
					}
				}
				return !ctx.globalOptions.selfListen &&
					(fmtMsg.senderID === ctx.i_userID || fmtMsg.senderID === ctx.userID) ?
					undefined :
					(function () { globalCallback(null, fmtMsg); })();
			} else {
				if (v.delta.attachments[i].mercury.attach_type == "photo") {
					api.resolvePhotoUrl(
						v.delta.attachments[i].fbid,
						(err, url) => {
							if (!err)
								v.delta.attachments[
									i
								].mercury.metadata.url = url;
							return resolveAttachmentUrl(i + 1);
						}
					);
				} else {
					return resolveAttachmentUrl(i + 1);
				}
			}
		})(0);
	}

	if (v.delta.class == "ClientPayload") {
		const clientPayload = utils.decodeClientPayload(
			v.delta.payload
		);

		if (clientPayload && clientPayload.deltas) {
			for (const i in clientPayload.deltas) {
				const delta = clientPayload.deltas[i];
				if (delta.deltaMessageReaction && !!ctx.globalOptions.listenEvents) {
					(function () {
						globalCallback(null, {
							type: "message_reaction",
							threadID: (delta.deltaMessageReaction.threadKey
								.threadFbId ?
								delta.deltaMessageReaction.threadKey.threadFbId : delta.deltaMessageReaction.threadKey
									.otherUserFbId).toString(),
							messageID: delta.deltaMessageReaction.messageId,
							reaction: delta.deltaMessageReaction.reaction,
							senderID: delta.deltaMessageReaction.senderId == 0 ? delta.deltaMessageReaction.userId.toString() : delta.deltaMessageReaction.senderId.toString(),
							userID: (delta.deltaMessageReaction.userId || delta.deltaMessageReaction.senderId).toString()
						});
					})();
				} else if (delta.deltaRecallMessageData && !!ctx.globalOptions.listenEvents) {
					(function () {
						globalCallback(null, {
							type: "message_unsend",
							threadID: (delta.deltaRecallMessageData.threadKey.threadFbId ?
								delta.deltaRecallMessageData.threadKey.threadFbId : delta.deltaRecallMessageData.threadKey
									.otherUserFbId).toString(),
							messageID: delta.deltaRecallMessageData.messageID,
							senderID: delta.deltaRecallMessageData.senderID.toString(),
							deletionTimestamp: delta.deltaRecallMessageData.deletionTimestamp,
							timestamp: delta.deltaRecallMessageData.timestamp
						});
					})();
				} else if (delta.deltaRemoveMessage && !!ctx.globalOptions.listenEvents) {
					(function () {
						globalCallback(null, {
							type: "message_self_delete",
							threadID: (delta.deltaRemoveMessage.threadKey.threadFbId ?
								delta.deltaRemoveMessage.threadKey.threadFbId : delta.deltaRemoveMessage.threadKey
									.otherUserFbId).toString(),
							messageID: delta.deltaRemoveMessage.messageIds.length == 1 ? delta.deltaRemoveMessage.messageIds[0] : delta.deltaRemoveMessage.messageIds,
							senderID: api.getCurrentUserID(),
							deletionTimestamp: delta.deltaRemoveMessage.deletionTimestamp,
							timestamp: delta.deltaRemoveMessage.timestamp
						});
					})();
				}
				else if (delta.deltaMessageReply) {
					//Mention block - #1
					let mdata =
						delta.deltaMessageReply.message === undefined ? [] :
							delta.deltaMessageReply.message.data === undefined ? [] :
								delta.deltaMessageReply.message.data.prng === undefined ? [] :
									JSON.parse(delta.deltaMessageReply.message.data.prng);
					let m_id = mdata.map(u => u.i);
					let m_offset = mdata.map(u => u.o);
					let m_length = mdata.map(u => u.l);

					const mentions = {};

					for (let i = 0; i < m_id.length; i++) {
						mentions[m_id[i]] = (delta.deltaMessageReply.message.body || "").substring(
							m_offset[i],
							m_offset[i] + m_length[i]
						);
					}
					//Mention block - 1#
					const callbackToReturn = {
						type: "message_reply",
						threadID: (delta.deltaMessageReply.message.messageMetadata.threadKey.threadFbId ?
							delta.deltaMessageReply.message.messageMetadata.threadKey.threadFbId : delta.deltaMessageReply.message.messageMetadata.threadKey
								.otherUserFbId).toString(),
						messageID: delta.deltaMessageReply.message.messageMetadata.messageId,
						senderID: delta.deltaMessageReply.message.messageMetadata.actorFbId.toString(),
						attachments: (delta.deltaMessageReply.message.attachments || []).map(function (att) {
							const mercury = JSON.parse(att.mercuryJSON);
							Object.assign(att, mercury);
							return att;
						}).map(att => {
							let x;
							try {
								x = utils._formatAttachment(att);
							} catch (ex) {
								x = att;
								x.error = ex;
								x.type = "unknown";
							}
							return x;
						}),
						body: delta.deltaMessageReply.message.body || "",
						isGroup: !!delta.deltaMessageReply.message.messageMetadata.threadKey.threadFbId,
						mentions: mentions,
						timestamp: delta.deltaMessageReply.message.messageMetadata.timestamp,
						participantIDs: (delta.deltaMessageReply.message.messageMetadata.cid.canonicalParticipantFbids || delta.deltaMessageReply.message.participants || []).map(e => e.toString())
					};

					if (delta.deltaMessageReply.repliedToMessage) {
						//Mention block - #2
						mdata =
							delta.deltaMessageReply.repliedToMessage === undefined ? [] :
								delta.deltaMessageReply.repliedToMessage.data === undefined ? [] :
									delta.deltaMessageReply.repliedToMessage.data.prng === undefined ? [] :
										JSON.parse(delta.deltaMessageReply.repliedToMessage.data.prng);
						m_id = mdata.map(u => u.i);
						m_offset = mdata.map(u => u.o);
						m_length = mdata.map(u => u.l);

						const rmentions = {};

						for (let i = 0; i < m_id.length; i++) {
							rmentions[m_id[i]] = (delta.deltaMessageReply.repliedToMessage.body || "").substring(
								m_offset[i],
								m_offset[i] + m_length[i]
							);
						}
						//Mention block - 2#
						callbackToReturn.messageReply = {
							threadID: (delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.threadFbId ?
								delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.threadFbId : delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey
									.otherUserFbId).toString(),
							messageID: delta.deltaMessageReply.repliedToMessage.messageMetadata.messageId,
							senderID: delta.deltaMessageReply.repliedToMessage.messageMetadata.actorFbId.toString(),
							attachments: delta.deltaMessageReply.repliedToMessage.attachments.map(function (att) {
								const mercury = JSON.parse(att.mercuryJSON);
								Object.assign(att, mercury);
								return att;
							}).map(att => {
								let x;
								try {
									x = utils._formatAttachment(att);
								} catch (ex) {
									x = att;
									x.error = ex;
									x.type = "unknown";
								}
								return x;
							}),
							body: delta.deltaMessageReply.repliedToMessage.body || "",
							isGroup: !!delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.threadFbId,
							mentions: rmentions,
							timestamp: delta.deltaMessageReply.repliedToMessage.messageMetadata.timestamp
						};
					} else if (delta.deltaMessageReply.replyToMessageId) {
						return defaultFuncs
							.post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, {
								"av": ctx.globalOptions.pageID,
								"queries": JSON.stringify({
									"o0": {
										//Using the same doc_id as forcedFetch
										"doc_id": "2848441488556444",
										"query_params": {
											"thread_and_message_id": {
												"thread_id": callbackToReturn.threadID,
												"message_id": delta.deltaMessageReply.replyToMessageId.id
											}
										}
									}
								})
							})
							.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
							.then((resData) => {
								if (resData[resData.length - 1].error_results > 0) {
									throw resData[0].o0.errors;
								}

								if (resData[resData.length - 1].successful_results === 0) {
									throw { error: "forcedFetch: there was no successful_results", res: resData };
								}

								const fetchData = resData[0].o0.data.message;

								const mobj = {};
								for (const n in fetchData.message.ranges) {
									mobj[fetchData.message.ranges[n].entity.id] = (fetchData.message.text || "").substr(fetchData.message.ranges[n].offset, fetchData.message.ranges[n].length);
								}

								callbackToReturn.messageReply = {
									threadID: callbackToReturn.threadID,
									messageID: fetchData.message_id,
									senderID: fetchData.message_sender.id.toString(),
									attachments: fetchData.message.blob_attachment.map(att => {
										let x;
										try {
											x = utils._formatAttachment({
												blob_attachment: att
											});
										} catch (ex) {
											x = att;
											x.error = ex;
											x.type = "unknown";
										}
										return x;
									}),
									body: fetchData.message.text || "",
									isGroup: callbackToReturn.isGroup,
									mentions: mobj,
									timestamp: parseInt(fetchData.timestamp_precise)
								};
							})
							.catch((err) => {
								log.error("forcedFetch", err);
							})
							.finally(function () {
								if (ctx.globalOptions.autoMarkDelivery) {
									markDelivery(ctx, api, callbackToReturn.threadID, callbackToReturn.messageID);
								}
								!ctx.globalOptions.selfListen &&
									(callbackToReturn.senderID === ctx.i_userID || callbackToReturn.senderID === ctx.userID) ?
									undefined :
									(function () { globalCallback(null, callbackToReturn); })();
							});
					} else {
						callbackToReturn.delta = delta;
					}

					if (ctx.globalOptions.autoMarkDelivery) {
						markDelivery(ctx, api, callbackToReturn.threadID, callbackToReturn.messageID);
					}

					return !ctx.globalOptions.selfListen &&
						(callbackToReturn.senderID === ctx.i_userID || callbackToReturn.senderID === ctx.userID) ?
						undefined :
						(function () { globalCallback(null, callbackToReturn); })();
				}
			}
			return;
		}
	}

	if (v.delta.class !== "NewMessage" &&
		!ctx.globalOptions.listenEvents
	)
		return;

	switch (v.delta.class) {
		case "ReadReceipt":
			var fmtMsg;
			try {
				fmtMsg = utils.formatDeltaReadReceipt(v.delta);
			}
			catch (err) {
				return globalCallback({
					error: "Problem parsing message object. Please open an issue at https://github.com/ntkhang03/fb-chat-api/issues.",
					detail: err,
					res: v.delta,
					type: "parse_error"
				});
			}
			return (function () { globalCallback(null, fmtMsg); })();
		case "AdminTextMessage":
			switch (v.delta.type) {
				case "change_thread_theme":
				case "change_thread_nickname":
				case "change_thread_icon":
				case "change_thread_quick_reaction":
				case "change_thread_admins":
				case "group_poll":
				case "joinable_group_link_mode_change":
				case "magic_words":
				case "change_thread_approval_mode":
				case "messenger_call_log":
				case "participant_joined_group_call":
					var fmtMsg;
					try {
						fmtMsg = utils.formatDeltaEvent(v.delta);
					}
					catch (err) {
						return globalCallback({
							error: "Problem parsing message object. Please open an issue at https://github.com/ntkhang03/fb-chat-api/issues.",
							detail: err,
							res: v.delta,
							type: "parse_error"
						});
					}
					return (function () { globalCallback(null, fmtMsg); })();
				default:
					return;
			}
		//For group images
		case "ForcedFetch":
			if (!v.delta.threadKey) return;
			var mid = v.delta.messageId;
			var tid = v.delta.threadKey.threadFbId;
			if (mid && tid) {
				const form = {
					"av": ctx.globalOptions.pageID,
					"queries": JSON.stringify({
						"o0": {
							//This doc_id is valid as of March 25, 2020
							"doc_id": "2848441488556444",
							"query_params": {
								"thread_and_message_id": {
									"thread_id": tid.toString(),
									"message_id": mid
								}
							}
						}
					})
				};

				defaultFuncs
					.post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form)
					.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
					.then((resData) => {
						if (resData[resData.length - 1].error_results > 0) {
							throw resData[0].o0.errors;
						}

						if (resData[resData.length - 1].successful_results === 0) {
							throw { error: "forcedFetch: there was no successful_results", res: resData };
						}

						const fetchData = resData[0].o0.data.message;

						if (utils.getType(fetchData) == "Object") {
							log.info("forcedFetch", fetchData);
							switch (fetchData.__typename) {
								case "ThreadImageMessage":
									(!ctx.globalOptions.selfListenEvent && (fetchData.message_sender.id.toString() === ctx.i_userID || fetchData.message_sender.id.toString() === ctx.userID)) || !ctx.loggedIn ?
										undefined :
										(function () {
											globalCallback(null, {
												type: "event",
												threadID: utils.formatID(tid.toString()),
												messageID: fetchData.message_id,
												logMessageType: "log:thread-image",
												logMessageData: {
													attachmentID: fetchData.image_with_metadata && fetchData.image_with_metadata.legacy_attachment_id,
													width: fetchData.image_with_metadata && fetchData.image_with_metadata.original_dimensions.x,
													height: fetchData.image_with_metadata && fetchData.image_with_metadata.original_dimensions.y,
													url: fetchData.image_with_metadata && fetchData.image_with_metadata.preview.uri
												},
												logMessageBody: fetchData.snippet,
												timestamp: fetchData.timestamp_precise,
												author: fetchData.message_sender.id
											});
										})();
									break;
								case "UserMessage":
									log.info("ff-Return", {
										type: "message",
										senderID: utils.formatID(fetchData.message_sender.id),
										body: fetchData.message.text || "",
										threadID: utils.formatID(tid.toString()),
										messageID: fetchData.message_id,
										attachments: [{
											type: "share",
											ID: fetchData.extensible_attachment.legacy_attachment_id,
											url: fetchData.extensible_attachment.story_attachment.url,

											title: fetchData.extensible_attachment.story_attachment.title_with_entities.text,
											description: fetchData.extensible_attachment.story_attachment.description.text,
											source: fetchData.extensible_attachment.story_attachment.source,

											image: ((fetchData.extensible_attachment.story_attachment.media || {}).image || {}).uri,
											width: ((fetchData.extensible_attachment.story_attachment.media || {}).image || {}).width,
											height: ((fetchData.extensible_attachment.story_attachment.media || {}).image || {}).height,
											playable: (fetchData.extensible_attachment.story_attachment.media || {}).is_playable || false,
											duration: (fetchData.extensible_attachment.story_attachment.media || {}).playable_duration_in_ms || 0,

											subattachments: fetchData.extensible_attachment.subattachments,
											properties: fetchData.extensible_attachment.story_attachment.properties
										}],
										mentions: {},
										timestamp: parseInt(fetchData.timestamp_precise),
										participantIDs: (fetchData.participants || (fetchData.messageMetadata ? fetchData.messageMetadata.cid ? fetchData.messageMetadata.cid.canonicalParticipantFbids : fetchData.messageMetadata.participantIds : []) || []),
										isGroup: (fetchData.message_sender.id != tid.toString())
									});
									globalCallback(null, {
										type: "message",
										senderID: utils.formatID(fetchData.message_sender.id),
										body: fetchData.message.text || "",
										threadID: utils.formatID(tid.toString()),
										messageID: fetchData.message_id,
										attachments: [{
											type: "share",
											ID: fetchData.extensible_attachment.legacy_attachment_id,
											url: fetchData.extensible_attachment.story_attachment.url,

											title: fetchData.extensible_attachment.story_attachment.title_with_entities.text,
											description: fetchData.extensible_attachment.story_attachment.description.text,
											source: fetchData.extensible_attachment.story_attachment.source,

											image: ((fetchData.extensible_attachment.story_attachment.media || {}).image || {}).uri,
											width: ((fetchData.extensible_attachment.story_attachment.media || {}).image || {}).width,
											height: ((fetchData.extensible_attachment.story_attachment.media || {}).image || {}).height,
											playable: (fetchData.extensible_attachment.story_attachment.media || {}).is_playable || false,
											duration: (fetchData.extensible_attachment.story_attachment.media || {}).playable_duration_in_ms || 0,

											subattachments: fetchData.extensible_attachment.subattachments,
											properties: fetchData.extensible_attachment.story_attachment.properties
										}],
										mentions: {},
										timestamp: parseInt(fetchData.timestamp_precise),
										participantIDs: (fetchData.participants || (fetchData.messageMetadata ? fetchData.messageMetadata.cid ? fetchData.messageMetadata.cid.canonicalParticipantFbids : fetchData.messageMetadata.participantIds : []) || []),
										isGroup: (fetchData.message_sender.id != tid.toString())
									});
							}
						} else {
							log.error("forcedFetch", fetchData);
						}
					})
					.catch((err) => {
						log.error("forcedFetch", err);
					});
			}
			break;
		case "ThreadName":
		case "ParticipantsAddedToGroupThread":
		case "ParticipantLeftGroupThread":
		case "ApprovalQueue":
			var formattedEvent;
			try {
				formattedEvent = utils.formatDeltaEvent(v.delta);
			} catch (err) {
				return globalCallback({
					error: "Problem parsing message object. Please open an issue at https://github.com/ntkhang03/fb-chat-api/issues.",
					detail: err,
					res: v.delta,
					type: "parse_error"
				});
			}
			return (!ctx.globalOptions.selfListenEvent && (formattedEvent.author.toString() === ctx.i_userID || formattedEvent.author.toString() === ctx.userID)) || !ctx.loggedIn ?
				undefined :
				(function () { globalCallback(null, formattedEvent); })();
	}
}

function markDelivery(ctx, api, threadID, messageID) {
	if (threadID && messageID) {
		api.markAsDelivered(threadID, messageID, (err) => {
			if (err) {
				log.error("markAsDelivered", err);
			} else {
				if (ctx.globalOptions.autoMarkRead) {
					api.markAsRead(threadID, (err) => {
						if (err) {
							log.error("markAsDelivered", err);
						}
					});
				}
			}
		});
	}
}

function getSeqId(defaultFuncs, api, ctx, globalCallback) {
	const jar = ctx.jar;
	utils
		.get('https://www.facebook.com/', jar, null, ctx.globalOptions, { noRef: true })
		.then(utils.saveCookies(jar))
		.then(function (resData) {
			const html = resData.body;
			const oldFBMQTTMatch = html.match(/irisSeqID:"(.+?)",appID:219994525426954,endpoint:"(.+?)"/);
			let mqttEndpoint = null;
			let region = null;
			let irisSeqID = null;
			let noMqttData = null;

			if (oldFBMQTTMatch) {
				irisSeqID = oldFBMQTTMatch[1];
				mqttEndpoint = oldFBMQTTMatch[2];
				region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
				log.info("login", `Got this account's message region: ${region}`);
			} else {
				const newFBMQTTMatch = html.match(/{"app_id":"219994525426954","endpoint":"(.+?)","iris_seq_id":"(.+?)"}/);
				if (newFBMQTTMatch) {
					irisSeqID = newFBMQTTMatch[2];
					mqttEndpoint = newFBMQTTMatch[1].replace(/\\\//g, "/");
					region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
					log.info("login", `Got this account's message region: ${region}`);
				} else {
					const legacyFBMQTTMatch = html.match(/(\["MqttWebConfig",\[\],{fbid:")(.+?)(",appID:219994525426954,endpoint:")(.+?)(",pollingEndpoint:")(.+?)(3790])/);
					if (legacyFBMQTTMatch) {
						mqttEndpoint = legacyFBMQTTMatch[4];
						region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
						log.warn("login", `Cannot get sequence ID with new RegExp. Fallback to old RegExp (without seqID)...`);
						log.info("login", `Got this account's message region: ${region}`);
						log.info("login", `[Unused] Polling endpoint: ${legacyFBMQTTMatch[6]}`);
					} else {
						log.warn("login", "Cannot get MQTT region & sequence ID.");
						noMqttData = html;
					}
				}
			}

			ctx.lastSeqId = irisSeqID;
			ctx.mqttEndpoint = mqttEndpoint;
			ctx.region = region;
			if (noMqttData) {
				api["htmlData"] = noMqttData;
			}

			listenMqtt(defaultFuncs, api, ctx, globalCallback);
		})
		.catch(function (err) {
			log.error("getSeqId", err);
		});
}

module.exports = function (defaultFuncs, api, ctx) {
	let globalCallback = identity;

	return function (callback) {
		class MessageEmitter extends EventEmitter {
			stopListening(callback) {

				callback = callback || (() => { });
				globalCallback = identity;
				if (ctx.mqttClient) {
					ctx.mqttClient.unsubscribe("/webrtc");
					ctx.mqttClient.unsubscribe("/rtc_multi");
					ctx.mqttClient.unsubscribe("/onevc");
					ctx.mqttClient.publish("/browser_close", "{}");
					ctx.mqttClient.end(false, function (...data) {
						callback(data);
						ctx.mqttClient = undefined;
					});
				}
			}

			async stopListeningAsync() {
				return new Promise((resolve) => {
					this.stopListening(resolve);
				});
			}
		}

		const msgEmitter = new MessageEmitter();
		globalCallback = (callback || function (error, message) {
			if (error) {
				return msgEmitter.emit("error", error);
			}
			msgEmitter.emit("message", message);
		});

		// Reset some stuff
		if (!ctx.firstListen)
			ctx.lastSeqId = null;
		ctx.syncToken = undefined;
		ctx.t_mqttCalled = false;

		if (!ctx.firstListen || !ctx.lastSeqId) {
			getSeqId(defaultFuncs, api, ctx, globalCallback);
		} else {
			listenMqtt(defaultFuncs, api, ctx, globalCallback);
		}

		api.stopListening = msgEmitter.stopListening;
		api.stopListeningAsync = msgEmitter.stopListeningAsync;
		return msgEmitter;
	};
};
