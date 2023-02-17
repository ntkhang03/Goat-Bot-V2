This repo is a fork from main repo and will usually have new features bundled faster than main repo (and maybe bundle some bugs, too).
See main repo [here](https://github.com/Schmavery/facebook-chat-api).

# Unofficial Facebook Chat API
<a href="https://www.npmjs.com/package/fb-chat-api"><img alt="npm version" src="https://img.shields.io/npm/v/fb-chat-api.svg?style=flat-square"></a>
<img alt="version" src="https://img.shields.io/github/package-json/v/fb-chat-api/fb-chat-api?label=github&style=flat-square">
<a href="https://www.npmjs.com/package/fb-chat-api"><img src="https://img.shields.io/npm/dm/fb-chat-api.svg?style=flat-square" alt="npm downloads"></a>

Facebook now has an official API for chat bots [here](https://developers.facebook.com/docs/messenger-platform).

This API is the only way to automate chat functionalities on a user account. We do this by emulating the browser. This means doing the exact same GET/POST requests and tricking Facebook into thinking we're accessing the website normally. Because we're doing it this way, this API won't work with an auth token but requires the credentials of a Facebook account.

_Disclaimer_: We are not responsible if your account gets banned for spammy activities such as sending lots of messages to people you don't know, sending messages very quickly, sending spammy looking URLs, logging in and out very quickly... Be responsible Facebook citizens.

See [below](#projects-using-this-api) for projects using this API.

See the [full changelog](/CHANGELOG.md) for release details.

## Install
If you just want to use fb-chat-api, you should use this command:
```bash
npm install fb-chat-api
```
It will download `fb-chat-api` from NPM repositories

### Bleeding edge
If you want to use bleeding edge (directly from github) to test new features or submit bug report, this is the command for you:
```bash
npm install ntkhang03/fb-chat-api
```

## Testing your bots
If you want to test your bots without creating another account on Facebook, you can use [Facebook Whitehat Accounts](https://www.facebook.com/whitehat/accounts/).

## Example Usage
```javascript
const login = require("fb-chat-api");

// Create simple echo bot
login({email: "FB_EMAIL", password: "FB_PASSWORD"}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        api.sendMessage(message.body, message.threadID);
    });
});
```

Result:

<img width="517" alt="screen shot 2016-11-04 at 14 36 00" src="https://cloud.githubusercontent.com/assets/4534692/20023545/f8c24130-a29d-11e6-9ef7-47568bdbc1f2.png">


## Documentation

You can see it [here](DOCS.md).

## Main Functionality

### Sending a message
#### api.sendMessage(message, threadID, [callback], [messageID])

Various types of message can be sent:
* *Regular:* set field `body` to the desired message as a string.
* *Sticker:* set a field `sticker` to the desired sticker ID.
* *File or image:* Set field `attachment` to a readable stream or an array of readable streams.
* *URL:* set a field `url` to the desired URL.
* *Emoji:* set field `emoji` to the desired emoji as a string and set field `emojiSize` with size of the emoji (`small`, `medium`, `large`)

Note that a message can only be a regular message (which can be empty) and optionally one of the following: a sticker, an attachment or a url.

__Tip__: to find your own ID, you can look inside the cookies. The `userID` is under the name `c_user`.

__Example (Basic Message)__
```js
const login = require("fb-chat-api");

login({email: "FB_EMAIL", password: "FB_PASSWORD"}, (err, api) => {
    if(err) return console.error(err);

    var yourID = "000000000000000";
    var msg = "Hey!";
    api.sendMessage(msg, yourID);
});
```

__Example (File upload)__
```js
const login = require("fb-chat-api");

login({email: "FB_EMAIL", password: "FB_PASSWORD"}, (err, api) => {
    if(err) return console.error(err);

    // Note this example uploads an image called image.jpg
    var yourID = "000000000000000";
    var msg = {
        body: "Hey!",
        attachment: fs.createReadStream(__dirname + '/image.jpg')
    }
    api.sendMessage(msg, yourID);
});
```

------------------------------------
### Saving session.

To avoid logging in every time you should save AppState (cookies etc.) to a file, then you can use it without having password in your scripts.

__Example__

```js
const fs = require("fs");
const login = require("fb-chat-api");

var credentials = {email: "FB_EMAIL", password: "FB_PASSWORD"};

login(credentials, (err, api) => {
    if(err) return console.error(err);

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
```

Alternative: Use [c3c-fbstate](https://github.com/lequanglam/c3c-fbstate) to get fbstate.json (appstate.json)

------------------------------------

### Listening to a chat
#### api.listenMqtt(callback)

Listen watches for messages sent in a chat. By default this won't receive events (joining/leaving a chat, title change etc…) but it can be activated with `api.setOptions({listenEvents: true})`. This will by default ignore messages sent by the current account, you can enable listening to your own messages with `api.setOptions({selfListen: true})`.

__Example__

```js
const fs = require("fs");
const login = require("fb-chat-api");

// Simple echo bot. It will repeat everything that you say.
// Will stop when you say '/stop'
login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({listenEvents: true});

    var stopListening = api.listenMqtt((err, event) => {
        if(err) return console.error(err);

        api.markAsRead(event.threadID, (err) => {
            if(err) console.error(err);
        });

        switch(event.type) {
            case "message":
                if(event.body === '/stop') {
                    api.sendMessage("Goodbye…", event.threadID);
                    return stopListening();
                }
                api.sendMessage("TEST BOT: " + event.body, event.threadID);
                break;
            case "event":
                console.log(event);
                break;
        }
    });
});
```

## FAQS

1. How do I run tests?
> For tests, create a `test-config.json` file that resembles `example-config.json` and put it in the `test` directory. From the root >directory, run `npm test`.

2. Why doesn't `sendMessage` always work when I'm logged in as a page?
> Pages can't start conversations with users directly; this is to prevent pages from spamming users.

3. What do I do when `login` doesn't work?
> First check that you can login to Facebook using the website. If login approvals are enabled, you might be logging in incorrectly. For how to handle login approvals, read our docs on [`login`](DOCS.md#login).

4. How can I avoid logging in every time?  Can I log into a previous session?
> We support caching everything relevant for you to bypass login. `api.getAppState()` returns an object that you can save and pass into login as `{appState: mySavedAppState}` instead of the credentials object.  If this fails, your session has expired.

5. Do you support sending messages as a page?
> Yes, set the pageID option on login (this doesn't work if you set it using api.setOptions, it affects the login process).
> ```js
> login(credentials, {pageID: "000000000000000"}, (err, api) => { … }
> ```

6. I'm getting some crazy weird syntax error like `SyntaxError: Unexpected token [`!!!
> Please try to update your version of node.js before submitting an issue of this nature.  We like to use new language features.

7. I don't want all of these logging messages!
> You can use `api.setOptions` to silence the logging. You get the `api` object from `login` (see example above). Do
> ```js
> api.setOptions({
>     logLevel: "silent"
> });
> ```

<a name="projects-using-this-api"></a>
## Projects using this API:
- [c3c](https://github.com/lequanglam/c3c) - A bot that can be customizable using plugins. Support Facebook & Discord.
- [GOAT BOT 🐐](https://github.com/ntkhang03/Goat-Bot) - A bot chat Messenger can be customizable using scripts. Support .

## Projects using this API (original repository, facebook-chat-api):

- [Messer](https://github.com/mjkaufer/Messer) - Command-line messaging for Facebook Messenger
- [messen](https://github.com/tomquirk/messen) - Rapidly build Facebook Messenger apps in Node.js
- [Concierge](https://github.com/concierge/Concierge) - Concierge is a highly modular, easily extensible general purpose chat bot with a built in package manager
- [Marc Zuckerbot](https://github.com/bsansouci/marc-zuckerbot) - Facebook chat bot
- [Marc Thuckerbot](https://github.com/bsansouci/lisp-bot) - Programmable lisp bot
- [MarkovsInequality](https://github.com/logicx24/MarkovsInequality) - Extensible chat bot adding useful functions to Facebook Messenger
- [AllanBot](https://github.com/AllanWang/AllanBot-Public) - Extensive module that combines the facebook api with firebase to create numerous functions; no coding experience is required to implement this.
- [Larry Pudding Dog Bot](https://github.com/Larry850806/facebook-chat-bot) - A facebook bot you can easily customize the response
- [fbash](https://github.com/avikj/fbash) - Run commands on your computer's terminal over Facebook Messenger
- [Klink](https://github.com/KeNt178/klink) - This Chrome extension will 1-click share the link of your active tab over Facebook Messenger
- [Botyo](https://github.com/ivkos/botyo) - Modular bot designed for group chat rooms on Facebook
- [matrix-puppet-facebook](https://github.com/matrix-hacks/matrix-puppet-facebook) - A facebook bridge for [matrix](https://matrix.org)
- [facebot](https://github.com/Weetbix/facebot) - A facebook bridge for Slack.
- [Botium](https://github.com/codeforequity-at/botium-core) - The Selenium for Chatbots
- [Messenger-CLI](https://github.com/AstroCB/Messenger-CLI) - A command-line interface for sending and receiving messages through Facebook Messenger.
- [AssumeZero-Bot](https://github.com/AstroCB/AssumeZero-Bot) – A highly customizable Facebook Messenger bot for group chats.
- [Miscord](https://github.com/Bjornskjald/miscord) - An easy-to-use Facebook bridge for Discord.
- [chat-bridge](https://github.com/rexx0520/chat-bridge) - A Messenger, Telegram and IRC chat bridge.
- [messenger-auto-reply](https://gitlab.com/theSander/messenger-auto-reply) - An auto-reply service for Messenger.
