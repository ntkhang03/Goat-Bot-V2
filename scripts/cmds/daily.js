const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "daily",
        version: "1.1",
        author: "Ntkhang,//original HASSAN",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "Nhận quà hàng ngày",
            en: "Receive daily gift"
        },
        longDescription: {
            vi: "Nhận quà hàng ngày",
            en: "Receive daily gift"
        },
        category: "game",
        guide: {
            vi: "{pn}: Nhận quà hàng ngày"
                + "\pn} info: Xem thông tin quà hàng ngày",
            en: "{pn}"
                + "\pn} info: View daily gift information"
        },
        envConfig: {
            rewardFirstDay: {
                coin: 10000000,
                exp: 10
            }
        }
    },

    langs: {
        vi: {
            monday: "Thứ 2",
            tuesday: "Thứ 3",
            wednesday: "Thứ 4",
            thursday: "Thứ 5",
            friday: "Thứ 6",
            saturday: "Thứ 7",
            sunday: "Chủ nhật",
            alreadyReceived: "Bạn đã nhận quà rồi",
            received: "Bạn đã nhận được %1 coin và %2 exp"
        },
        en: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday",
            alreadyReceived: "You have already received the gift",
            received: "You have received %1 coin and %2 exp"
        }
    },

    onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
        const reward = envCommands[commandName].rewardFirstDay;

        const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
        const date = new Date();
        const currentDay = date.getDay();
        const { senderID } = event;

        const userData = await usersData.get(senderID);
        if (userData.data.lastTimeGetReward === dateTime) {
            return message.reply(getLang("alreadyReceived"));
        }

        const getCoin = Math.floor(reward.coin * (1 + 20 / 100000000) ** ((currentDay == 0 ? 7 : currentDay) - 1));
        const getExp = Math.floor(reward.exp * (1 + 20 / 100000000) ** ((currentDay == 0 ? 7 : currentDay) - 1));
        userData.data.lastTimeGetReward = dateTime;
        await usersData.set(senderID, {
            money: userData.money + getCoin,
            exp: userData.exp + getExp,
            data: userData.data
        });
        message.reply(getLang("received", getCoin, getExp));
    }
};
