const { execFile } = require('child_process');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const axios = require('axios');

const binDir = path.join(process.cwd(), 'bin');
const ytDlpBinaryPath = path.join(binDir, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
const cookieFilePath = path.join(binDir, 'cookies.txt');

// convert and save the fb cookie into netscape formate for yt-dlp
async function convertfbcookies() {
    const fbcookiesFile = path.join(process.cwd(), 'bin', 'fb_cookies.txt');

    const fbcookie = JSON.parse(fs.readFileSync(global.client.dirAccount, 'utf-8'));
    const netscapeCookies = fbcookie.map(cookie => {
        return `.${cookie.domain}\tTRUE\t${cookie.path}\t${cookie.hostOnly ? 'FALSE' : 'TRUE'}\t${Math.floor(Date.parse(cookie.lastAccessed) / 1000)}\t${cookie.key}\t${cookie.value}`;
    }).join('\n');

    const newContent = `\n${netscapeCookies}\n`;

    try {
        fs.appendFileSync(cookieFilePath, newContent, 'utf8');
        console.log('Cookies appended to netscape cookie file successfully.');
        return fbcookiesFile
    } catch (error) {
        console.error('Error appending cookies to netscape file:', error.message);
    }
}

// download ytdlp if its not exist.
async function downloadYtDlp() {
    if (!fs.existsSync(binDir)) fs.mkdirSync(binDir);

    const url = process.platform === 'win32' ?
        'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' :
        'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const totalLength = response.headers['content-length'];
        const writer = fs.createWriteStream(ytDlpBinaryPath);

        response.data.pipe(writer);

        let downloadedLength = 0;
        response.data.on('data', (chunk) => {
            downloadedLength += chunk.length;
            process.stdout.write(`Downloading yt-dlp: ${((downloadedLength / totalLength) * 100).toFixed(2)}%\r`);
        });

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                if (process.platform !== 'win32') fs.chmodSync(ytDlpBinaryPath, '755');
                console.log('\nDownload complete.');
                resolve();
            });
            writer.on('error', (err) => {
                fs.unlink(ytDlpBinaryPath, () => { });
                reject(`Failed to download yt-dlp: ${err.message}`);
            });
        });
    } catch (error) {
        fs.unlink(ytDlpBinaryPath, () => { });
        throw new Error(`Failed to download yt-dlp: ${error.message}`);
    }
}

// chek if the ytdlp exist
async function ensureYtDlp() {
    if (!fs.existsSync(ytDlpBinaryPath)) {
        console.log('yt-dlp not found, downloading...');
        await downloadYtDlp();
    }
}

// run ytdlp commands usiing ytdlp binary
async function executeYtDlp(args) {
    await ensureYtDlp();
    return new Promise((resolve, reject) => {
        execFile(ytDlpBinaryPath, args, (error, stdout, stderr) => {
            if (error) return reject(`Error: ${error.message}`);
            if (stderr) return reject(`Stderr: ${stderr}`);
            try {
                resolve(JSON.parse(stdout));
            } catch (parseError) {
                reject(`Failed to parse JSON: ${parseError.message}`);
            }
        });
    });
}

// filter audio/video formats
function selectBestFormat(formats, isAudio = false) {
    const conditions = isAudio ?
        (f => f.abr && f.abr > 0 && (!f.video_ext || f.video_ext === 'none')) :
        (f => f.ext === 'mp4' && f.filesize <= 80 * 1024 * 1024 && !f.url.endsWith('.m3u8'));

    const resolutions = isAudio ? [] : ['1920x1080', '1280x720', '854x480'];

    for (const resolution of resolutions) {
        const format = formats.find(f => f.resolution === resolution && conditions(f));
        if (format) return format;
    }

    return formats.find(conditions);
}


async function processMedia({ videoInfo, extractAudio, message, api, event, dlmsgID, urlmsgID }) {
    try {
        let format = extractAudio ? selectBestFormat(videoInfo.formats, true) : selectBestFormat(videoInfo.formats);
        if (!format) {
            await api.editMessage("No suitable format found.", dlmsgID);
            message.reaction("❌", urlmsgID);
            return;
        }

        if (extractAudio) {
            if (format.vcodec === 'none' && format.acodec !== 'none') {
                return message.reply({
                    body: videoInfo.title,
                    attachment: await global.utils.getStreamFromURL(format.url, `anydl_audio.${format.ext || "m4a"}`)
                })
            } else {
                await extractAndSendAudio(format, videoInfo.title, message, dlmsgID, urlmsgID);
            }
        } else {
            await sendVideoOrMergedMedia(format, videoInfo, message, dlmsgID, urlmsgID);
        }
    } catch (err) {
        console.error(err);
        message.reaction("❌", urlmsgID);
        await api.editMessage("An error occurred while processing your request.", dlmsgID);
    }
}

// if no audio url extrcat the audio from a video
async function extractAndSendAudio(format, title, message, dlmsgID, urlmsgID) {
    const inputVideoPath = await global.utils.getStreamFromURL(format.url, `anydl_video.${format.ext || "mp4"}`, {});
    const outputAudioPath = path.join(__dirname, "tmp", 'output_audio.mp3');

    ffmpeg(inputVideoPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .on('start', (commandLine) => console.log('FFmpeg command:', commandLine))
        .on('end', async () => {
            console.log('Audio extraction finished!');
            const audioStream = fs.createReadStream(outputAudioPath);
            await message.reply({ body: title, attachment: audioStream });
            cleanUpFiles([outputAudioPath]);
            message.reaction("✅", urlmsgID);
            message.unsend(dlmsgID);
        })
        .on('error', (err) => {
            console.error('Error during audio extraction:', err.message);
            message.reaction("❌", urlmsgID);
        })
        .save(outputAudioPath);
}

// handle if mute or cute uwu
async function sendVideoOrMergedMedia(format, videoInfo, message, dlmsgID, urlmsgID) {
    const isMute = !format.acodec || format.acodec === 'none';

    if (isMute) {
        const audioFormat = selectBestFormat(videoInfo.formats, true);
        if (audioFormat) {
            await mergeAndSendVideoAudio(format, audioFormat, videoInfo.title, message, dlmsgID, urlmsgID);
        } else {
            message.reaction("❌", urlmsgID);
            await message.reply("No suitable audio found for merging.");
        }
    } else {
        await sendVideo(format.url, videoInfo.title, message, dlmsgID, urlmsgID);
    }
}

// marge video audio if mute and send
async function mergeAndSendVideoAudio(videoFormat, audioFormat, title, message, dlmsgID, urlmsgID) {

    const randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
    const filename = randomNumber.toString();

    const videoPath = await global.utils.downloadFile(videoFormat.url, path.join(__dirname, 'tmp', `video_${filename}.${videoFormat.ext || "mp4"}`));
    const audioPath = await global.utils.downloadFile(audioFormat.url, path.join(__dirname, 'tmp', `audio_${filename}.${audioFormat.ext || "m4a"}`));
    const outputPath = path.join(__dirname, "tmp", `merged_${filename}.mp4`);
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }


    ffmpeg(videoPath)
        .input(audioPath)
        .outputOptions('-c:v copy')
        .outputOptions('-c:a aac')
        .on('start', (commandLine) => {
            console.log('FFmpeg command:', commandLine);
        })
        .on('end', async () => {
            console.log('Merging finished!');
            await sendVideo(outputPath, title, message, dlmsgID, urlmsgID);
            cleanUpFiles([videoPath, audioPath, outputPath]);
        })
        .on('error', (err) => {
            console.error('Error during merging:', err.message);
            message.reaction("❌", urlmsgID);
        })
        .save(outputPath);
}


async function sendVideo(videoPath, title, message, dlmsgID, urlmsgID) {
    const videoStream = fs.createReadStream(videoPath);
    await message.reply({ body: title, attachment: videoStream });
    message.reaction("✅", urlmsgID);
    message.unsend(dlmsgID);
}

// Clean up
function cleanUpFiles(filePaths) {
    filePaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
}

// Handle media command 
async function handleMedia({ url, extractAudio, message, getLang, api, event, dlmsgID, urlmsgID }) {
    try {
        let cookie = cookieFilePath;
        if (url.includes('fb') || url.includes('facebook')) {
            cookie = await convertfbcookies(cookieFilePath);
        }
        const videoInfo = await executeYtDlp(['--cookies', cookie, '--ignore-errors', '--dump-json', url]);
        if (videoInfo) {
            await processMedia({ videoInfo, extractAudio, message, api, event, dlmsgID, urlmsgID });
        } else {
            message.reaction("❌", urlmsgID);
            await api.editMessage(getLang("noVideoFound"), dlmsgID);
        }
    } catch (e) {
        console.error(e);
        message.reaction("❌", urlmsgID);
        await api.editMessage(getLang("error"), dlmsgID);
    }
}

module.exports = {
    config: {
        name: "anydl",
        aliases: ["alldl", "ytdl"],
        version: "2.0",
        author: "Tas33n",
        countDown: 5,
        role: 0,
        description: {
            en: "Download videos or extract audio from a wide range of online platforms, supporting over 1000+ websites. (powerd by YT-DLP)"
        },
        category: "media",
        guide: {
            en: "{pn} <url>: Download video from the specified URL"
                + "\n{pn} -a <url>: Extract and download audio from the specified URL"
        }
    },

    langs: {
        en: {
            missingUrl: "Please enter a valid URL for the media you want to download.",
            error: "❌ | An error occurred while processing your request. Please ensure the URL is valid and public.",
            noVideoFound: "No suitable video found under 80MB in size."
        }
    },

    onStart: async function ({ args, message, getLang, event, api }) {
        let url;
        let extractAudio = false;

        // Check for -a flag and extract URL
        if (args[0] === '-a') {
            extractAudio = true;
            url = args.slice(1).join(" ");
        } else if (args[0] === '-v') {
            extractAudio = false;
            url = args.slice(1).join(" ");
        } else {
            url = args.join(" ");
        }

        if (!url) return message.reply(getLang("missingUrl"));

        let urlmsgID = event.messageID;
        await message.reaction("⌛", urlmsgID);
        let dlmsg = await message.reply(`⌛ Downloading...`);
        await handleMedia({ url, extractAudio, message, getLang, api, event, dlmsgID: dlmsg.messageID, urlmsgID });
    },

    onChat: async function ({ event, message, threadsData, commandName }) {
        // const { settings } = await threadsData.get(event.threadID);
        // const autoDl = settings.autoDownload || false;

        // if (!autoDl) return;

        try {
            const urlRegx = /https:\/\/[^\s]+/;
            if (event.body) {
                const match = event.body.match(urlRegx);

                if (match) {
                    const prefix = await global.utils.getPrefix(event.threadID);
                    if (event.body.startsWith(prefix)) return;

                    const url = match[0];

                    return message.reply({
                        body: "🔗 Media link detected! React with 👍 to start the download!"
                    }, (err, info) => {
                        global.GoatBot.onReaction.set(info.messageID, {
                            commandName,
                            messageID: info.messageID,
                            urlmsgID: event.messageID,
                            author: event.senderID,
                            url
                        });
                        setTimeout(() => {
                            try {
                                message.unsend(info.messageID);
                            } catch (e) { }
                        }, 60000);
                    });
                }
            }
        } catch (e) {
            console.log(e)
        }
    },

    onReaction: async ({ event, api, Reaction, message, getLang }) => {
        const { author, url, messageID, urlmsgID } = Reaction;
        const { userID, reaction } = event;
        if (author != userID) return;

        try {
            if (reaction == "👍") {
                await api.editMessage(`⌛ Downloading...`, messageID);
                message.reaction("⌛", urlmsgID);
                await handleMedia({ url, extractAudio: false, message, getLang, api, event, dlmsgID: messageID, urlmsgID });
            }
        }
        catch (err) {
            console.log("error" + err)
        }
    }
};