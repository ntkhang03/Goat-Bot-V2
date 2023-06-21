"use strict";

const utils = require("../utils");
const log = require("npmlog");

function formatEventReminders(reminder) {
	return {
		reminderID: reminder.id,
		eventCreatorID: reminder.lightweight_event_creator.id,
		time: reminder.time,
		eventType: reminder.lightweight_event_type.toLowerCase(),
		locationName: reminder.location_name,
		// @TODO verify this
		locationCoordinates: reminder.location_coordinates,
		locationPage: reminder.location_page,
		eventStatus: reminder.lightweight_event_status.toLowerCase(),
		note: reminder.note,
		repeatMode: reminder.repeat_mode.toLowerCase(),
		eventTitle: reminder.event_title,
		triggerMessage: reminder.trigger_message,
		secondsToNotifyBefore: reminder.seconds_to_notify_before,
		allowsRsvp: reminder.allows_rsvp,
		relatedEvent: reminder.related_event,
		members: reminder.event_reminder_members.edges.map(function (member) {
			return {
				memberID: member.node.id,
				state: member.guest_list_state.toLowerCase()
			};
		})
	};
}

function formatThreadGraphQLResponse(messageThread) {
	const threadID = messageThread.thread_key.thread_fbid
		? messageThread.thread_key.thread_fbid
		: messageThread.thread_key.other_user_id;

	// Remove me
	const lastM = messageThread.last_message;
	const snippetID =
		lastM &&
			lastM.nodes &&
			lastM.nodes[0] &&
			lastM.nodes[0].message_sender &&
			lastM.nodes[0].message_sender.messaging_actor
			? lastM.nodes[0].message_sender.messaging_actor.id
			: null;
	const snippetText =
		lastM && lastM.nodes && lastM.nodes[0] ? lastM.nodes[0].snippet : null;
	const lastR = messageThread.last_read_receipt;
	const lastReadTimestamp =
		lastR && lastR.nodes && lastR.nodes[0] && lastR.nodes[0].timestamp_precise
			? lastR.nodes[0].timestamp_precise
			: null;

	return {
		threadID: threadID,
		threadName: messageThread.name,
		participantIDs: messageThread.all_participants.edges.map(d => d.node.messaging_actor.id),
		userInfo: messageThread.all_participants.edges.map(d => ({
			id: d.node.messaging_actor.id,
			name: d.node.messaging_actor.name,
			firstName: d.node.messaging_actor.short_name,
			vanity: d.node.messaging_actor.username,
			url: d.node.messaging_actor.url,
			thumbSrc: d.node.messaging_actor.big_image_src.uri,
			profileUrl: d.node.messaging_actor.big_image_src.uri,
			gender: d.node.messaging_actor.gender,
			type: d.node.messaging_actor.__typename,
			isFriend: d.node.messaging_actor.is_viewer_friend,
			isBirthday: !!d.node.messaging_actor.is_birthday //not sure?
		})),
		unreadCount: messageThread.unread_count,
		messageCount: messageThread.messages_count,
		timestamp: messageThread.updated_time_precise,
		muteUntil: messageThread.mute_until,
		isGroup: messageThread.thread_type == "GROUP",
		isSubscribed: messageThread.is_viewer_subscribed,
		isArchived: messageThread.has_viewer_archived,
		folder: messageThread.folder,
		cannotReplyReason: messageThread.cannot_reply_reason,
		eventReminders: messageThread.event_reminders
			? messageThread.event_reminders.nodes.map(formatEventReminders)
			: null,
		emoji: messageThread.customization_info
			? messageThread.customization_info.emoji
			: null,
		color:
			messageThread.customization_info &&
				messageThread.customization_info.outgoing_bubble_color
				? messageThread.customization_info.outgoing_bubble_color.slice(2)
				: null,
		threadTheme: messageThread.thread_theme,
		nicknames:
			messageThread.customization_info &&
				messageThread.customization_info.participant_customizations
				? messageThread.customization_info.participant_customizations.reduce(
					function (res, val) {
						if (val.nickname) res[val.participant_id] = val.nickname;
						return res;
					},
					{}
				)
				: {},
		adminIDs: messageThread.thread_admins,
		approvalMode: Boolean(messageThread.approval_mode),
		approvalQueue: messageThread.group_approval_queue.nodes.map(a => ({
			inviterID: a.inviter.id,
			requesterID: a.requester.id,
			timestamp: a.request_timestamp,
			request_source: a.request_source // @Undocumented
		})),

		// @Undocumented
		reactionsMuteMode: messageThread.reactions_mute_mode.toLowerCase(),
		mentionsMuteMode: messageThread.mentions_mute_mode.toLowerCase(),
		isPinProtected: messageThread.is_pin_protected,
		relatedPageThread: messageThread.related_page_thread,

		// @Legacy
		name: messageThread.name,
		snippet: snippetText,
		snippetSender: snippetID,
		snippetAttachments: [],
		serverTimestamp: messageThread.updated_time_precise,
		imageSrc: messageThread.image ? messageThread.image.uri : null,
		isCanonicalUser: messageThread.is_canonical_neo_user,
		isCanonical: messageThread.thread_type != "GROUP",
		recipientsLoadable: true,
		hasEmailParticipant: false,
		readOnly: false,
		canReply: messageThread.cannot_reply_reason == null,
		lastMessageTimestamp: messageThread.last_message
			? messageThread.last_message.timestamp_precise
			: null,
		lastMessageType: "message",
		lastReadTimestamp: lastReadTimestamp,
		threadType: messageThread.thread_type == "GROUP" ? 2 : 1,

		// update in Wed, 13 Jul 2022 19:41:12 +0700
		inviteLink: {
			enable: messageThread.joinable_mode ? messageThread.joinable_mode.mode == 1 : false,
			link: messageThread.joinable_mode ? messageThread.joinable_mode.link : null
		}
	};
}

function formatThreadList(data) {
	// console.log(JSON.stringify(data.find(t => t.thread_key.thread_fbid === "5095817367161431"), null, 2));
	return data.map(t => formatThreadGraphQLResponse(t));
}

module.exports = function (defaultFuncs, api, ctx) {
	return function getThreadList(limit, timestamp, tags, callback) {
		if (!callback && (utils.getType(tags) === "Function" || utils.getType(tags) === "AsyncFunction")) {
			callback = tags;
			tags = [""];
		}
		if (utils.getType(limit) !== "Number" || !Number.isInteger(limit) || limit <= 0) {
			throw new utils.CustomError({ error: "getThreadList: limit must be a positive integer" });
		}
		if (utils.getType(timestamp) !== "Null" &&
			(utils.getType(timestamp) !== "Number" || !Number.isInteger(timestamp))) {
			throw new utils.CustomError({ error: "getThreadList: timestamp must be an integer or null" });
		}
		if (utils.getType(tags) === "String") {
			tags = [tags];
		}
		if (utils.getType(tags) !== "Array") {
			throw new utils.CustomError({
				error: "getThreadList: tags must be an array",
				message: "getThreadList: tags must be an array"
			});
		}

		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (utils.getType(callback) !== "Function" && utils.getType(callback) !== "AsyncFunction") {
			callback = function (err, data) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(data);
			};
		}

		const form = {
			"av": ctx.i_userID || ctx.userID,
			"queries": JSON.stringify({
				"o0": {
					// This doc_id was valid on 2020-07-20
					// "doc_id": "3336396659757871",
					"doc_id": "3426149104143726",
					"query_params": {
						"limit": limit + (timestamp ? 1 : 0),
						"before": timestamp,
						"tags": tags,
						"includeDeliveryReceipts": true,
						"includeSeqID": false
					}
				}
			}),
			"batch_name": "MessengerGraphQLThreadlistFetcher"
		};

		defaultFuncs
			.post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then((resData) => {
				if (resData[resData.length - 1].error_results > 0) {
					throw new utils.CustomError(resData[0].o0.errors);
				}

				if (resData[resData.length - 1].successful_results === 0) {
					throw new utils.CustomError({ error: "getThreadList: there was no successful_results", res: resData });
				}

				// When we ask for threads using timestamp from the previous request,
				// we are getting the last thread repeated as the first thread in this response.
				// .shift() gets rid of it
				// It is also the reason for increasing limit by 1 when timestamp is set
				// this way user asks for 10 threads, we are asking for 11,
				// but after removing the duplicated one, it is again 10
				if (timestamp) {
					resData[0].o0.data.viewer.message_threads.nodes.shift();
				}
				callback(null, formatThreadList(resData[0].o0.data.viewer.message_threads.nodes));
			})
			.catch((err) => {
				log.error("getThreadList", err);
				return callback(err);
			});

		return returnPromise;
	};
};
