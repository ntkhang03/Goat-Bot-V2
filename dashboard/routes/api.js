const stream = require("stream");
const express = require("express");
const path = require("path");
const mimeDB = require("mime-db");
const router = express.Router();

module.exports = function ({ isAuthenticated, isVeryfiUserIDFacebook, checkHasAndInThread, threadsData, drive, checkAuthConfigDashboardOfThread, usersData, createLimiter, middlewareCheckAuthConfigDashboardOfThread, isVideoFile }) {
	const apiLimiter = createLimiter(1000 * 60 * 5, 10);

	router
		.post("/delete/:slug", [isAuthenticated, isVeryfiUserIDFacebook, checkHasAndInThread, middlewareCheckAuthConfigDashboardOfThread, apiLimiter], async function (req, res) {
			const { fileIDs, threadID, location } = req.body;
			if (!fileIDs || !fileIDs.length)
				return res.status(400).send({
					status: "error",
					error: "FILE_ID_NOT_FOUND",
					message: "Please provide file IDs"
				});
			if (!threadID)
				return res.status(400).send({
					status: "error",
					error: "THREAD_ID_NOT_FOUND",
					message: "Please provide thread ID"
				});
			if (!location)
				return res.status(400).send({
					status: "error",
					error: "LOCATION_NOT_FOUND",
					message: "Please provide location"
				});
			if (!["data.welcomeAttachment", "data.leaveAttachment"].includes(location))
				return res.status(400).send({
					status: "error",
					error: "LOCATION_NOT_FOUND",
					message: "Location illegal"
				});

			const threadData = await threadsData.get(threadID);
			if (!threadData)
				return res.status(400).send({
					status: "error",
					error: "COULD_NOT_FOUND_THREAD",
					message: `Couldn\"t find thread data of thread ID ${threadID}`
				});

			let dataOfLocation = await threadsData.get(threadID, location);
			const fileIDsDeleted = [];

			const pendingDelete = fileIDs.map(async fileID => {
				try {
					const index = dataOfLocation.indexOf(fileID);
					if (index == -1)
						throw ({
							error: "FILE_ID_NOT_FOUND",
							message: `Couldn\"t find file ID ${fileID} in location ${location}`
						});

					await drive.deleteFile(fileID);
					fileIDsDeleted.push(fileID);
					return {
						id: fileID,
						status: "success"
					};
				}
				catch (err) {
					throw ({
						id: fileID,
						error: err.error,
						message: err.message
					});
				}
			});

			const successPromise = await Promise.allSettled(pendingDelete);
			dataOfLocation = dataOfLocation.filter(fileID => !fileIDsDeleted.includes(fileID));

			const success = successPromise
				.filter(item => item.status == "fulfilled")
				.map(({ value }) => value.id);
			const failed = successPromise
				.filter(item => item.status == "rejected")
				.map(({ reason }) => ({
					id: reason.id,
					error: reason.error,
					message: reason.message
				}));

			await threadsData.set(threadID, dataOfLocation, location);

			res.type("json").send(JSON.stringify({
				status: "success",
				success,
				failed
			}));
		})
		.post(
			"/upload/:type",
			[
				isAuthenticated,
				isVeryfiUserIDFacebook,
				checkHasAndInThread,
				apiLimiter
			],
			async function (req, res) {
				const { threadID, commandName } = req.body;
				const { type } = req.params;
				const userID = req.user.facebookUserID;

				if (!threadID)
					return res.status(400).json({
						status: "error",
						error: "THREAD_ID_NOT_FOUND",
						message: "Thread ID not found"
					});

				if (!commandName)
					return res.status(400).json({
						status: "error",
						error: "COMMAND_NAME_NOT_FOUND",
						message: "Command name not found"
					});

				if (!["welcomeAttachment", "leaveAttachment"].includes(type))
					return res.status(400).send({
						status: "error",
						error: "TYPE_ERROR",
						message: "type illegal"
					});

				if (!checkAuthConfigDashboardOfThread(threadID, userID))
					return res.status(400).json({
						status: "error",
						error: "PERMISSION_DENIED",
						message: "You are not authorized to upload file in this thread"
					});

				let files = req.files;
				if (!files)
					return res.status(400).json({
						status: "error",
						error: "FILE_NOT_FOUND",
						message: "No files were uploaded."
					});

				let dataOfLocation = await threadsData.get(threadID, `data.${type}`, []);
				files = Object.values(files);
				if (files.length > 20) {
					return res.status(400).json({
						status: "error",
						error: "TOO_MANY_FILES",
						message: "You can only upload 20 files at a time"
					});
				}

				if (dataOfLocation.length + files.length > 20) {
					return res.status(400).json({
						status: "error",
						error: "TOO_MANY_FILES",
						message: "You can only upload 20 files, current files in this location is " + dataOfLocation.length
					});
				}

				let i = 0;

				const pendingUpload = files.reduce((arr, file) => {
					if (isVideoFile(file.mimetype)) {
						if (file.size > 83 * 1024 * 1024) {
							arr.push({
								count: i++,
								rootName: file.name,
								file: Promise.reject({
									error: "FILE_TOO_LARGE",
									message: "File too large, max size is 83MB"
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
									error: "FILE_TOO_LARGE",
									message: "File too large, max size is 25MB"
								})
							});
							return arr;
						}
					}

					const bufferStream = new stream.PassThrough();
					bufferStream.end(file.data);
					const newFileName = `${commandName}_${threadID}_${userID}_${global.utils.getTime()}.${path.extname(file.name).split(".")[1] || mimeDB[file.mimetype]?.extensions?.[0] || "unknow"}`;
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
							// ...file,
							id: file.id,
							mimeType: file.mimeType,
							webContentLink: file.webContentLink,
							webViewLink: file.webViewLink,
							iconLink: file.iconLink,
							thumbnailLink: file.thumbnailLink,
							createdTime: file.createdTime,
							fileExtension: file.fileExtension,
							size: file.size,
							imageMediaMetadata: file.imageMediaMetadata || null,
							fullFileExtension: file.fullFileExtension,
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

				const fileIDs = success.map(file => file.id);
				try {
					dataOfLocation = [...dataOfLocation, ...fileIDs];
					await threadsData.set(threadID, dataOfLocation, `data.${type}`);
				}
				catch (err) {
				}

				res.type("json").send(JSON.stringify({
					status: "success",
					success,
					failed
				}));
			}
		)

		.post("/thread/setData/:slug", [isAuthenticated, isVeryfiUserIDFacebook, checkHasAndInThread, apiLimiter], async function (req, res) {
			const { slug } = req.params;
			const { threadID, type } = req.body;
			if (!checkAuthConfigDashboardOfThread(threadID, req.user.facebookUserID))
				return res.status(400).json({
					status: "error",
					error: "PERMISSION_DENIED",
					message: "Bạn không có quyền chỉnh sửa dữ liệu trong nhóm này"
				});
			const threadData = await threadsData.get(threadID);
			try {
				switch (slug) {
					case "welcomeAttachment":
					case "leaveAttachment": {
						const { attachmentIDs } = req.body;
						if (!threadData.data[slug])
							threadData.data[slug] = [];
						if (type === "add")
							threadData.data[slug].push(...attachmentIDs);
						else if (type === "delete")
							threadData.data[slug] = threadData.data[slug].filter(item => !attachmentIDs.includes(item));
						break;
					}
					case "welcomeMessage":
					case "leaveMessage": {
						const { message } = req.body;
						if (type === "update")
							threadData.data[slug] = message;
						else
							delete threadData.data[slug];
						break;
					}
					case "settings": {
						const { updateData } = req.body;
						for (const key in updateData)
							threadData.settings[key] = updateData[key] == "true";
						break;
					}
				}
			}
			catch (err) {
				return res.status(400).send({
					status: "error",
					error: "SERVER_ERROR",
					message: "Đã có lỗi xảy ra, vui lòng thử lại sau"
				});
			}

			try {
				await threadsData.set(threadID, threadData);
				res.json({
					status: "success"
				});
			}
			catch (e) {
				res.status(500).json({
					status: "error",
					error: "FAILED_TO_SAVE_DATA",
					message: "Đã có lỗi xảy ra, vui lòng thử lại sau"
				});
			}
		})
		.get("/getUserData", [isAuthenticated, isVeryfiUserIDFacebook], async (req, res) => {
			const uid = req.params.userID || req.user.facebookUserID;
			if (req.params.userID) {
				if (!req.user.isAdmin) {
					return res.status(401).send({
						status: "error",
						message: "Unauthorized"
					});
				}
			}

			let userData;
			try {
				userData = await usersData.get(uid);
				return res.status(200).send({
					status: "success",
					data: userData
				});
			}
			catch (e) {
				return res.status(500).send({
					status: "error",
					message: e.message
				});
			}
		})

	// .get("/getThreadsData/:userID", [isAuthenticated, isVeryfiUserIDFacebook], async (req, res) => {
	// 	if (!req.params.userID) {
	// 		return res.status(400).send({
	// 			status: "error",
	// 			message: "Bad request"
	// 		});
	// 	}
	// 	let allThread = await threadsData.getAll();
	// 	allThread = allThread.filter(t => t.members.some(m => m.userID == req.params.userID));
	// 	return res.status(200).send({
	// 		status: "success",
	// 		data: allThread
	// 	});
	// });

	return router;
};