module.exports = {
	// You can customize the language here or directly in the command files
	onlyadminbox: {
		shortDescription: "turn on/off only admin box can use bot",
		longDescription: "turn on/off only admin box can use bot",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "Turned on the mode only admin of group can use bot",
			turnedOff: "Turned off the mode only admin of group can use bot",
			syntaxError: "Syntax error, only use {pn} on or {pn} off"
		}
	},
	adduser: {
		shortDescription: "Add user to box chat",
		longDescription: "Add user to box chat of you",
		guide: "   {pn} [link profile | uid]",
		text: {
			alreadyInGroup: "Already in group",
			successAdd: "- Successfully added %1 members to the group",
			failedAdd: "- Failed to add %1 members to the group",
			approve: "- Added %1 members to the approval list",
			invalidLink: "Please enter a valid facebook link",
			cannotGetUid: "Cannot get uid of this user",
			linkNotExist: "This profile url does not exist",
			cannotAddUser: "Bot is blocked or this user blocked strangers from adding to the group"
		}
	},
	admin: {
		shortDescription: "Add, remove, edit admin role",
		longDescription: "Add, remove, edit admin role",
		guide: "   {pn} [add | -a] <uid>: Add admin role for user\n\t  {pn} [remove | -r] <uid>: Remove admin role of user\n\t  {pn} [list | -l]: List all admins",
		text: {
			added: "✅ | Added admin role for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users already have admin role:\n%2",
			missingIdAdd: "⚠️ | Please enter ID or tag user to add admin role",
			removed: "✅ | Removed admin role of %1 users:\n%2",
			notAdmin: "⚠️ | %1 users don't have admin role:\n%2",
			missingIdRemove: "⚠️ | Please enter ID or tag user to remove admin role",
			listAdmin: "👑 | List of admins:\n%1"
		}
	},
	adminonly: {
		shortDescription: "turn on/off only admin can use bot",
		longDescription: "turn on/off only admin can use bot",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "Turned on the mode only admin can use bot",
			turnedOff: "Turned off the mode only admin can use bot",
			syntaxError: "Syntax error, only use {pn} on or {pn} off"
		}
	},
	all: {
		shortDescription: "Tag all members",
		longDescription: "Tag all members in your group chat",
		guide: "{pn} [content | empty]"
	},
	anime: {
		shortDescription: "random anime image",
		longDescription: "random anime image",
		guide: "{pn} <endpoint>\n   List of endpoint: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "Initializing image, please wait...",
			error: "An error occurred, please try again later"
		}
	},
	antichangeinfobox: {
		shortDescription: "Anti change info box",
		longDescription: "Turn on/off anti change info box",
		guide: "   {pn} avt [on | off]: anti change avatar box chat\n   {pn} name [on | off]: anti change name box chat\n   {pn} theme [on | off]: anti change theme (chủ đề) box chat\n   {pn} emoji [on | off]: anti change emoji box chat",
		text: {
			antiChangeAvatarOn: "Turn on anti change avatar box chat",
			antiChangeAvatarOff: "Turn off anti change avatar box chat",
			missingAvt: "You have not set avatar for box chat",
			antiChangeNameOn: "Turn on anti change name box chat",
			antiChangeNameOff: "Turn off anti change name box chat",
			antiChangeThemeOn: "Turn on anti change theme box chat",
			antiChangeThemeOff: "Turn off anti change theme box chat",
			antiChangeEmojiOn: "Turn on anti change emoji box chat",
			antiChangeEmojiOff: "Turn off anti change emoji box chat",
			antiChangeAvatarAlreadyOn: "Your box chat is currently on anti change avatar",
			antiChangeNameAlreadyOn: "Your box chat is currently on anti change name",
			antiChangeThemeAlreadyOn: "Your box chat is currently on anti change theme",
			antiChangeEmojiAlreadyOn: "Your box chat is currently on anti change emoji"
		}
	},
	appstore: {
		shortDescription: "Search app on appstore",
		longDescription: "Search app on appstore",
		text: {
			missingKeyword: "You haven't entered any keyword",
			noResult: "No result found for keyword %1"
		}
	},
	autosetname: {
		shortDescription: "Auto change nickname of new member",
		longDescription: "Auto change nickname of new member",
		guide: "   {pn} set <nickname>: use to set config to auto change nickname, with some shortcuts:\n   + {userName}: name of new member\n   + {userID}: member id\n   Example:\n    {pn} set {userName} 🚀\n\n   {pn} [on | off]: use to turn on/off this feature\n\n   {pn} [view | info]: show current config",
		text: {
			missingConfig: "Please enter the required configuration",
			configSuccess: "The configuration has been set successfully",
			currentConfig: "The current autoSetName configuration in your chat group is:\n%1",
			notSetConfig: "Your group has not set the autoSetName configuration",
			syntaxError: "Syntax error, only \"{pn} on\" or \"{pn} off\" can be used",
			turnOnSuccess: "The autoSetName feature has been turned on",
			turnOffSuccess: "The autoSetName feature has been turned off",
			error: "An error occurred while using the autoSetName feature, try turning off the invite link feature in the group and try again later"
		}
	},
	avatar: {
		shortDescription: "create anime avatar",
		longDescription: "create anime avatar with signature",
		guide: "{p}{n} <character id or character name> | <background text> | <signature> | <background color name or hex color>\n{p}{n} help: view how to use this command",
		text: {
			initImage: "Initializing image, please wait...",
			invalidCharacter: "Currently there are only %1 characters on the system, please enter a character id less than",
			notFoundCharacter: "No character named %1 was found in the character list",
			errorGetCharacter: "An error occurred while getting character data:\n%1: %2",
			success: "✅ Your avatar\nCharacter: %1\nID: %2\nBackground text: %3\nSignature: %4\nColor: %5",
			defaultColor: "default",
			error: "An error occurred\n%1: %2"
		}
	},
	badwords: {
		shortDescription: "Turn on/off bad words warning",
		longDescription: "Turn on/off/add/remove bad words warning, if a member violates, he will be warned, the second time he will be kicked out of the chat box",
		guide: "   {pn} add <words>: add banned words (you can add multiple words separated by commas \",\" or vertical bars \"|\")\n   {pn} delete <words>: delete banned words (you can delete multiple words separated by commas \",\" or vertical bars \"|\")\n   {pn} list <hide | leave blank>: turn off warning (add \"hide\" to hide banned words)\n   {pn} unwarn [<userID> | <@tag>]: remove 1 warning of 1 member\n   {pn} on: turn off warning\n   {pn} off: turn on warning",
		text: {
			onText: "on",
			offText: "off",
			onlyAdmin: "⚠️ | Only admins can add banned words to the list",
			missingWords: "⚠️ | You haven't entered the banned words",
			addedSuccess: "✅ | Added %1 banned words to the list",
			alreadyExist: "❌ | %1 banned words already exist in the list before: %2",
			tooShort: "⚠️ | %1 banned words cannot be added to the list because they are shorter than 2 characters: %2",
			onlyAdmin2: "⚠️ | Only admins can delete banned words from the list",
			missingWords2: "⚠️ | You haven't entered the words to delete",
			deletedSuccess: "✅ | Deleted %1 banned words from the list",
			notExist: "❌ | %1 banned words do not exist in the list before: %2",
			emptyList: "⚠️ | The list of banned words in your group is currently empty",
			badWordsList: "📑 | The list of banned words in your group: %1",
			onlyAdmin3: "⚠️ | Only admins can %1 this feature",
			turnedOnOrOff: "✅ | Banned words warning has been %1",
			onlyAdmin4: "⚠️ | Only admins can delete banned words warning",
			missingTarget: "⚠️ | You haven't entered user ID or tagged user",
			notWarned: "⚠️ | User %1 has not been warned for banned words",
			removedWarn: "✅ | User %1 | %2 has been removed 1 banned words warning",
			warned: "⚠️ | Banned words \"%1\" have been detected in your message, if you continue to violate you will be kicked from the group.",
			warned2: "⚠️ | Banned words \"%1\" have been detected in your message, you have violated 2 times and will be kicked from the group.",
			needAdmin: "Bot needs admin privileges to kick banned members",
			unwarned: "✅ | Removed banned words warning of user %1 | %2"
		}
	},
	balance: {
		shortDescription: "view your money",
		longDescription: "view your money or the money of the tagged person",
		guide: "   {pn}: view your money\n   {pn} <@tag>: view the money of the tagged person",
		text: {
			money: "You have %1$",
			moneyOf: "%1 has %2$"
		}
	},
	batslap: {
		shortDescription: "Batslap image",
		longDescription: "Batslap image",
		text: {
			noTag: "You must tag the person you want to slap"
		}
	},
	busy: {
		shortDescription: "turn on do not disturb mode",
		longDescription: "turn on do not disturb mode, when you are tagged bot will notify",
		guide: "   {pn} [empty | <reason>]: turn on do not disturb mode\n   {pn} off: turn off do not disturb mode",
		text: {
			turnedOff: "✅ | Do not disturb mode has been turned off",
			turnedOn: "✅ | Do not disturb mode has been turned on",
			turnedOnWithReason: "✅ | Do not disturb mode has been turned on with reason: %1",
			alreadyOn: "User %1 is currently busy",
			alreadyOnWithReason: "User %1 is currently busy with reason: %2"
		}
	},
	callad: {
		shortDescription: "send message to admin bot",
		longDescription: "send report, feedback, bug,... to admin bot",
		guide: "   {pn} <message>",
		text: {
			missingMessage: "Please enter the message you want to send to admin",
			sendByGroup: "\n- Sent from group: %1\n- Thread ID: %2",
			sendByUser: "\n- Sent from user",
			content: "\n\nContent:\n─────────────────\n%1\n─────────────────\nReply this message to send message to user",
			success: "Sent your message to admin successfully!",
			reply: "📍 Reply from admin %1:\n─────────────────\n%2\n─────────────────\nReply this message to continue send message to admin",
			replySuccess: "Sent your reply to admin successfully!",
			feedback: "📝 Feedback from user %1:\n- User ID: %2%3\n\nContent:\n─────────────────\n%4\n─────────────────\nReply this message to send message to user",
			replyUserSuccess: "Sent your reply to user successfully!"
		}
	},
	cmd: {
		shortDescription: "Manage command",
		longDescription: "Manage your command files",
		guide: "{pn} load <command file name>\n{pn} loadAll\n{pn} install <url> <command file name>: Download and install a command file from a url, url is the path to the file (raw)",
		text: {
			missingFileName: "⚠️ | Please enter the command name you want to reload",
			loaded: "✅ | Loaded command \"%1\" successfully",
			loadedError: "❌ | Failed to load command \"%1\" with error\n%2: %3",
			loadedSuccess: "✅ | Loaded successfully \"%1\" command",
			loadedFail: "❌ | Failed to load \"%1\" command\n%2",
			missingCommandNameUnload: "⚠️ | Please enter the command name you want to unload",
			unloaded: "✅ | Unloaded command \"%1\" successfully",
			unloadedError: "❌ | Failed to unload command \"%1\" with error\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and command file name you want to install",
			missingUrlOrCode: "⚠️ | Please enter the url or code of the command file you want to install",
			missingFileNameInstall: "⚠️ | Please enter the file name to save the command (with .js extension)",
			invalidUrlOrCode: "⚠️ | Unable to get command code",
			alreadExist: "⚠️ | The command file already exists, are you sure you want to overwrite the old command file?\nReact to this message to continue",
			installed: "✅ | Installed command \"%1\" successfully, the command file is saved at %2",
			installedError: "❌ | Failed to install command \"%1\" with error\n%2: %3",
			missingFile: "⚠️ | Command file \"%1\" not found",
			invalidFileName: "⚠️ | Invalid command file name",
			unloadedFile: "✅ | Unloaded command \"%1\""
		}
	},
	count: {
		shortDescription: "View group messages",
		longDescription: "View the number of messages of all members or yourself (since the bot joined the group)",
		guide: "   {pn}: used to view the number of messages of you\n   {pn} @tag: used to view the number of messages of those tagged\n   {pn} all: used to view the number of messages of all members",
		text: {
			count: "Number of messages of members:",
			endMessage: "Those who do not have a name in the list have not sent any messages.",
			page: "Page [%1/%2]",
			reply: "Reply to this message with the page number to view more",
			result: "%1 rank %2 with %3 messages",
			yourResult: "You are ranked %1 and have sent %2 messages in this group",
			invalidPage: "Invalid page number"
		}
	},
	customrankcard: {
		shortDescription: "Design rank card",
		longDescription: "Design rank card by your own",
		guide: {
			body: "   {pn} [maincolor | subcolor | linecolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <value>"
				+ "\n   In which: "
				+ "\n  + maincolor | background <value>: main background of rank card"
				+ "\n  + subcolor <value>: sub background"
				+ "\n  + linecolor <value>: color of line between main and sub background"
				+ "\n  + expbarcolor <value>: color of exp bar"
				+ "\n  + progresscolor <value>: color of current exp bar"
				+ "\n  + alphasubcolor <value>: opacity of sub background (from 0 -> 1)"
				+ "\n  + textcolor <value>: color of text (hex color or rgba)"
				+ "\n  + namecolor <value>: color of name"
				+ "\n  + expcolor <value>: color of exp"
				+ "\n  + rankcolor <value>: color of rank"
				+ "\n  + levelcolor <value>: color of level"
				+ "\n    • <value> can be hex color, rgb, rgba, gradient (each color is separated by space) or image url"
				+ "\n    • If you want to use gradient, please enter many colors separated by space"
				+ "\n   {pn} reset: reset all to default"
				+ "\n   Example:"
				+ "\n    {pn} maincolor #fff000"
				+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
				+ "\n    {pn} reset",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
			}
		},
		text: {
			invalidImage: "Invalid image url, please choose an url with image destination (jpg, jpeg, png, gif), you can upload image to https://imgbb.com/ and choose \"get direct link\" to get image url",
			invalidAttachment: "Invalid attachment, please choose an image file",
			invalidColor: "Invalid color code, please choose a hex color code (6 digits) or rgba color code",
			notSupportImage: "Url image is not supported with option \"%1\"",
			success: "Your changes have been saved, here is a preview",
			reseted: "All settings have been reset to default",
			invalidAlpha: "Please choose a number from 0 -> 1"
		}
	},
	dhbc: {
		shortDescription: "game catch the word",
		longDescription: "play game catch the word",
		guide: "{pn}",
		text: {
			reply: "Please reply this message with the answer\n%1",
			isSong: "This is the name of the song of the singer %1",
			notPlayer: "⚠️ You are not the player of this question",
			correct: "🎉 Congratulations you have answered correctly and received %1$",
			wrong: "⚠️ You have answered incorrectly"
		}
	},
	emojimix: {
		shortDescription: "Mix 2 emoji",
		longDescription: "Mix 2 emoji together",
		guide: "   {pn} <emoji1> <emoji2>\n   Example:  {pn} 🤣 🥰"
	},
	eval: {
		shortDescription: "Test code quickly",
		longDescription: "Test code quickly",
		guide: "{pn} <code to test>",
		text: {
			error: "❌ An error occurred:"
		}
	},
	event: {
		shortDescription: "Manage event command",
		longDescription: "Manage your event command files",
		guide: "{pn} load <command file name>\n{pn} loadAll\n{pn} install <url> <command file name>: Download and load event command, url is the path to the command file (raw)",
		text: {
			missingFileName: "⚠️ | Please enter the command name you want to reload",
			loaded: "✅ | Loaded event command \"%1\" successfully",
			loadedError: "❌ | Loaded event command \"%1\" failed with error\n%2: %3",
			loadedSuccess: "✅ | Loaded \"%1\" event command successfully",
			loadedFail: "❌ | Loaded event command \"%1\" failed\n%2",
			missingCommandNameUnload: "⚠️ | Please enter the command name you want to unload",
			unloaded: "✅ | Unloaded event command \"%1\" successfully",
			unloadedError: "❌ | Unloaded event command \"%1\" failed with error\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and command file name you want to install",
			missingUrlOrCode: "⚠️ | Please enter the url or code of the command file you want to install",
			missingFileNameInstall: "⚠️ | Please enter the file name to save the command (with .js extension)",
			invalidUrlOrCode: "⚠️ | Unable to get command code",
			alreadExist: "⚠️ | The command file already exists, are you sure you want to overwrite the old command file?\nReact to this message to continue",
			installed: "✅ | Installed event command \"%1\" successfully, the command file is saved at %2",
			installedError: "❌ | Installed event command \"%1\" failed with error\n%2: %3",
			missingFile: "⚠️ | File \"%1\" not found",
			invalidFileName: "⚠️ | Invalid file name",
			unloadedFile: "✅ | Unloaded command \"%1\""
		}
	},
	filteruser: {
		shortDescription: "filter group members",
		longDescription: "filter group members by number of messages or locked account",
		guide: "   {pn} [<number of messages> | die]",
		text: {
			needAdmin: "⚠️ | Please add the bot as a group admin to use this command",
			confirm: "⚠️ | Are you sure you want to delete group members with less than %1 messages?\nReact to this message to confirm",
			kickByBlock: "✅ | Successfully deleted %1 members who are locked acc",
			kickByMsg: "✅ | Successfully deleted %1 members with less than %2 messages",
			kickError: "❌ | An error occurred and could not kick %1 members:\n%2",
			noBlock: "✅ | There are no members who are locked acc",
			noMsg: "✅ | There are no members with less than %1 messages"
		}
	},
	getfbstate: {
		shortDescription: "Get current fbstate",
		longDescription: "Get current fbstate",
		guide: "{pn}",
		text: {
			success: "Sent fbstate to you, please check bot's private message"
		}
	},
	grouptag: {
		shortDescription: "Tag by group",
		longDescription: "Tag members by group",
		guide: "   {pn} add <groupTagName> <@tags>: use to add new group tag or add members to group tag\n   Example:\n    {pn} TEAM1 @tag1 @tag2\n\n   {pn} del <groupTagName> <@tags>: use to remove members from group tag\n   Example:\n    {pn} del TEAM1 @tag1 @tag2\n\n   {pn} remove <groupTagName>: use to remove group tag\n   Example:\n    {pn} remove TEAM1\n\n   {pn} rename <groupTagName> | <newGroupTagName>: use to rename group tag\n\n   {pn} [list | all]: use to view list of group tag in your group chat\n\n   {pn} info <groupTagName>: use to view info of group tag",
		text: {
			noGroupTagName: "Please enter group tag name",
			noMention: "You haven't tagged any member to add to group tag",
			addedSuccess: "Added members:\n%1\nto group tag \"%2\"",
			addedSuccess2: "Added group tag \"%1\" with members:\n%2",
			existedInGroupTag: "Members:\n%1\nalready existed in group tag \"%2\"",
			notExistedInGroupTag: "Members:\n%1\ndoesn't exist in group tag \"%2\"",
			noExistedGroupTag: "Group tag \"%1\" doesn't exist in your group chat",
			noExistedGroupTag2: "Your group chat hasn't added any group tag",
			noMentionDel: "Please tag members to remove from group tag \"%1\"",
			deletedSuccess: "Deleted members:\n%1\nfrom group tag \"%2\"",
			deletedSuccess2: "Deleted group tag \"%1\"",
			tagged: "Tag group \"%1\":\n%2",
			noGroupTagName2: "Please enter old group tag name and new group tag name, separated by \"|\"",
			renamedSuccess: "Renamed group tag \"%1\" to \"%2\"",
			infoGroupTag: "📑 | Group name: \"%1\"\n👥 | Number of members: %2\n👨‍👩‍👧‍👦 | List of members:\n %3"
		}
	},
	help: {
		shortDescription: "View command usage",
		longDescription: "View command usage",
		guide: "{pn} [empty | <page number> | <command name>]",
		text: {
			help: "╭─────────────⭓\n%1\n├─────⭔\n│ Page [ %2/%3 ]\n│ Currently, the bot has %4 commands that can be used\n│ » Type %5help <page> to view the command list\n│ » Type %5help to view the details of how to use that command\n├────────⭔\n│ %6\n╰─────────────⭓",
			help2: "%1├───────⭔\n│ » Currently, the bot has %2 commands that can be used\n│ » Type %3help <command name> to view the details of how to use that command\n│ %4\n╰─────────────⭓",
			commandNotFound: "Command \"%1\" does not exist",
			getInfoCommand: "╭── NAME ────⭓\n│ %1\n├── INFO\n│ Description: %2\n│ Other names: %3\n│ Other names in your group: %4\n│ Version: %5\n│ Role: %6\n│ Time per command: %7s\n│ Author: %8\n├── Usage\n%9\n├── Notes\n│ The content inside <XXXXX> can be changed\n│ The content inside [a|b|c] is a or b or c\n╰──────⭔",
			doNotHave: "Do not have",
			roleText0: "0 (All users)",
			roleText1: "1 (Group administrators)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (set role, all users)",
			roleText1setRole: "1 (set role, group administrators)",
			pageNotFound: "Page %1 does not exist"
		}
	},
	kick: {
		shortDescription: "Kick member",
		longDescription: "Kick member out of chat box",
		guide: "{pn} @tags: use to kick members who are tagged"
	},
	loadconfig: {
		shortDescription: "Reload config",
		longDescription: "Reload config of bot"
	},
	moon: {
		shortDescription: "view moon image",
		longDescription: "view moon image on the night you choose (dd/mm/yyyy)",
		guide: "  {pn} <day/month/year>\n   {pn} <day/month/year> <caption>",
		text: {
			invalidDateFormat: "Please enter a valid date in DD/MM/YYYY format",
			error: "An error occurred while getting the moon image of %1",
			invalidDate: "%1 is not a valid date",
			caption: "- Moon image on %1"
		}
	},
	notification: {
		shortDescription: "Send notification from admin to all box",
		longDescription: "Send notification from admin to all box",
		guide: "{pn} <tin nhắn>",
		text: {
			missingMessage: "Please enter the message you want to send to all groups",
			notification: "Notification from admin bot to all chat groups (do not reply to this message)",
			sendingNotification: "Start sending notification from admin bot to %1 chat groups",
			sentNotification: "✅ Sent notification to %1 groups successfully",
			errorSendingNotification: "An error occurred while sending to %1 groups:\n %2"
		}
	},
	prefix: {
		shortDescription: "Thay đổi prefix của bot",
		longDescription: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
		guide: "   {pn} <new prefix>: change new prefix in your box chat\n   Example:\n    {pn} #\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)\n   Example:\n    {pn} # -g\n\n   {pn} reset: change prefix in your box chat to default",
		text: {
			reset: "Your prefix has been reset to default: %1",
			onlyAdmin: "Only admin can change prefix of system bot",
			confirmGlobal: "Please react to this message to confirm change prefix of system bot",
			confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
			successGlobal: "Changed prefix of system bot to: %1",
			successThisThread: "Changed prefix in your box chat to: %1",
			myPrefix: "🌐 System prefix: %1\n🛸 Your box chat prefix: %2"
		}
	},
	rank: {
		shortDescription: "View level of user",
		longDescription: "View your level or the level of the tagged person. You can tag many people"
	},
	rankup: {
		shortDescription: "Turn on/off level up notification",
		longDescription: "Turn on/off level up notification",
		guide: "{pn} [on | off]",
		text: {
			syntaxError: "Syntax error, only use {pn} on or {pn} off",
			turnedOn: "Turned on level up notification",
			turnedOff: "Turned off level up notification",
			notiMessage: "🎉🎉 Congratulations on reaching level %1"
		}
	},
	refresh: {
		shortDescription: "refresh information",
		longDescription: "refresh information of group chat or user",
		guide: "   {pn} [thread | group]: refresh information of your group chat\n   {pn} group <threadID>: refresh information of group chat by ID\n\n   {pn} user: refresh information of your user\n   {pn} user [<userID> | @tag]: refresh information of user by ID",
		text: {
			refreshMyThreadSuccess: "✅ | Refresh information of your group chat successfully!",
			refreshThreadTargetSuccess: "✅ | Refresh information of group chat %1 successfully!"
		}
	},
	rules: {
		shortDescription: "Group rules",
		longDescription: "Create/view/add/edit/change position/delete group rules of you",
		guide: "   {pn} [add | -a] <rule to add>: add rule for group.\n   {pn}: view group rules.\n   {pn} [edit | -e] <n> <content after edit>: edit rule number n.\n   {pn} [move | -m] <stt1> <stt2> swap position of rule number <stt1> and <stt2>.\n   {pn} [delete | -d] <n>: delete rule number n.\n   {pn} [remove | -r]: delete all rules of group.\n\n   Example:\n    {pn} add don't spam\n    {pn} move 1 3\n    {pn} -e 1 don't spam message in group\n    {pn} -r"
	},
	sendnoti: {
		shortDescription: "Create and send notification to groups",
		longDescription: "Create and send notification to groups that you manage",
		guide: "   {pn} create <groupName>: Create a new notification group with name <groupName>\n   Example:\n    {pn} create TEAM1\n\n   {pn} add <groupName>: add current box chat to notification group <groupName> (you must be admin of this box chat)\n   Example:\n    {pn} add TEAM1\n\n   {pn} delete: remove current box chat from notification group <groupName> (you must be creator of this group)\n   Example:\n    {pn} delete TEAM1\n\n   {pn} send <groupName> | <message>: send notification to all groups in notification group <groupName> (you must be admin of those groups)\n   Example:\n    {pn} remove TEAM1\n\n   {pn} remove <groupName>: remove notification group <groupName> (you must be creator of notification group <groupName>)\n   Example:\n    {pn} remove TEAM1",
		text: {
			missingGroupName: "Please enter groupNoti name",
			groupNameExists: "Notification group with name %1 has been created by you before, please choose another name",
			createdGroup: "Created notification group successfully:\n- Name: %1\n- ID: %2",
			missingGroupNameToAdd: "Please enter groupNoti name you want to add this group chat to",
			groupNameNotExists: "You have not created/manage any notification group with name: %1",
			notAdmin: "You are not admin of this group chat",
			added: "Added current group chat to notification group: %1",
			missingGroupNameToDelete: "Please enter groupNoti name you want to delete this group chat from list",
			notInGroup: "Current group chat is not in notification group %1",
			deleted: "Deleted current group chat from notification group: %1",
			failed: "Failed to send notification to %1 group chats: \n%2",
			missingGroupNameToRemove: "Please enter groupNoti name you want to remove",
			removed: "Removed notification group: %1",
			missingGroupNameToSend: "Please enter groupNoti name you want to send message",
			groupIsEmpty: "Notification group \"%1\" is empty",
			sending: "Sending notification to %1 group chats",
			success: "Sent notification to %1 group chats in notification group \"%2\" successfully",
			notAdminOfGroup: "You are not admin of this group",
			missingGroupNameToView: "Please enter groupNoti name you want to view info",
			groupInfo: "- Group Name: %1\n - ID: %2\n - Created at: %3\n%4 ",
			groupInfoHasGroup: "- Has group chats: \n%1",
			noGroup: "You have not created/manage any notification group"
		}
	},
	setalias: {
		shortDescription: "Add an alias for the command",
		longDescription: "Add an alias for any command in your group",
		guide: "  This command is used to add/remove alias for any command in your group\n   {pn} add <alias> <command>: add an alias for the command in your group\n   {pn} add <alias> <command> -g: add an alias for the command in the whole system (only bot admin)\nExample:\n    {pn} add ctrk customrankcard\n\n   {pn} [remove | rm] <alias> <command>: remove an alias for the command in your group\n   {pn} [remove | rm] <alias> <command> -g: remove an alias for the command in the whole system (only bot admin)\nExample:\n    {pn} rm ctrk customrankcard\n\n   {pn} list: list all alias for commands in your group\n   {pn} list -g: list all alias for commands in the whole system"
	},
	setavt: {
		shortDescription: "Change bot avatar",
		longDescription: "Change bot avatar",
		text: {
			cannotGetImage: "❌ | An error occurred while querying the image url",
			invalidImageFormat: "❌ | Invalid image format",
			changedAvatar: "✅ | Changed bot avatar successfully"
		}
	},
	setlang: {
		shortDescription: "Set default language",
		longDescription: "Set default language of bot for current chat or all chats",
		guide: "   {pn} <language code ISO 639-1\n   Example:    {pn} en    {pn} vi    {pn} ja",
		text: {
			setLangForAll: "Set default language for all chats: %1",
			setLangForCurrent: "Set default language for current chat: %1",
			noPermission: "Only bot admin can use this command"
		}
	},
	setleave: {
		shortDescription: "Edit leave message",
		longDescription: "Edit content/turn on/off leave message when member leave your group chat",
		guide: {
			body: "   {pn} on: Turn on leave message\n   {pn} off: Turn off leave message\n   {pn} text [<content> | reset]: edit text content or reset to default, available shortcuts:\n  + {userName}: name of member who leave group\n  + {userNameTag}: name of member who leave group (tag)\n  + {boxName}: name of group chat\n  + {type}: leave/kicked by admin\n  + {session}: session in day\n\n   Example:\n    {pn} text {userName} has {type} group, see you again 🤧\n\n   Reply or send a message with file with content {pn} file: to add attachment file to leave message (image, video, audio)\n\nExample:\n   {pn} file reset: reset file",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setleave/setleave_en_1.png`]: "https://i.ibb.co/2FKJHJr/guide1.png"
			}
		},
		text: {
			missingContent: "Please enter content",
			edited: "Edited leave message content of your group to:\n%1",
			reseted: "Reseted leave message content",
			noFile: "No leave message attachment file to reset",
			resetedFile: "Reseted leave message attachment file successfully",
			missingFile: "Please reply this message with image/video/audio file",
			addedFile: "Added %1 attachment file to your leave message"
		}
	},
	setname: {
		shortDescription: "Change nickname",
		longDescription: "Change nickname of all members in chat or members tagged by a format",
		guide: {
			body: "   {pn} <nick name>: change nickname of yourself\n   {pn} @tags <nick name>: change nickname of members tagged\n   {pn} all <nick name>: change nickname of all members in chat\n\nWith available shortcuts:\n   + {userName}: name of member\n   + {userID}: ID of member\n\n   Example: (see image)",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setname_1.png`]: "https://i.ibb.co/gFh23zb/guide1.png",
				[`${process.cwd()}/scripts/cmds/assets/guide/setname_2.png`]: "https://i.ibb.co/BNWHKgj/guide2.png"
			}
		},
		text: {
			error: "An error has occurred, try turning off the invite link feature in the group and try again later"
		}
	},
	setrole: {
		shortDescription: "Edit role of command",
		longDescription: "Edit role of command (commands with role < 2)",
		guide: "   {pn} <commandName> <new role>: set new role for command\n   With:\n   + <commandName>: command name\n   + <new role>: new role of command with:\n   + <new role> = 0: command can be used by all members in group\n   + <new role> = 1: command can be used by admin only\n   + <new role> = default: reset role of command to default\n   Example:\n    {pn} rank 1: (command rank can be used by admin only)\n    {pn} rank 0: (command rank can be used by all members in group)\n    {pn} rank default: reset to default\n—————\n   {pn} [viewrole|view|show]: view role of edited commands",
		text: {
			noEditedCommand: "✅ Your group has no edited command",
			editedCommand: "⚠️ Your group has edited commands:\n",
			noPermission: "❗ Only admin can use this command",
			commandNotFound: "Command \"%1\" not found",
			noChangeRole: "❗ Can't change role of command \"%1\"",
			resetRole: "Reset role of command \"%1\" to default",
			changedRole: "Changed role of command \"%1\" to %2"
		}
	},
	setwelcome: {
		shortDescription: "Edit welcome message content",
		longDescription: "Edit welcome message content when new member join your group chat",
		guide: {
			body: "   {pn} text [<content> | reset]: edit text content or reset to default, with some shortcuts:\n  + {userName}: new member name\n  + {userNameTag}: new member name (tag)\n  + {boxName}:  group chat name\n  + {multiple}: you || you guys\n  + {session}:  session in day\n\n   Example:\n    {pn} text Hello {userName}, welcome to {boxName}, have a nice day {multiple}\n\n   Reply (phản hồi) or send a message with file with content {pn} file: to add file attachments to welcome message (image, video, audio)\n\n   Example:\n    {pn} file reset: delete file attachments",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setwelcome/setwelcome_en_1.png`]: "https://i.ibb.co/vsCz0ks/setwelcome-en-1.png"
			}
		},
		text: {
			missingContent: "Please enter welcome message content",
			edited: "Edited welcome message content of your group to: %1",
			reseted: "Reseted welcome message content",
			noFile: "No file attachments to delete",
			resetedFile: "Reseted file attachments successfully",
			missingFile: "Please reply this message with image/video/audio file",
			addedFile: "Added %1 file attachments to your group welcome message"
		}
	},
	shortcut: {
		shortDescription: "Add a shortcut for you",
		longDescription: "Add a shortcut for your message in group chat",
		text: {
			missingContent: 'Please enter the message content',
			shortcutExists: 'Shortcut "%1" already exists, react to this message to replace the content of the shortcut',
			shortcutExistsByOther: 'Shortcut %1 has been added by other member, please try another keyword',
			added: 'Added shortcut %1 => %2',
			addedAttachment: ' with %1 attachment(s)',
			missingKey: 'Please enter the keyword of the shortcut you want to delete',
			notFound: 'No shortcut found for keyword %1 in your group chat',
			onlyAdmin: 'Only administrators can delete other people\'s shortcuts',
			deleted: 'Deleted shortcut %1',
			empty: 'Your group chat has not added any shortcuts',
			message: 'Message',
			attachment: 'Attachment',
			list: 'Your shortcuts list',
			onlyAdminRemoveAll: 'Only administrators can remove all shortcuts in the group chat',
			confirmRemoveAll: 'Are you sure you want to remove all shortcuts in this group chat? (react to this message to confirm)',
			removedAll: 'Removed all shortcuts in your group chat'
		}
	},
	simsimi: {
		shortDescription: "Simsimi",
		longDescription: "Chat with simsimi",
		guide: "   {pn} [on | off]: turn on/off simsimi\n\n   {pn} <word>: chat with simsimi\n   Example:\n    {pn} hi",
		text: {
			turnedOn: "Turned on simsimi successfully!",
			turnedOff: "Turned off simsimi successfully!",
			chatting: "Chatting with simsimi...",
			error: "Simsimi is busy, please try again later"
		}
	},
	sorthelp: {
		shortDescription: "Sort help list",
		longDescription: "Sort help list",
		guide: "{pn} [name | category]",
		text: {
			savedName: "Saved sort help list by name",
			savedCategory: "Saved sort help list by category"
		}
	},
	thread: {
		shortDescription: "Manage group chat",
		longDescription: "Manage group chat in bot system",
		guide: "   {pn} [find | -f | search | -s] <name to find>: search group chat in bot data by name\n   {pn} [find | -f | search | -s] [-j | joined] <name to find>: search group chat in bot data that bot still joined by name\n   {pn} [ban | -b] [<tid> | leave blank] <reason>: use to ban group with id <tid> or current group using bot\n   Example:\n    {pn} ban 3950898668362484 spam bot\n    {pn} ban spam too much\n    {pn} unban [<tid> | leave blank] to unban group with id <tid> or current group",
		text: {
			noPermission: "You don't have permission to use this feature",
			found: "🔎 Found %1 group matching the keyword \"%3\" in bot data:\n%3",
			notFound: "❌ No group found matching the keyword: \"%1\" in bot data",
			hasBanned: "Group with id [%1 | %2] has been banned before:\n» Reason: %3\n» Time: %4",
			banned: "Banned group with id [%1 | %2] using bot.\n» Reason: %3\n» Time: %4",
			notBanned: "Group with id [%1 | %2] is not banned using bot",
			unbanned: "Unbanned group with tid [%1 | %2] using bot",
			missingReason: "Ban reason cannot be empty",
			info: "» Box ID: %1\n» Name: %2\n» Date created data: %3\n» Total members: %4\n» Boy: %5 members\n» Girl: %6 members\n» Total messages: %7%8"
		}
	},
	tid: {
		shortDescription: "View threadID",
		longDescription: "View threadID of your group chat",
		guide: "{pn}"
	},
	tik: {
		shortDescription: "Tiktok",
		longDescription: "Download video/slide (image), audio from tiktok link",
		guide: "   {pn} [video|-v|v] <url>: use to download video/slide (image) from tiktok link.\n   {pn} [audio|-a|a] <url>: use to download audio from tiktok link",
		text: {
			invalidUrl: "Please enter a valid tiktok url",
			downloadingVideo: "Downloading video: %1...",
			downloadedSlide: "Downloaded slide: %1\n%2",
			downloadedVideo: "Downloaded video: %1\nDownload Url: %2",
			downloadingAudio: "Downloading audio: %1...",
			downloadedAudio: "Downloaded audio: %1"
		}
	},
	trigger: {
		shortDescription: "Trigger image",
		longDescription: "Trigger image",
		guide: "{pn} [@tag | empty]"
	},
	uid: {
		shortDescription: "View uid",
		longDescription: "View facebook user id of user",
		guide: "   {pn}: use to view your facebook user id\n   {pn} @tag: view facebook user id of tagged people\n   {pn} <profile link>: view facebook user id of profile link",
		text: {
			syntaxError: "Please tag the person you want to view uid or leave it blank to view your own uid"
		}
	},
	unsend: {
		shortDescription: "Unsend bot's message",
		longDescription: "Unsend bot's message",
		guide: "reply the message you want to unsend and call the command {pn}",
		text: {
			syntaxError: "Please reply the message you want to unsend"
		}
	},
	user: {
		shortDescription: "Manage users",
		longDescription: "Manage users in bot system",
		guide: "   {pn} [find | -f | search | -s] <name to find>: search for users in bot data by name\n\n   {pn} [ban | -b] [<uid> | @tag | reply message] <reason>: to ban user with id <uid> or tagged user or sender of message replied using bot\n\n   {pn} unban [<uid> | @tag | reply message]: to unban user using bot",
		text: {
			noUserFound: "❌ No user found with name matching keyword: \"%1\" in bot data",
			userFound: "🔎 Found %1 user with name matching keyword \"%2\" in bot data:\n%3",
			uidRequired: "Uid of user to ban cannot be empty, please enter uid or tag or reply message of 1 user by user ban <uid> <reason>",
			reasonRequired: "Reason to ban user cannot be empty, please enter uid or tag or reply message of 1 user by user ban <uid> <reason>",
			userHasBanned: "User with id [%1 | %2] has been banned before:\n» Reason: %3\n» Date: %4",
			userBanned: "User with id [%1 | %2] has been banned:\n» Reason: %3\n» Date: %4",
			uidRequiredUnban: "Uid of user to unban cannot be empty",
			userNotBanned: "User with id [%1 | %2] is not banned",
			userUnbanned: "User with id [%1 | %2] has been unbanned"
		}
	},
	videofb: {
		shortDescription: "Download video from facebook",
		longDescription: "Download video/story from facebook (public)",
		guide: "   {pn} <url video/story>: tải video từ facebook",
		text: {
			missingUrl: "Please enter the facebook video/story (public) url you want to download",
			error: "An error occurred while downloading the video",
			downloading: "Downloading video for you",
			tooLarge: "Sorry, we can't download the video for you because the size is larger than 83MB"
		}
	},
	warn: {
		shortDescription: "warn member",
		longDescription: "warn member in group, if they have 3 warns, they will be banned",
		guide: "   {pn} @tag <reason>: warn member\n   {pn} list: view list of warned members\n   {pn} listban: view list of banned members\n   {pn} info [@tag | <uid> | leave blank]: view warn info of tagged member or uid or yourself\n   {pn} unban <uid>: unban member by uid\n   {pn} unwarn <uid> [<warn number> | leave blank]: unwarn member by uid and warn number\n   {pn} warn reset: reset all warn data\n⚠️ You need to set admin for bot to auto kick banned members",
		text: {
			list: "List of members who have been warned:\n%1\n\nTo view the details of the warnings, use the \"%2warn info [@tag | <uid> | leave blank]\" command: to view the warning information of the tagged person or uid or yourself",
			listBan: "List of members who have been warned 3 times and banned from the box:\n%1",
			listEmpty: "Your group has no members who have been warned",
			listBanEmpty: "Your group has no members banned from the box",
			invalidUid: "Please enter a valid uid of the person you want to view information",
			noData: "No data",
			noPermission: "❌ Only group administrators can unban members banned from the box",
			invalidUid2: "⚠️ Please enter a valid uid of the person you want to unban",
			notBanned: "⚠️ The user with id %1 has not been banned from your box",
			unbanSuccess: "✅ Successfully unbanned member [%1 | %2], currently this person can join your chat box",
			noPermission2: "❌ Only group administrators can remove warnings from members in the group",
			invalidUid3: "⚠️ Please enter a uid or tag the person you want to remove the warning",
			noData2: "⚠️ The user with id %1 has no warning data",
			notEnoughWarn: "❌ The user %1 only has %2 warnings",
			unwarnSuccess: "✅ Successfully removed the %1 warning of member [%2 | %3]",
			noPermission3: "❌ Only group administrators can reset warning data",
			resetWarnSuccess: "✅ Successfully reset warning data",
			noPermission4: "❌ Only group administrators can warn members in the group",
			invalidUid4: "⚠️ You need to tag or reply to the message of the person you want to warn",
			warnSuccess: "⚠️ Warned member %1 times %2\n- Uid: %3\n- Reason: %4\n- Date Time: %5\nThis member has been warned 3 times and banned from the box, to unban use the command \"%6warn unban <uid>\" (with uid is the uid of the person you want to unban)",
			noPermission5: "⚠️ Bot needs administrator permissions to kick banned members",
			warnSuccess2: "⚠️ Warned member %1 times %2\n- Uid: %3\n- Reason: %4\n- Date Time: %5\nIf this person violates %6 more times, they will be banned from the box",
			hasBanned: "⚠️ The following members have been warned 3 times before and banned from the box:\n%1",
			failedKick: "⚠️ An error occurred when kicking the following members:\n%1"
		}
	},
	weather: {
		shortDescription: "weather forecast",
		longDescription: "view the current and next 5 days weather forecast",
		guide: "{pn} <location>",
		text: {
			syntaxError: "Please enter a location",
			notFound: "Location not found: %1",
			error: "An error has occurred: %1",
			today: "Today's weather:\n%1\n🌡 Low - high temperature %2°C - %3°C\n🌡 Feels like %4°C - %5°C\n🌅 Sunrise %6\n🌄 Sunset %7\n🌃 Moonrise %8\n🏙️ Moonset %9\n🌞 Day: %10\n🌙 Night: %11"
		}
	},
	ytb: {
		shortDescription: "YouTube",
		longDescription: "Download video, audio or view video information on YouTube",
		guide: "   {pn} [video|-v] [<video name>|<video link>]: use to download video from youtube.\n   {pn} [audio|-a] [<video name>|<video link>]: use to download audio from youtube\n   {pn} [info|-i] [<video name>|<video link>]: use to view video information from youtube\n   Example:\n    {pn} -v Fallen Kingdom\n    {pn} -a Fallen Kingdom\n    {pn} -i Fallen Kingdom",
		text: {
			error: "An error has occurred: %1",
			noResult: "No search results match the keyword %1",
			choose: "%1Reply to the message with the number to choose or any content to cancel",
			downloading: "Downloading video %1",
			noVideo: "Sorry, no video was found with a size less than 83MB",
			downloadingAudio: "Downloading audio %1",
			noAudio: "Sorry, no audio was found with a size less than 26MB",
			info: "💠 Title: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Video time: %4\n👀 View: %5\n👍 Like: %6\n🆙 Upload date: %7\n🔠 ID: %8\n🔗 Link: %9",
			listChapter: "\n📖 List chapter: %1\n"
		}
	}
};