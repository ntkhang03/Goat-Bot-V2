const axios = require("axios");
const cheerio = require('cheerio');
const FormData = require('form-data');
const fs = require('fs');

module.exports = {
    config: {
        name: "videofb",
        version: "1.4",
        author: "NTKhang & Tas33n",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "Tải video từ facebook",
            en: "Download video from facebook"
        },
        longDescription: {
            vi: "Tải video/story từ facebook (công khai)",
            en: "Download video/story from facebook (public)"
        },
        category: "media",
        guide: {
            vi: "   {pn} <url video/story>: tải video từ facebook",
            en: "   {pn} <url video/story>: download video from facebook"
        }
    },

    langs: {
        vi: {
            missingUrl: "Vui lòng nhập url video/story facebook (công khai) bạn muốn tải về",
            error: "Đã xảy ra lỗi khi tải video",
            downloading: "Đang tiến hành tải video cho bạn",
            tooLarge: "Rất tiếc không thể tải video cho bạn vì dung lượng lớn hơn 83MB"
        },
        en: {
            missingUrl: "Please enter the facebook video/story (public) url you want to download",
            error: "An error occurred while downloading the video",
            downloading: "Downloading video for you",
            tooLarge: "Sorry, we can't download the video for you because the size is larger than 83MB"
        }
    },

    onStart: async function ({ args, message, getLang }) {
        if (!args[0]) {
            return message.reply(getLang("missingUrl"));
        }

        let msgSend = null;

        try {

            const url = args[0];

            const response = await scrapVideo(url);

            console.log(response)

            if (response === false) {
                return message.reply(getLang("error"));
            }

            msgSend = message.reply(getLang("downloading"));

            const videofile = await axios.get(response[0].link, { responseType: 'arraybuffer' });

            const filePath = __dirname + `/tmp/_${Date.now()}.mp4`;

            fs.writeFileSync(filePath, videofile.data);

            await message.reply({
                body: response[0].title,
                attachment: fs.createReadStream(filePath)
            }, async (err) => {
                if (err)
                    return message.reply(getLang("error", err.message));
                fs.unlinkSync(filePath);
                message.unsend((await msgSend).messageID);
            });

            fs.unlinkSync(filePath);
            message.unsend((await msgSend).messageID);
        }
        catch (e) {
            console.error(e);
            return message.reply(getLang("tooLarge"));
        }
    }
};


// video scraper by tas33n fb.me/tasu.legend

async function scrapVideo(url) {
    const headers = {
        'authority': 'getmyfb.com',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': 'PHPSESSID=n2sfpuoe9kn103u20pe8riqgkq; _token=WpnS6cZvH1cKlD4ftE8u',
        'dnt': '1',
        'hx-current-url': 'https://getmyfb.com/',
        'hx-request': 'true',
        'hx-target': 'target',
        'hx-trigger': 'form',
        'origin': 'https://getmyfb.com',
        'referer': 'https://getmyfb.com/',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'Windows',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    };

    const formData = new FormData();
    formData.append('id', url);
    formData.append('locale', 'en');

    try {
        const response = await axios.post('https://getmyfb.com/process', formData, {
            headers: {
                ...headers,
                ...formData.getHeaders(),
            },
        });

        const $ = cheerio.load(response.data);

        const titleDiv = $('.results-item-text');

        let title = 'Title Not Found';

        if (titleDiv.length > 0) {
            title = titleDiv.text().trim();
        }

        const videoListItems = $('.results-list-item');

        const pattern = /(\d{3,4})p/;

        const videoData = [];

        videoListItems.each((index, element) => {
            const res = $(element).text().trim();
            const videoHref = $(element).find('a').attr('href');

            videoData.push({
                title,
                res,
                link: videoHref,
            });
        });

        return videoData;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}
