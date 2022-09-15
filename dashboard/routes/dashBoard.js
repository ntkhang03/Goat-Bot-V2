const express = require('express');
const router = express.Router();

module.exports = function ({ isAuthenticated_G, isVeryfiUserIDFacebook_G, checkHasAndInThread_G, threadsData, checkAuthConfigDashboardOfThread, imageExt, videoExt, audioExt, convertSize, drive, isVideoFile }) {
	router
		.get("/", [isAuthenticated_G, isVeryfiUserIDFacebook_G], (req, res) => {
			let allThread = threadsData.getAll();
			allThread = allThread.filter(t => t.members.some(m => m.userID == req.user.facebookUserID && m.inGroup)/* && (api ? t.members.some(m => m.userID == api.getCurrentUserID()) : true)*/);
			res.render("dashboard", { threads: allThread });
		})
		.get("/:threadID", [isAuthenticated_G, isVeryfiUserIDFacebook_G, checkHasAndInThread_G], async (req, res) => {
			const { threadData } = req;
			let authConfigDashboard = true;
			const warnings = [];
			if (!checkAuthConfigDashboardOfThread(threadData, req.user.facebookUserID)) {
				warnings.push({ msg: '[!] Chỉ quản trị viên của nhóm chat hoặc những thành viên được cho phép mới có thể chỉnh sửa dashboard' });
				authConfigDashboard = false;
			}
			delete req.threadData;
			res.render("dashboard-thread", {
				threadData,
				threadDataJSON: encodeURIComponent(JSON.stringify(threadData)),
				authConfigDashboard,
				warnings
			});
		})
		.get("/:threadID/:command", [isAuthenticated_G, isVeryfiUserIDFacebook_G, checkHasAndInThread_G], async (req, res) => {
			const command = req.params.command;
			const threadData = req.threadData;
			const threadDataJSON = encodeURIComponent(JSON.stringify(threadData)); // prevent xss attack
			const variables = {
				threadID: req.params.threadID,
				threadData,
				threadDataJSON,
				command,
				imageExt,
				videoExt,
				audioExt,
				convertSize,
				isVideoFile
			};
			let renderFile;

			switch (command) {
				case "welcome": {
					renderFile = "dashboard-welcome";
					let pending = [];
					(threadData.data.welcomeAttachment || []).forEach(fileId => {
						pending.push(drive.default.files.get({
							fileId,
							fields: 'name,mimeType,size,id'
						}));
					});

					pending = (await Promise.allSettled(pending))
						.filter(item => item.status == 'fulfilled')
						.map(({ value }) => ({
							...value.data,
							urlDownload: global.utils.drive.getUrlDownload(value.data.id)
						}));
					variables.defaultWelcomeMessage = global.GoatBot.configCommands.envEvents.welcome.defaultWelcomeMessage;
					variables.welcomeAttachments = pending;
					break;
				}
				case "leave": {
					renderFile = "dashboard-leave";
					let pending = [];
					(threadData.data.leaveAttachment || []).forEach(fileId => {
						pending.push(drive.default.files.get({
							fileId,
							fields: 'name,mimeType,size,id'
						}));
					});
					pending = (await Promise.allSettled(pending))
						.filter(item => item.status == 'fulfilled')
						.map(({ value }) => ({
							...value.data,
							urlDownload: global.utils.drive.getUrlDownload(value.data.id)
						}));
					variables.defaultLeaveMessage = global.GoatBot.configCommands.envEvents.leave.defaultLeaveMessage;
					variables.leaveAttachments = pending;
					break;
				}
				case "rankup": {
					renderFile = "dashboard-rankup";
					break;
				}
				case "custom-cmd": {
					renderFile = "dashboard-custom-cmd";
					break;
				}
				default: {
					req.flash('errors', { msg: 'Command not found' });
					return res.redirect('/dashboard');
				}
			}

			res.render(renderFile, variables);
		});

	return router;
};