const stream = require('stream');
const express = require('express');
const path = require('path');
const mimeDB = require("mime-db");
const { request } = require('http');
const router = express.Router();
const videoExt = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'rrc', 'gifv',
	'mng', 'mov', 'avi', 'qt', 'wmv', 'yuv', 'rm', 'asf', 'amv', 'mp4',
	'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm4v', 'svi', '3gp',
	'3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b', 'mod'
];

module.exports = function ({ isAuthenticated_P, isVeryfiUserIDFacebook_P, checkHasAndInThread_P, isAuthenticated_G, isVeryfiUserIDFacebook_G, threadsData, drive, checkAuthConfigDashboardOfThread, usersData, createLimiter, getThreadDataSync, middlewareCheckAuthConfigDashboardOfThread_P, isVideoFile }) {
	const apiLimiter = createLimiter(1000 * 60 * 5, 10);
	router
		.post('/delete/:slug', [isAuthenticated_P, isVeryfiUserIDFacebook_P, checkHasAndInThread_P, middlewareCheckAuthConfigDashboardOfThread_P, apiLimiter], async function (req, res) {
			const { fileIDs, threadID, location } = req.body;
			const threadData = getThreadDataSync(threadID);
			if (!threadData)
				return res.status(400).send({
					status: 'error',
					error: 'COULD_NOT_FOUND_THREAD',
					message: `Couldn\'t find thread data of thread ID ${threadID}`
				});

			const pendingDelete = [];
			let dataOfLocation = await threadsData.get(threadID, location);
			const fileIDsDeleted = [];

			for (const fileID of fileIDs) {
				pendingDelete.push(
					new Promise(async (resolve, reject) => {
						try {
							const index = dataOfLocation.indexOf(fileID);
							if (index == -1)
								throw ({
									error: 'PERMISSION_DENIED',
									message: 'Không tìm thấy file'
								});

							await drive.deleteFile(fileID);
							fileIDsDeleted.push(fileID);
							resolve({
								id: fileID,
								status: 'success'
							});
						}
						catch (err) {
							reject({
								id: fileID,
								error: err.error,
								message: err.message
							});
						}
					})
				);
			}

			const successPromise = await Promise.allSettled(pendingDelete);
			dataOfLocation = dataOfLocation.filter(fileID => !fileIDsDeleted.includes(fileID));
			const success = successPromise
				.filter(item => item.status == 'fulfilled')
				.map(({ value }) => value.id);
			const failed = successPromise
				.filter(item => item.status == 'rejected')
				.map(({ value }) => ({
					id: value.id,
					error: value.error,
					message: value.message
				}));

			await threadsData.set(threadID, dataOfLocation, location);

			res.type("json").send(JSON.stringify({
				status: 'success',
				success,
				failed
			}));
		})
		.post('/upload/:type', [isAuthenticated_P, isVeryfiUserIDFacebook_P, checkHasAndInThread_P, apiLimiter], async function (req, res) {
			const { threadID, commandName } = req.body;
			const { type } = req.params;
			const userID = req.user.facebookUserID;
			if (!commandName)
				return res.status(400).json({
					status: 'error',
					error: 'COMMAND_NAME_NOT_FOUND',
					message: 'Command name not found'
				});

			if (!['welcomeAttachment', 'leaveAttachment'].includes(type))
				return res.status(400).send({
					status: 'error',
					error: 'TYPE_ERROR',
					message: 'type illegal'
				});

			if (!checkAuthConfigDashboardOfThread(threadID, userID))
				return res.status(400).json({
					status: 'error',
					error: 'PERMISSION_DENIED',
					message: 'You are not authorized to upload file in this thread'
				});

			let files = req.files;
			if (!files)
				return res.status(400).json({
					status: 'error',
					error: 'FILE_NOT_FOUND',
					message: 'No files were uploaded.'
				});

			files = Object.values(files);
			let i = 0;

			const pendingUpload = files.reduce((arr, file) => {
				if (isVideoFile(file.mimetype)) {
					if (file.size > 83 * 1024 * 1024) {
						arr.push({
							count: i++,
							rootName: file.name,
							file: Promise.reject({
								error: 'FILE_TOO_LARGE',
								message: 'File too large, max size is 83MB'
							})
						});
						return arr;
					}
				}
				else {
					if (file.size > 25 * 1024 * 1024) {
						arr.push({
							count: i++,
							rootName: file.name,
							file: Promise.reject({
								error: 'FILE_TOO_LARGE',
								message: 'File too large, max size is 25MB'
							})
						});
						return arr;
					}
				}
				const bufferStream = new stream.PassThrough();
				bufferStream.end(file.data);
				const newFileName = `${commandName}_${threadID}_${userID}_${global.utils.getTime()}.${path.extname(file.name).split('.')[1] || mimeDB[file.mimetype]?.extensions?.[0] || "unknow"}`;
				arr.push({
					count: i++,
					rootName: file.name,
					file: drive.uploadFile(newFileName, bufferStream),
					newFileName
				});
				return arr;
			}, []);

			const success = [], failed = [];

			for (const item of pendingUpload) {
				try {
					const file = await item.file;
					success.push({
						...file,
						id: file.id,
						urlDownload: drive.getUrlDownload(file.id),
						rootName: item.rootName,
						count: item.count,
						newFileName: item.newFileName
					});
				}
				catch (err) {
					failed.push({
						error: err.error,
						message: err.message,
						rootName: item.rootName,
						count: item.count
					});
				}
			}

			if (type == 'leaveAttachment') {
				const fileIDs = success.map(file => file.id);
				try {
					let leaveAttachmentThread = await threadsData.get(threadID, 'data.leaveAttachment', []);
					leaveAttachmentThread = [...leaveAttachmentThread, ...fileIDs];
					await threadsData.set(threadID, leaveAttachmentThread, 'data.leaveAttachment');
				}
				catch (err) {
				}
			}
			else if (type == 'welcomeAttachment') {
				const fileIDs = success.map(file => file.id);
				try {
					let welcomeAttachmentThread = await threadsData.get(threadID, 'data.welcomeAttachment', []);
					welcomeAttachmentThread = [...welcomeAttachmentThread, ...fileIDs];
					await threadsData.set(threadID, welcomeAttachmentThread, 'data.welcomeAttachment');
				}
				catch (err) {
				}
			}

			res.type("json").send(JSON.stringify({
				status: 'success',
				success,
				failed
			}));
		})

		.post('/thread/setData/:slug', [isAuthenticated_P, isVeryfiUserIDFacebook_P, checkHasAndInThread_P, apiLimiter], async function (req, res) {
			const { slug } = req.params;
			const { threadID, type } = req.body;
			if (!checkAuthConfigDashboardOfThread(threadID, req.user.facebookUserID))
				return res.status(400).json({
					status: 'error',
					error: 'PERMISSION_DENIED',
					message: 'Bạn không có quyền chỉnh sửa dữ liệu trong nhóm này'
				});
			const threadData = getThreadDataSync(threadID);

			try {
				switch (slug) {
					case 'welcomeAttachment':
					case 'leaveAttachment': {
						const { attachmentIDs } = request.body;
						if (!threadData.data[slug])
							threadData.data[slug] = [];
						if (type === 'add')
							threadData.data[slug].push(...attachmentIDs);
						else if (type === 'delete')
							threadData.data[slug] = threadData.data[slug].filter(item => !attachmentIDs.includes(item));
						break;
					}
					case 'welcomeMessage':
					case 'leaveMessage': {
						const { message } = req.body;
						if (type === "update")
							threadData.data[slug] = message;
						else
							delete threadData.data[slug];
						break;
					}
					case 'settings': {
						const { updateData } = req.body;
						for (const key in updateData)
							threadData.settings[key] = updateData[key] == 'true';
						break;
					}
				}
			}
			catch (err) {
				return res.status(400).send({
					status: 'error',
					error: 'SERVER_ERROR',
					message: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
				});
			}

			try {
				await threadsData.set(threadID, threadData);
				res.json({
					status: 'success'
				});
			}
			catch (e) {
				res.status(500).json({
					status: 'error',
					error: 'FAILED_TO_SAVE_DATA',
					message: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
				});
			}
		})
		.get("/getUserData", [isAuthenticated_G, isVeryfiUserIDFacebook_G], async (req, res) => {
			const uid = req.params.userID || req.user.facebookUserID;
			if (req.params.userID) {
				if (!req.user.isAdmin) {
					return res.status(401).send({
						status: 'error',
						message: 'Unauthorized'
					});
				}
			}

			let userData;
			try {
				userData = await usersData.get(uid);
				return res.status(200).send({
					status: 'success',
					data: userData
				});
			}
			catch (e) {
				return res.status(500).send({
					status: 'error',
					message: e.message
				});
			}
		})

	// .get("/getThreadsData/:userID", [isAuthenticated, isVeryfiUserIDFacebook], async (req, res) => {
	// 	if (!req.params.userID) {
	// 		return res.status(400).send({
	// 			status: 'error',
	// 			message: 'Bad request'
	// 		});
	// 	}
	// 	let allThread = threadsData.getAll();
	// 	allThread = allThread.filter(t => t.members.some(m => m.userID == req.params.userID));
	// 	return res.status(200).send({
	// 		status: 'success',
	// 		data: allThread
	// 	});
	// });

	return router;
};