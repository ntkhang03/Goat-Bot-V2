"use strict";

// Original
/**
 * @author https://github.com/Schmavery/facebook-chat-api/pull/865
 */

const utils = require("../utils");
const log = require("npmlog");


function formatMessage(threadID, data) {
	switch (data.__typename) {
		case "ThreadNameMessage":
			return {
				type: "event",
				threadID: threadID,
				messageID: data.message_id,
				logMessageType: "log:thread-name",
				logMessageData: {
					name: data.thread_name
				},
				logMessageBody: data.snippet,
				timestamp: data.timestamp_precise,
				author: data.message_sender.id
			};
		case "ThreadImageMessage":
			const metadata = data.image_with_metadata;
			return {
				type: "event",
				threadID: threadID,
				messageID: data.message_id,
				logMessageType: "log:thread-image",
				logMessageData: metadata ? {
					attachmentID: metadata.legacy_attachment_id,
					width: metadata.original_dimensions.x,
					height: metadata.original_dimensions.y,
					url: metadata.preview.uri
				} :
					{
						attachmentID: null,
						width: null,
						height: null,
						url: null
					},
				logMessageBody: data.snippet,
				timestamp: data.timestamp_precise,
				author: data.message_sender.id
			};
		case "GenericAdminTextMessage":
			switch (data.extensible_message_admin_text_type) {
				case "CHANGE_THREAD_THEME":
					return {
						type: "event",
						threadID: threadID,
						messageID: data.message_id,
						logMessageType: "log:thread-color",
						logMessageData: colors.find(color => color.theme_color === data.extensible_message_admin_text.theme_color) || {
							theme_color: data.extensible_message_admin_text.theme_color,
							theme_id: null,
							theme_emoji: null,
							gradient: null,
							should_show_icon: null,
							theme_name_with_subtitle: null
						},
						logMessageBody: data.snippet,
						timestamp: data.timestamp_precise,
						author: data.message_sender.id
					};
				case "CHANGE_THREAD_ICON":
					const thread_icon = data.extensible_message_admin_text.thread_icon;
					return {
						type: "event",
						threadID: threadID,
						messageID: data.message_id,
						logMessageType: "log:thread-icon",
						logMessageData: {
							thread_icon_url: `https://static.xx.fbcdn.net/images/emoji.php/v9/t3c/1/16/${thread_icon.codePointAt(0).toString(16)}.png`,
							thread_icon: thread_icon
						},
						logMessageBody: data.snippet,
						timestamp: data.timestamp_precise,
						author: data.message_sender.id
					};
				case "CHANGE_THREAD_NICKNAME":
					return {
						type: "event",
						threadID: threadID,
						messageID: data.message_id,
						logMessageType: "log:user-nickname",
						logMessageData: {
							nickname: data.extensible_message_admin_text.nickname,
							participant_id: data.extensible_message_admin_text.participant_id
						},
						logMessageBody: data.snippet,
						timestamp: data.timestamp_precise,
						author: data.message_sender.id
					};
				case "GROUP_POLL":
					const question = data.extensible_message_admin_text.question;
					return {
						type: "event",
						threadID: threadID,
						messageID: data.message_id,
						logMessageType: "log:thread-poll",
						logMessageData: {
							question_json: JSON.stringify({
								id: question.id,
								text: question.text,
								total_count: data.extensible_message_admin_text.total_count,
								viewer_has_voted: question.viewer_has_voted,
								question_type: "",
								creator_id: data.message_sender.id,
								options: question.options.nodes.map(option => ({
									id: option.id,
									text: option.text,
									total_count: option.voters.nodes.length,
									viewer_has_voted: option.viewer_has_voted,
									voters: option.voters.nodes.map(voter => voter.id)
								}))
							}),
							event_type: data.extensible_message_admin_text.event_type.toLowerCase(),
							question_id: question.id
						},
						logMessageBody: data.snippet,
						timestamp: data.timestamp_precise,
						author: data.message_sender.id
					};
				default:
					throw new Error(`Unknown admin text type: "${data.extensible_message_admin_text_type}", if this happens to you let me know when it happens. Please open an issue at https://github.com/ntkhang03/fb-chat-api/issues.`);
			}
		case "UserMessage":
			return {
				senderID: data.message_sender.id,
				body: data.message.text,
				threadID: threadID,
				messageID: data.message_id,
				reactions: data.message_reactions.map(r => ({
					[r.user.id]: r.reaction
				})),
				attachments: data.blob_attachments && data.blob_attachments.length > 0 ?
					data.blob_attachments.length.map(att => {
						let x;
						try {
							x = utils._formatAttachment(att);
						} catch (ex) {
							x = att;
							x.error = ex;
							x.type = "unknown";
						}
						return x;
					}) :
					data.extensible_attachment && Object.keys(data.extensible_attachment).length > 0 ?
						[{
							type: "share",
							ID: data.extensible_attachment.legacy_attachment_id,
							url: data.extensible_attachment.story_attachment.url,

							title: data.extensible_attachment.story_attachment.title_with_entities.text,
							description: data.extensible_attachment.story_attachment.description.text,
							source: data.extensible_attachment.story_attachment.source,

							image: ((data.extensible_attachment.story_attachment.media || {}).image || {}).uri,
							width: ((data.extensible_attachment.story_attachment.media || {}).image || {}).width,
							height: ((data.extensible_attachment.story_attachment.media || {}).image || {}).height,
							playable: (data.extensible_attachment.story_attachment.media || {}).is_playable || false,
							duration: (data.extensible_attachment.story_attachment.media || {}).playable_duration_in_ms || 0,

							subattachments: data.extensible_attachment.subattachments,
							properties: data.extensible_attachment.story_attachment.properties
						}] :
						[],
				mentions: data.message.ranges.map(mention => ({
					[mention.entity.id]: data.message.text.substring(mention.offset, mention.offset + mention.length)
				})),
				timestamp: data.timestamp_precise
			};
		default:
			throw new Error(`Unknown message type: "${data.__typename}", if this happens to you let me know when it happens. Please open an issue at https://github.com/ntkhang03/fb-chat-api/issues.`);
		// If this happens to you let me know when it happens
		// Please open an issue at https://github.com/ntkhang03/fb-chat-api/issues.
		// return Object.assign({ type: "unknown", data });
	}
}


function parseDelta(threadID, delta) {
	if (delta.replied_to_message) {
		return Object.assign({
			type: "message_reply"
		}, formatMessage(threadID, delta), {
			messageReply: formatMessage(threadID, delta.replied_to_message.message)
		});
	}
	else {
		return formatMessage(threadID, delta);
	}
}


module.exports = function (defaultFuncs, api, ctx) {
	return function getMessage(threadID, messageID, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			callback = function (err, info) {
				if (err)
					return rejectFunc(err);
				resolveFunc(info);
			};
		}

		if (!threadID || !messageID) {
			return callback({ error: "getMessage: need threadID and messageID" });
		}

		const form = {
			"av": ctx.globalOptions.pageID,
			"queries": JSON.stringify({
				"o0": {
					//This doc_id is valid as of ? (prob January 18, 2020)
					"doc_id": "1768656253222505",
					"query_params": {
						"thread_and_message_id": {
							"thread_id": threadID,
							"message_id": messageID
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
					throw { error: "getMessage: there was no successful_results", res: resData };
				}

				const fetchData = resData[0].o0.data.message;
				if (fetchData) {
					callback(null, parseDelta(threadID, fetchData));
				}
				else {
					throw fetchData;
				}
			})
			.catch((err) => {
				log.error("getMessage", err);
				callback(err);
			});

		return returnPromise;
	};
};

const colors = [
	{
		theme_color: 'FF000000',
		theme_id: '788274591712841',
		theme_emoji: '🖤',
		gradient: '["FFF0F0F0"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Monochrome'
	},
	{
		theme_color: 'FFFF5CA1',
		theme_id: '169463077092846',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Hot Pink'
	},
	{
		theme_color: 'FF2825B5',
		theme_id: '271607034185782',
		theme_emoji: null,
		gradient: '["FF5E007E","FF331290","FF2825B5"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Shadow'
	},
	{
		theme_color: 'FFD9A900',
		theme_id: '2533652183614000',
		theme_emoji: null,
		gradient: '["FF550029","FFAA3232","FFD9A900"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Maple'
	},
	{
		theme_color: 'FFFB45DE',
		theme_id: '2873642949430623',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Tulip'
	},
	{
		theme_color: 'FF5E007E',
		theme_id: '193497045377796',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Grape'
	},
	{
		theme_color: 'FF7AA286',
		theme_id: '1455149831518874',
		theme_emoji: '🌑',
		gradient: '["FF25C0E1","FFCE832A"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Dune'
	},
	{
		theme_color: 'FFFAAF00',
		theme_id: '672058580051520',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Honey'
	},
	{
		theme_color: 'FF0084FF',
		theme_id: '196241301102133',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Default Blue'
	},
	{
		theme_color: 'FFFFC300',
		theme_id: '174636906462322',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Yellow'
	},
	{
		theme_color: 'FF44BEC7',
		theme_id: '1928399724138152',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Teal Blue'
	},
	{
		theme_color: 'FF7646FF',
		theme_id: '234137870477637',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Bright Purple'
	},
	{
		theme_color: 'FFF25C54',
		theme_id: '3022526817824329',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Peach'
	},
	{
		theme_color: 'FFF01D6A',
		theme_id: '724096885023603',
		theme_emoji: null,
		gradient: '["FF005FFF","FF9200FF","FFFF2E19"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Berry'
	},
	{
		theme_color: 'FFFF7CA8',
		theme_id: '624266884847972',
		theme_emoji: null,
		gradient: '["FFFF8FB2","FFA797FF","FF00E5FF"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Candy'
	},
	{
		theme_color: 'FF6E5B04',
		theme_id: '365557122117011',
		theme_emoji: '💛',
		gradient: '["FFED9F9A","FFED9F9A","FFED9F9A"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Support'
	},
	{
		theme_color: 'FF0052CD',
		theme_id: '230032715012014',
		theme_emoji: '✌️',
		gradient: '["FF0052CD","FF00A1E6","FF0052CD"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Tie-Dye'
	},
	{
		theme_color: 'FF601DDD',
		theme_id: '1060619084701625',
		theme_emoji: '☁️',
		gradient: '["FFCA34FF","FF302CFF","FFBA009C"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Lo-Fi'
	},
	{
		theme_color: 'FF0099FF',
		theme_id: '3273938616164733',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Classic'
	},
	{
		theme_color: 'FF1ADB5B',
		theme_id: '370940413392601',
		theme_emoji: null,
		gradient: '["FFFFD200","FF6EDF00","FF00DFBB"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Citrus'
	},
	{
		theme_color: 'FFD696BB',
		theme_id: '2058653964378557',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Lavender Purple'
	},
	{
		theme_color: 'FFC03232',
		theme_id: '1059859811490132',
		theme_emoji: '🙃',
		gradient: '["FFDB4040","FFA32424"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Stranger Things'
	},
	{
		theme_color: 'FFFA3C4C',
		theme_id: '2129984390566328',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Red'
	},
	{
		theme_color: 'FF13CF13',
		theme_id: '2136751179887052',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Green'
	},
	{
		theme_color: 'FFFF7E29',
		theme_id: '175615189761153',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Orange'
	},
	{
		theme_color: 'FFE68585',
		theme_id: '980963458735625',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Coral Pink'
	},
	{
		theme_color: 'FF20CEF5',
		theme_id: '2442142322678320',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Aqua Blue'
	},
	{
		theme_color: 'FF0EDCDE',
		theme_id: '417639218648241',
		theme_emoji: null,
		gradient: '["FF19C9FF","FF00E6D2","FF0EE6B7"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Aqua'
	},
	{
		theme_color: 'FFFF9C19',
		theme_id: '930060997172551',
		theme_emoji: null,
		gradient: '["FFFFDC2D","FFFF9616","FFFF4F00"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Mango'
	},
	{
		theme_color: 'FFF01D6A',
		theme_id: '164535220883264',
		theme_emoji: null,
		gradient: '["FF005FFF","FF9200FF","FFFF2E19"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Berry'
	},
	{
		theme_color: 'FFFF7CA8',
		theme_id: '205488546921017',
		theme_emoji: null,
		gradient: '["FFFF8FB2","FFA797FF","FF00E5FF"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Candy'
	},
	{
		theme_color: 'FFFF6F07',
		theme_id: '1833559466821043',
		theme_emoji: '🌎',
		gradient: '["FFFF6F07"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Earth'
	},
	{
		theme_color: 'FF0B0085',
		theme_id: '339021464972092',
		theme_emoji: '🔈',
		gradient: '["FF2FA9E4","FF648FEB","FF9B73F2"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Music'
	},
	{
		theme_color: 'FF8A39EF',
		theme_id: '1652456634878319',
		theme_emoji: '🏳️‍🌈',
		gradient: '["FFFF0018","FFFF0417","FFFF310E","FFFF5D06","FFFF7A01","FFFF8701","FFFFB001","FFD9C507","FF79C718","FF01C92D","FF01BE69","FF01B3AA","FF0BA1DF","FF3F77E6","FF724CEC","FF8A39EF","FF8A39EF"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Pride'
	},
	{
		theme_color: 'FF004D7C',
		theme_id: '538280997628317',
		theme_emoji: '🌀',
		gradient: '["FF931410","FF931410","FF931410"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Doctor Strange'
	},
	{
		theme_color: 'FF4F4DFF',
		theme_id: '3190514984517598',
		theme_emoji: '🌤',
		gradient: '["FF0080FF","FF9F1AFF"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Sky'
	},
	{
		theme_color: 'FFE84B28',
		theme_id: '357833546030778',
		theme_emoji: '🐯',
		gradient: '["FFF69500","FFDA0050"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Lunar New Year'
	},
	{
		theme_color: 'FFB24B77',
		theme_id: '627144732056021',
		theme_emoji: '🥳',
		gradient: '["FFF1614E","FF660F84"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Celebration!'
	},
	{
		theme_color: 'FF66A9FF',
		theme_id: '390127158985345',
		theme_emoji: '🥶',
		gradient: '["FF8CB3FF","FF409FFF"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Chill'
	},
	{
		theme_color: 'FF5797FC',
		theme_id: '275041734441112',
		theme_emoji: '😌',
		gradient: '["FF4AC9E4","FF5890FF","FF8C91FF"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Care'
	},
	{
		theme_color: 'FFFF595C',
		theme_id: '3082966625307060',
		theme_emoji: '💫',
		gradient: '["FFFF239A","FFFF8C21"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Astrology'
	},
	{
		theme_color: 'FF0171FF',
		theme_id: '184305226956268',
		theme_emoji: '☁️',
		gradient: '["FF0026ee","FF00b2ff"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'J Balvin'
	},
	{
		theme_color: 'FFA033FF',
		theme_id: '621630955405500',
		theme_emoji: '🎉',
		gradient: '["FFFF7061","FFFF5280","FFA033FF","FF0099FF"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Birthday'
	},
	{
		theme_color: 'FF006528',
		theme_id: '539927563794799',
		theme_emoji: '🍄',
		gradient: '["FF00d52f","FF006528"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Cottagecore'
	},
	{
		theme_color: 'FF4D3EC2',
		theme_id: '736591620215564',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Ocean'
	},
	{
		theme_color: 'FF4e4bf5',
		theme_id: '3259963564026002',
		theme_emoji: null,
		gradient: '["FFAA00FF","FF0080FF"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Default'
	},
	{
		theme_color: 'FF3A12FF',
		theme_id: '582065306070020',
		theme_emoji: null,
		gradient: '["FFFAAF00","FFFF2E2E","FF3A12FF"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Rocket'
	},
	{
		theme_color: 'FF3A1D8A',
		theme_id: '273728810607574',
		theme_emoji: null,
		gradient: '["FFFB45DE","FF841DD5","FF3A1D8A"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Unicorn'
	},
	{
		theme_color: 'FF9FD52D',
		theme_id: '262191918210707',
		theme_emoji: null,
		gradient: '["FF2A7FE3","FF00BF91","FF9FD52D"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Tropical'
	},
	{
		theme_color: 'FFF7B267',
		theme_id: '909695489504566',
		theme_emoji: null,
		gradient: '["FFF25C54","FFF4845F","FFF7B267"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Sushi'
	},
	{
		theme_color: 'FF1ADB5B',
		theme_id: '557344741607350',
		theme_emoji: null,
		gradient: '["FFFFD200","FF6EDF00","FF00DFBB"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Citrus'
	},
	{
		theme_color: 'FF4D3EC2',
		theme_id: '280333826736184',
		theme_emoji: null,
		gradient: '["FFFF625B","FFC532AD","FF4D3EC2"]',
		should_show_icon: '1',
		theme_name_with_subtitle: 'Lollipop'
	},
	{
		theme_color: 'FFFF311E',
		theme_id: '1257453361255152',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Rose'
	},
	{
		theme_color: 'FFA797FF',
		theme_id: '571193503540759',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Lavender'
	},
	{
		theme_color: 'FF6EDF00',
		theme_id: '3151463484918004',
		theme_emoji: null,
		gradient: null,
		should_show_icon: '1',
		theme_name_with_subtitle: 'Kiwi'
	},
	{
		theme_color: 'FF9D59D2',
		theme_id: '737761000603635',
		theme_emoji: '💛',
		gradient: '["FFFFD600","FFFCB37B","FF9D59D2","FF282828"]',
		should_show_icon: '',
		theme_name_with_subtitle: 'Non-Binary'
	}
];