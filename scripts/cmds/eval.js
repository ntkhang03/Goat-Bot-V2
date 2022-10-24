const { removeHomeDir } = global.utils;

module.exports = {
	config: {
		name: "eval",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Test code nhanh",
			en: "Test code quickly"
		},
		longDescription: {
			vi: "Test code nhanh",
			en: "Test code quickly"
		},
		category: "owner",
		guide: {
			vi: "{pn} <đoạn code cần test>",
			en: "{pn} <code to test>"
		}
	},

	langs: {
		vi: {
			error: "❌ Đã có lỗi xảy ra:"
		},
		en: {
			error: "❌ An error occurred:"
		}
	},

	onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
		const cmd = `
		(async () => {
			try {
				${args.join(" ")}
			}
			catch(err) {
				message.send(
					"${getLang("error")}\\n" +
					(err.stack ?
						removeHomeDir(err.stack) :
						removeHomeDir(JSON.stringify(err, null, 2))
					)
				);
			}
		})()`;
		eval(cmd);
	}
};