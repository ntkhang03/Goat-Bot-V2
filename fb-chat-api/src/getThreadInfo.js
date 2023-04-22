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

function formatThreadGraphQLResponse(data) {
	if (data.errors)
		return data.errors;
	const messageThread = data.message_thread;
	if (!messageThread)
		return null;
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

module.exports = function (defaultFuncs, api, ctx) {
	return function getThreadInfoGraphQL(threadID, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (utils.getType(callback) != "Function" && utils.getType(callback) != "AsyncFunction") {
			callback = function (err, data) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(data);
			};
		}

		if (utils.getType(threadID) !== "Array") {
			threadID = [threadID];
		}

		let form = {};
		// `queries` has to be a string. I couldn't tell from the dev console. This
		// took me a really long time to figure out. I deserve a cookie for this.
		threadID.map(function (t, i) {
			form["o" + i] = {
				doc_id: "3449967031715030",
				query_params: {
					id: t,
					message_limit: 0,
					load_messages: false,
					load_read_receipts: false,
					before: null
				}
			};
		});

		form = {
			queries: JSON.stringify(form),
			batch_name: "MessengerGraphQLThreadFetcher"
		};

		defaultFuncs
			.post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {

				if (resData.error) {
					throw resData;
				}
				// This returns us an array of things. The last one is the success /
				// failure one.
				// @TODO What do we do in this case?
				// if (resData[resData.length - 1].error_results !== 0) {
				// 	throw resData[0].o0.errors[0];
				// }
				// if (!resData[0].o0.data.message_thread) {
				// 	throw new Error("can't find this thread");
				// }
				const threadInfos = {};
				for (let i = resData.length - 2; i >= 0; i--) {
					const threadInfo = formatThreadGraphQLResponse(resData[i][Object.keys(resData[i])[0]].data);
					threadInfos[threadInfo?.threadID || threadID[threadID.length - 1 - i]] = threadInfo;
				}
				if (Object.values(threadInfos).length == 1) {
					callback(null, Object.values(threadInfos)[0]);
				}
				else {
					callback(null, threadInfos);
				}
			})
			.catch(function (err) {
				log.error("getThreadInfoGraphQL", err);
				return callback(err);
			});

		return returnPromise;
	};
};
