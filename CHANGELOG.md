## 📦 Version 1.5.32
### ⬆️ What's Changed
- **fb-chat-api/index.js**: add new api: `handleFriendRequest`
- **fb-chat-api/src/editMessage.js**: Update editMessage.js
- **fb-chat-api/src/handleFriendRequest.js**: add new api: `handleFriendRequest`
- **scripts/cmds/ban.js**: Check if the member exists in the chat box before kicking it out of the chat box
- **scripts/cmds/rankup.js**: Fix custom message not working error
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.31
### ⬆️ What's Changed
- **scripts/cmds/setname.js**: fix error when name has special characters
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.30
### ⬆️ What's Changed
- **bot/handler/handlerCheckData.js**: code optimization
- **database/controller/dashBoardData.js**: Replace the `createQueue` function into the `TaskQueue` class, code optimization
- **database/controller/globalData.js**: Replace the `createQueue` function into the `TaskQueue` class, code optimization
- **database/controller/threadsData.js**: Replace the `createQueue` function into the `TaskQueue` class, code optimization
- **database/controller/usersData.js**: Replace the `createQueue` function into the `TaskQueue` class, code optimization
- **scripts/cmds/cmd.js**: Replace the `createQueue` function into the `TaskQueue` class, code optimization
- **utils.js**: Replace the `createQueue` function into the `TaskQueue` class
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.29
### ⬆️ What's Changed
- **.vscode/GoatBot.code-snippets**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **.vscode/settings.json**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **Goat.js**: code optimization
- **bot/login/login.js**: code optimization
- **fb-chat-api/src/addExternalModule.js**: add 2 more parameters: `utils` and `log` when calling the function in `moduleObj`
- **languages/cmds/en.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **languages/en.lang**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **languages/vi.lang**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/adboxonly.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/adduser.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/admin.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/adminonly.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/all.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/antichangeinfobox.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/appstore.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/autosetname.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/avatar.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/backupdata.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/badwords.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/balance.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/ban.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/busy.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/callad.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/count.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/customrankcard.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/daily.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/dhbc.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/emojimean.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/emojimix.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/eval.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/event.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/filteruser.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/getfbstate.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/gpt.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/grouptag.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/guessnumber.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/help.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/hubble.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/ignoreonlyad.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/ignoreonlyadbox.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/jsontomongodb.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/jsontosqlite.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/kick.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/loadconfig.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/moon.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/newcommand.eg.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/notification.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/prefix.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/rank.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/rankup.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/refresh.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/restart.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/rules.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/sendnoti.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setalias.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setavt.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setlang.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setleave.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setname.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setrankup.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setrole.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/setwelcome.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/shortcut.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/sorthelp.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/texttoimage.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/thread.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/tid.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/translate.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/uid.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/unsend.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/update.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/user.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/warn.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/weather.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **scripts/cmds/ytb.js**: remove `shortDescription` and `longDescription`, replace with `description` in scripts
- **updater.js**: code optimization
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.28
### ⬆️ What's Changed
- **.eslintrc.json**: Update .eslintrc.json
- **README.md**: add `How it works?`
- **bot/handler/handlerEvents.js**: code optimization
- **scripts/cmds/shortcut.js**: code optimization
- **scripts/cmds/warn.js**: language update
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.27
### ⬆️ What's Changed
- **.eslintrc.json**: add new rules: `indent`
- **Goat.js**: nothing changed, just added comment code
- **bot/login/login.js**: add `whiteListModeThread` handling
- **config.json**: 
```json
{
  "whiteListModeThread": {
    "enable": false,
    "whiteListThreadIds": [],
    "notes": "if you enable this feature, only the thread in the whiteListThreadIds list can use the bot",
    "how_it_work": "if you enable both whiteListMode and whiteListModeThread, the system will check if the user is in whiteListIds, then check if the thread is in whiteListThreadIds, if one of the conditions is true, the user can use the bot"
  }
}
```
- **scripts/cmds/help.js**: nothing change
- **scripts/cmds/rules.js**: language update
- **utils.js**: edit the `translateAPI` and `downloadFile` functions
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.26
### ⬆️ What's Changed
- **fb-chat-api/src/editMessage.js**: add new api `editMessage`: edit message
- **fb-chat-api/index.js**: add new api `editMessage`: edit message
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/Tanvir0999">Tanvir0999&nbsp;&nbsp;</a> <img src="https://github.com/Tanvir0999.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="Tanvir0999"></div>
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.25
### ⬆️ What's Changed
- **.eslintrc.json**: use config eslint in file `.eslintrc.json` instead of `package.json`
- **bot/login/handlerWhenListenHasError.js**: code optimization
- **dashboard/routes/changePassword.js**: Update changePassword.js
- **database/models/mongodb/global.js**: correct the variable name
- **database/models/mongodb/userDashBoard.js**: correct the variable name
- **scripts/cmds/emojimean.js**: fix unusable error
- **scripts/cmds/shortcut.js**: language update
- **scripts/cmds/ytb.js**: fix: audio cannot be heard on iOS
### 🗑️ Files Deleted
- **scripts/cmds/batslap.js**: Remove `unnecessary` commands

These commands are really not necessary, it often crashes due to blocking by 3rd party api, visit the websites to make this smoother, although these commands have been removed from the source code in version new, but if you want to edit it, you can still get it back at the old commit, (of course these commands will no longer be updated) https://github.com/ntkhang03/Goat-Bot-V2/tree/8ac704f08e70abcaaf663e4127c4e05e4874c588
- **scripts/cmds/list.js**: 
- **scripts/cmds/tik.js**: Remove `unnecessary` commands

These commands are really not necessary, it often crashes due to blocking by 3rd party api, visit the websites to make this smoother, although these commands have been removed from the source code in version new, but if you want to edit it, you can still get it back at the old commit, (of course these commands will no longer be updated) https://github.com/ntkhang03/Goat-Bot-V2/tree/8ac704f08e70abcaaf663e4127c4e05e4874c588
- **scripts/cmds/trigger.js**: Remove `unnecessary` commands

These commands are really not necessary, it often crashes due to blocking by 3rd party api, visit the websites to make this smoother, although these commands have been removed from the source code in version new, but if you want to edit it, you can still get it back at the old commit, (of course these commands will no longer be updated) https://github.com/ntkhang03/Goat-Bot-V2/tree/8ac704f08e70abcaaf663e4127c4e05e4874c588
- **scripts/cmds/videofb.js**: Remove `unnecessary` commands

These commands are really not necessary, it often crashes due to blocking by 3rd party api, visit the websites to make this smoother, although these commands have been removed from the source code in version new, but if you want to edit it, you can still get it back at the old commit, (of course these commands will no longer be updated) https://github.com/ntkhang03/Goat-Bot-V2/tree/8ac704f08e70abcaaf663e4127c4e05e4874c588
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.24
### ⬆️ What's Changed
- **bot/login/login.js**: fix `RangeError: Invalid array length` when deployed on `heroku` or `pm2`
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.23
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: code optimization
- **bot/login/login.js**: code optimization
- **scripts/cmds/adminonly.js**: fix command not working
- **scripts/cmds/help.js**: language update
- **scripts/cmds/ignoreonlyad.js**: language update
- **scripts/cmds/ignoreonlyadbox.js**: language update
- **scripts/cmds/update.js**: prevent updating too quickly (less than 5 minutes after the latest release is released)
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.22
### ⬆️ What's Changed
- **scripts/cmds/cmd.js**: code optimization
- **scripts/cmds/eval.js**: code optimization
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.21
### ⬆️ What's Changed
- **scripts/cmds/shortcut.js**: Fix errors that do not receive the correct content when there are many characters `=>`
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.20
### ⬆️ What's Changed
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **updater.js**: Update updater.js
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.19
### ⬆️ What's Changed
- **scripts/events/welcome.js**: fix `ReferenceError: Cannot access 'threadData' before initialization`
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.18
### ⬆️ What's Changed
- **README.md**: Update README.md
- **bot/handler/handlerEvents.js**: code optimization
- **bot/login/login.js**: code optimization
- **dashboard/views/home.eta**: Update home.eta
- **dashboard/views/partials/nav.eta**: Fix theme changes not saving for later
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **scripts/cmds/cmd.js**: code optimization
### 🗑️ Files Deleted
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.17
### Reinstall Dependencies
Dependencies will be reinstalled for this version.
### ⬆️ What's Changed
- **.gitignore**: Update .gitignore
- **dashboard/app.js**: remake dashboard
- **dashboard/css/custom.css**: remake dashboard
- **dashboard/css/dropzone.css**: remake dashboard
- **dashboard/css/jquery.highlight-within-textarea.css**: remake dashboard
- **dashboard/css/phoenix.css**: remake dashboard
- **dashboard/images/logo-non-bg-.png**: remake dashboard
- **dashboard/images/logo-non-bg.png**: remake dashboard
- **dashboard/js/bootstrap.bundle.min.js**: remake dashboard
- **dashboard/js/bootstrap.min.js**: remake dashboard
- **dashboard/js/copyToClipboard.js**: remake dashboard
- **dashboard/js/hwt.js**: remake dashboard
- **dashboard/js/jquery.highlight-within-textarea.js**: remake dashboard
- **dashboard/js/list.min.js**: remake dashboard
- **dashboard/js/phoenix.js**: remake dashboard
- **dashboard/js/poper.js**: remake dashboard
- **dashboard/js/preview-modal.js**: remake dashboard
- **dashboard/js/toast.js**: remake dashboard
- **dashboard/middleware/index.js**: remake dashboard
- **dashboard/passport-config.js**: remake dashboard
- **dashboard/routes/api.js**: remake dashboard
- **dashboard/routes/changePassword.js**: remake dashboard
- **dashboard/routes/dashBoard.js**: remake dashboard
- **dashboard/routes/forgotPassword.js**: remake dashboard
- **dashboard/routes/login.js**: remake dashboard
- **dashboard/routes/register.js**: remake dashboard
- **dashboard/routes/verifyfbid.js**: remake dashboard
- **dashboard/views/change-password.eta**: remake dashboard
- **dashboard/views/changeFbstate.eta**: remake dashboard
- **dashboard/views/dashboard-custom-cmd.eta**: remake dashboard
- **dashboard/views/dashboard-leave.eta**: remake dashboard
- **dashboard/views/dashboard-rankup.eta**: remake dashboard
- **dashboard/views/dashboard-thread.eta**: remake dashboard
- **dashboard/views/dashboard-welcome copy.eta**: 
- **dashboard/views/dashboard-welcome.eta**: remake dashboard
- **dashboard/views/dashboard.eta**: remake dashboard
- **dashboard/views/donate.eta**: remake dashboard
- **dashboard/views/forgot-password-new-password.eta**: remake dashboard
- **dashboard/views/forgot-password-submit-code.eta**: remake dashboard
- **dashboard/views/forgot-password.eta**: remake dashboard
- **dashboard/views/home.eta**: remake dashboard
- **dashboard/views/login.eta**: remake dashboard
- **dashboard/views/partials/footer.eta**: remake dashboard
- **dashboard/views/partials/header.eta**: remake dashboard
- **dashboard/views/partials/message.eta**: remake dashboard
- **dashboard/views/partials/nav.eta**: remake dashboard
- **dashboard/views/partials/title.eta**: remake dashboard
- **dashboard/views/profile.eta**: remake dashboard
- **dashboard/views/register-resend-code.eta**: remake dashboard
- **dashboard/views/register-submit-code.eta**: remake dashboard
- **dashboard/views/register.eta**: remake dashboard
- **dashboard/views/stats.eta**: remake dashboard
- **dashboard/views/verifyfbid-submit-code.eta**: remake dashboard
- **dashboard/views/verifyfbid.eta**: remake dashboard
- **languages/makeFuncGetLangs.js**: Update makeFuncGetLangs.js
- **scripts/cmds/setleave.js**: code optimization
- **scripts/cmds/setwelcome.js**: code optimization
- **scripts/cmds/uid.js**: language update
- **scripts/cmds/ytb.js**: fix error "TypeError: Cannot read properties of undefined (reading 'segmentedLikeDislikeButtonRenderer')"
- **scripts/events/welcome.js**: code optimization
- **utils.js**: code optimization
### 🗑️ Files Deleted
- **dashboard/middleware/get.js**: remake dashboard
- **dashboard/middleware/post.js**: remake dashboard
- **scripts/cmds/list.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.16
### ⬆️ What's Changed
- **languages/makeFuncGetLangs.js**: Fix error of language file not found
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.15
### ⬆️ What's Changed
- **Goat.js**: Update Goat.js
- **database/controller/usersData.js**: added function `getNameInDB`
- **languages/en.lang**: languages update
- **languages/makeFuncGetLangs.js**: Create makeFuncGetLangs.js
- **languages/vi.lang**: languages update
- **utils.js**: Update utils.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.14
### ⬆️ What's Changed
- **fb-chat-api/src/listenMqtt.js**: fix event `log:thread-icon` not working
- **fb-chat-api/utils.js**: fix event `log:thread-icon` not working
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.13
### ⬆️ What's Changed
- **bot/handler/handlerCheckData.js**: Update handlerCheckData.js
- **bot/login/loadScripts.js**: Update loadScripts.js
- **database/controller/threadsData.js**: change error name from `DATA_EXISTS` to `DATA_ALREADY_EXISTS`
- **package-lock.json**: Update package-lock.json
- **package.json**: Update package.json
- **scripts/cmds/antichangeinfobox.js**: language update
- **utils.js**: Update utils.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.12
### Reinstall Dependencies
Dependencies will be reinstalled for this version.
### ⬆️ What's Changed
- **config.json**: 
```json
{
  "hideNotiMessage.needRoleToUseCmdOnReply": false,
  "hideNotiMessage.needRoleToUseCmdOnReaction": false
}
```
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **package-lock.json**: update package
- **package.json**: update package
- **scripts/cmds/antichangeinfobox.js**: fix bug
- **scripts/cmds/ytb.js**: Fix error of not being able to use ytdl-core
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.11
### ⬆️ What's Changed
- **bot/login/loadScripts.js**: fix `TypeError: Cannot read properties of null (reading '_host')` (2)
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.10
### ⬆️ What's Changed
- **bot/login/login.js**: fix `TypeError: Cannot read properties of null (reading '_host')`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.9
### ⬆️ What's Changed
- **fb-chat-api/src/sendMessage.js**: add function `removeSpecialChar`: remove forbidden characters sent via facebook messages
- **scripts/cmds/callad.js**: language update, log update
- **scripts/cmds/gpt.js**: fix cannot use gpt chat when there is only one character
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.8
### ⬆️ What's Changed
- **scripts/cmds/warn.js**: language update, Fixed a bug that occurred when warning more than 3 times
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.7
### ⬆️ What's Changed
- **.gitignore**: Update .gitignore
- **bot/login/login.js**: Update login.js
- **scripts/cmds/setalias.js**: fix not applicable to the whole system
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.6
### ⬆️ What's Changed
- **fb-chat-api/index.js**: fca upadte
- **fb-chat-api/src/getFriendsList.js**: fca upadte
- **fb-chat-api/src/sendMessage.js**: fca upadte
- **fb-chat-api/src/setMessageReaction.js**: fca upadte
- **scripts/cmds/translate.js**: language update
- **scripts/cmds/warn.js**: language update, code optimization
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.5
### ⬆️ What's Changed
- **fb-chat-api/src/listenMqtt.js**: fix `event.participantIDs` not displaying correctly in thread
- **scripts/cmds/videofb.js**: Fixed can't download by `illusionghost3`

Fixed Sorry, we can't download the video for you because the size is larger than 83MB. Api changed.
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/illusionghost3">illusionghost3&nbsp;&nbsp;</a> <img src="https://github.com/illusionghost3.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="illusionghost3"></div>
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.4
### ⬆️ What's Changed
- **scripts/cmds/cmd.js**: fix failed to install command from url
- **scripts/cmds/weather.js**: added areaName in message body - by `Sadman-11`
- **scripts/cmds/ytb.js**: Fix cant downloads shorts - by `Sadman-11`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/Sadman-11">Sadman-11&nbsp;&nbsp;</a> <img src="https://github.com/Sadman-11.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="Sadman-11"></div>
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.3
### ⬆️ What's Changed
- **fb-chat-api/src/listenMqtt.js**: fix "TypeError: Cannot read properties of undefined (reading 'get')" when listenMqtt is closed
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.2
### ⬆️ What's Changed
- **Goat.js**: Update Goat.js
- **dashboard/routes/verifyfbid.js**: fix can't verify facebook id
- **dashboard/views/verifyfbid-submit-code.eta**: fix can't verify facebook id
- **languages/cmds/en.js**: language update
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **scripts/cmds/help.js**: fix can't send attachment
- **scripts/cmds/setleave.js**: fix can't send attachment
- **updater.js**: Update updater.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.1
### ⬆️ What's Changed
- **.gitignore**: Update .gitignore
- **.vscode/GoatBot.code-snippets**: add new snippet: `LogDev`: "Create template for log dev"
- **dashboard/routes/verifyfbid.js**: fix can't verify uid facebook
- **fb-chat-api/src/addUserToGroup.js**: Update addUserToGroup.js
- **fb-chat-api/src/listenMqtt.js**: Update listenMqtt.js
- **languages/cmds/en.js**: languages update
- **languages/events/en.js**: languages update
- **scripts/cmds/help.js**: languages update
- **scripts/cmds/setwelcome.js**: languages update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.5.0
### ⬆️ What's Changed
- **Copyright.txt**: Copyright update 😮‍💨
- **Goat.js**: Copyright update 😮‍💨
- **bot/handler/handlerEvents.js**: Update handlerEvents.js
- **bot/login/loadScripts.js**: update code
- **bot/login/login.js**: update code
- **index.js**: Copyright update 😮‍💨
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **scripts/cmds/texttoimage.js**: fix display `undefined`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.28
### ⬆️ What's Changed
- **scripts/cmds/jsontomongodb.js**: fix incorrect database type recognition
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.27
### ⬆️ What's Changed
- **bot/login/getFbstate1.js**: change package `request-promise` to `request`
- **bot/login/loadScripts.js**: change package `request-promise` to `request`
- **fb-chat-api/src/changeAvatar.js**: remove package `bluebird`
- **fb-chat-api/src/changeGroupImage.js**: remove package `bluebird`
- **fb-chat-api/src/sendMessage.js**: remove package `bluebird`
- **fb-chat-api/src/uploadAttachment.js**: remove package `bluebird`
- **fb-chat-api/utils.js**: remove package `bluebird`
- **package-lock.json**: update packages
- **package.json**: update packages
- **scripts/cmds/translate.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.26
### ⬆️ What's Changed
- **Goat.js**: fix jsonlint not working with folder names with spaces
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.25
### ⬆️ What's Changed
- **bot/login/loadData.js**: fix console freezing
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.24
### ⬆️ What's Changed
- **Goat.js**: remove home path in log auto update config
- **bot/login/loadData.js**: database optimization
- **bot/login/login.js**: database optimization
- **database/connectDB/connectSqlite.js**: database optimization
- **database/controller/index.js**: database optimization
- **scripts/cmds/jsontomongodb.js**: fix cannot use command `jsontomongo` and `jsontosqlite`
- **scripts/cmds/jsontosqlite.js**: fix cannot use command `jsontomongo` and `jsontosqlite`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.23
### ⬆️ What's Changed
- **Goat.js**: automatically update changes of dirConfigCommands and dirConfig
- **bot/login/loadData.js**: optimization code
- **bot/login/login.js**: optimization code
- **configCommands.json**: 
```json
{
  "envGlobal.goatbotApikey": ""
}
```
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **logger/log.js**: correct spelling `succes` -> `success`
- **restoreBackup.js**: Update restoreBackup.js
- **scripts/cmds/texttoimage.js**: fix cannot use command `texttoimage`
- **updater.js**: Update updater.js
- **utils.js**: add new class `GoatBotApis`: call api on https://goatbot.tk
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.22
### ⬆️ What's Changed
- **dashboard/passport-config.js**: fix can't register dashboard account
- **database/controller/dashBoardData.js**: fix can't register dashboard account
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.21
### ⬆️ What's Changed
- **database/controller/dashBoardData.js**: add new method: `deleteKey`
- **database/controller/globalData.js**: add new method: `deleteKey`
- **database/controller/threadsData.js**: add new method: `deleteKey`
- **database/controller/usersData.js**: add new method: `deleteKey`
- **updater.js**: fix can't update to new version
- **utils.js**: add new method: `isNumber`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.20
### ⬆️ What's Changed
- **scripts/cmds/antichangeinfobox.js**: change photo storage method
- **utils.js**: fix can't uploadImgbb with url
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.19
### ⬆️ What's Changed
- **dashboard/routes/register.js**: fix can't register dashboard account
- **database/models/sqlite/global.js**: fix can't register dashboard account
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.18
### ⬆️ What's Changed
- **bot/login/login.js**: fix handlerWhenListenHasError not working
- **config.json**: 
```json
{
  "optionsFca.autoReconnect": false
}
```
- **fb-chat-api/src/listenMqtt.js**: Update listenMqtt.js
- **scripts/cmds/cmd.js**: fix bug
- **scripts/cmds/customrankcard.js**: fix image not working after few days
- **scripts/cmds/daily.js**: Update daily.js
- **scripts/cmds/emojimean.js**: fixes 404 error
- **utils.js**: edit method `uploadImgbb`, add new class: `CustomError`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.17
### ⬆️ What's Changed
- **bot/login/login.js**: fix cannot install custom command with `cmd` command
- **dashboard/views/dashboard-thread.eta**: Update dashboard-thread.eta
- **scripts/cmds/cmd.js**: fix cannot install custom command with `cmd` command
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.16
### ⬆️ What's Changed
- **Goat.js**: add new handle `onAnyEvent`: handling for all types of events
- **bot/custom.js**: add new script bot/custom.js
- **bot/handler/handlerAction.js**: add new handle `onAnyEvent`: handling for all types of events
- **bot/handler/handlerEvents.js**: add new handle `onAnyEvent`: handling for all types of events
- **bot/login/getFbstate1.js**: fix can't login with account and password
- **bot/login/loadScripts.js**: fix can't login with account and password
- **bot/login/login.js**: fix can't login with account and password
- **fb-chat-api/index.js**: add new api `refreshFb_dtsg`: Refreshes the fb_dtsg and jazoest values in ctx of fca
- **fb-chat-api/src/refreshFb_dtsg.js**: add new api `refreshFb_dtsg`: Refreshes the fb_dtsg and jazoest values in ctx of fca
- **func/colors.js**: add new color to utils.colors (`cyanBright`)
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **logger/loading.js**: add new log and loading method: `succes`
- **logger/log.js**: add new log and loading method: `succes`
- **scripts/cmds/cmd.js**: Bug fixes and code optimization
- **scripts/cmds/event.js**: Bug fixes and code optimization
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.15
### Reinstall Dependencies
Dependencies will be reinstalled for this version.
### ⬆️ What's Changed
- **fb-chat-api/src/getThreadList.js**: Update getThreadList.js
- **utils.js**: fix `certificate has expired` error when uploading Zippyshare
- **package.json**: Update package.json
- **package-lock.json**: Update package-lock.json
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.14
### ⬆️ What's Changed
- **bot/login/login.js**: code optimization
- **dashboard/app.js**: change the `getAll` method of controller data to asynchronous
- **dashboard/middleware/get.js**: change the `getAll` method of controller data to asynchronous
- **dashboard/middleware/post.js**: change the `getAll` method of controller data to asynchronous
- **dashboard/routes/api.js**: change the `getAll` method of controller data to asynchronous
- **dashboard/routes/dashBoard.js**: change the `getAll` method of controller data to asynchronous
- **scripts/cmds/backupdata.js**: change the `getAll` method of controller data to asynchronous
- **scripts/cmds/customrankcard.js**: change file storage method with ZippyShare
- **scripts/cmds/notification.js**: change the `getAll` method of controller data to asynchronous
- **scripts/cmds/rank.js**: change file storage method with ZippyShare
- **utils.js**: add new methods `uploadImgbb` and `uploadZippyshare` to utils
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.13
### ⬆️ What's Changed
- **database/controller/threadsData.js**: hide console.log
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.12
### ⬆️ What's Changed
- **database/controller/dashBoardData.js**: change queue handling
- **database/controller/globalData.js**: change queue handling
- **database/controller/threadsData.js**: change queue handling
- **database/controller/usersData.js**: change queue handling
- **scripts/cmds/cmd.js**: fix bot stop working after using cmd command
- **utils.js**: add new method to utils: `createQueue`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.11
### ⬆️ What's Changed
- **bot/login/loadScripts.js**: code optimization
- **bot/login/login.js**: code optimization
- **fb-chat-api/src/addUserToGroup.js**: add `CustomError` class to fb-chat-api - easy for debugging
- **fb-chat-api/src/changeAdminStatus.js**: add `CustomError` class to fb-chat-api - easy for debugging
- **fb-chat-api/src/changeThreadColor.js**: add `CustomError` class to fb-chat-api - easy for debugging
- **fb-chat-api/src/getThreadList.js**: add `CustomError` class to fb-chat-api - easy for debugging
- **fb-chat-api/src/httpPostFormData.js**: add `CustomError` class to fb-chat-api - easy for debugging
- **fb-chat-api/utils.js**: add `CustomError` class to fb-chat-api - easy for debugging
- **scripts/cmds/cmd.js**: code optimization
- **scripts/cmds/eval.js**: code optimization
- **scripts/cmds/event.js**: code optimization
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.10
### ⬆️ What's Changed
- **bot/login/loadScripts.js**: code optimization
- **bot/login/login.js**: code optimization
- **database/controller/dashBoardData.js**: return data with _`.cloneDeep`
- **database/controller/globalData.js**: return data with _`.cloneDeep`
- **database/controller/threadsData.js**: return data with _`.cloneDeep`
- **database/controller/usersData.js**: return data with _`.cloneDeep`
- **package-lock.json**: Update package-lock.json
- **scripts/cmds/autosetname.js**: code optimization
- **scripts/cmds/cmd.js**: code optimization
- **scripts/cmds/count.js**: code optimization
- **scripts/cmds/customrankcard.js**: code optimization
- **scripts/cmds/grouptag.js**: languages update
- **scripts/cmds/kick.js**: languages update
- **scripts/cmds/prefix.js**: code optimization
- **scripts/cmds/setlang.js**: code optimization
- **scripts/cmds/warn.js**: languages update
- **scripts/events/autoUpdateInfoThread.js**: code optimization
- **utils.js**: code optimization
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.9
### ⬆️ What's Changed
- **scripts/cmds/texttoimage.js**: update styleId
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.8
### ⬆️ What's Changed
- **scripts/cmds/texttoimage.js**: new command `texttoimage`: create image with your prompt
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.7
### ⬆️ What's Changed
- **bot/login/loadScripts.js**: fix console freezing
- **bot/login/login.js**: fix console freezing
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.6
### ⬆️ What's Changed
- **bot/login/loadScripts.js**: ignore the file's command extension `eg.js`
- **bot/login/login.js**: ignore the file's command extension `eg.js`
### 🗑️ Files Deleted
- **scripts/cmds/art.js**: api is no longer working
- **scripts/cmds/openjourney.js**: api is no longer working
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.5
### ⬆️ What's Changed
- **database/controller/dashBoardData.js**: add new prototype `existsSync` for dashBoardData, globalData, threadsData and usersData
- **database/controller/globalData.js**: add new prototype `existsSync` for dashBoardData, globalData, threadsData and usersData
- **database/controller/threadsData.js**: add new prototype `existsSync` for dashBoardData, globalData, threadsData and usersData
- **database/controller/usersData.js**: add new prototype `existsSync` for dashBoardData, globalData, threadsData and usersData
- **fb-chat-api/src/sendMessage.js**: update callback when error occurs
- **scripts/cmds/antichangeinfobox.js**: add new subcommand `nickname`: anti change nickname in box chat
- **scripts/cmds/warn.js**: fix bug
- **scripts/events/autoUpdateInfoThread.js**: fix bug
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.4
### ⬆️ What's Changed
- **Goat.js**: auto convert data type uid in config to string
- **bot/handler/handlerEvents.js**: update option `hideNotiMessage`
- **bot/login/loadScripts.js**: update option `hideNotiMessage`
- **bot/login/login.js**: update option `hideNotiMessage`
- **config.json**: 
```json
{
  "hideNotiMessage": {
    "commandNotFound": false,
    "adminOnly": false,
    "threadBanned": false,
    "userBanned": false,
    "needRoleToUseCmd": false
  }
}
```
- **fb-chat-api/src/listenMqtt.js**: fix bug
- **scripts/cmds/adminonly.js**: add subcommand: `adminonly noti`: turn on/off the notification when user is not admin use bot
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.3
### ⬆️ What's Changed
- **fb-chat-api/utils.js**: change key `participants` to `participantIDs` in callback `event` type in mqtt
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **updater.js**: Update updater.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.2
### ⬆️ What's Changed
- **bot/login/login.js**: hide participantIDs from log
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.1
### ⬆️ What's Changed
- **bot/login/login.js**: fix `Please restore the crypto.c reateCipher function to the original!`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.4.0
### ⬆️ What's Changed
- **bot/login/login.js**: Update gban system
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **restoreBackup.js**: add new script `restoreBackup.js`: restore restore the previous backup version
- **scripts/cmds/shortcut.js**: fix bug
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.22
### ⬆️ What's Changed
- **README.md**: Update README.md
- **scripts/cmds/warn.js**: fix checkwarn not working
- **scripts/events/checkwarn.js**: fix checkwarn not working
- **scripts/events/welcome.js**: Update welcome.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.21
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fixes error: `TypeError: onFirstChat is not a function`
- **bot/login/loadScripts.js**: fixes error: `TypeError: onFirstChat is not a function`
- **bot/login/login.js**: fixes error: `TypeError: onFirstChat is not a function`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.20
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fixes error: `TypeError: onFirstChat is not a function`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.19
### ⬆️ What's Changed
- **.gitignore**: Update .gitignore
- **.vscode/GoatBot.code-snippets**: add new snippets: `GoatBotCommandSetOnReply`, `GoatBotCommandSetOnReaction`, `GoatBotCommandPushOnEvent`, `GoatBotCommandSetOnChat`
- **Goat.js**: add new handle: `onFirstChat`
- **bot/handler/handlerAction.js**: add new handle: `onFirstChat`
- **bot/handler/handlerCheckData.js**: code optimization
- **bot/handler/handlerEvents.js**: fix thread refresh when event doesn't have threadID
- **bot/login/login.js**: fix infinite loop Stop listenMqtt
- **database/controller/dashBoardData.js**: code optimization
- **database/controller/globalData.js**: code optimization
- **database/controller/threadsData.js**: code optimization
- **database/controller/usersData.js**: code optimization
- **fb-chat-api/src/listenMqtt.js**: remove mqttClient listen close message and added key ``participantIDs` to event type `message` and `message_reply`
- **fb-chat-api/utils.js**: added key `participantIDs` to event type `message`
- **package.json**: add new scripts: `dev`, `prod`
- **scripts/cmds/ban.js**: add sub command `check`: Check banned members and kick them out of the box chat
- **scripts/cmds/cmd.js**: add new handle: `onFirstChat`
- **utils.js**: code optimization
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.18
### ⬆️ What's Changed
- **fb-chat-api/src/listenMqtt.js**: fix infinite loop Stop listenMqtt
- **scripts/cmds/getfbstate.js**: add new alias `getcookie`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.17
### ⬆️ What's Changed
- **database/controller/dashBoardData.js**: fix bug `cannot read property 'name' of undefined`
- **database/controller/globalData.js**: fix bug `cannot read property 'name' of undefined`
- **database/controller/threadsData.js**: fix bug `cannot read property 'name' of undefined`
- **database/controller/usersData.js**: fix bug `cannot read property 'name' of undefined`
- **scripts/cmds/getfbstate.js**: add new subcommand: `cookies`, `string`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.16
### Reinstall Dependencies
Dependencies will be reinstalled for this version.
### ⬆️ What's Changed
- **database/controller/dashBoardData.js**: add message queue for save data
- **database/controller/globalData.js**: add message queue for save data
- **database/controller/threadsData.js**: add message queue for save data
- **database/controller/usersData.js**: add message queue for save data
- **scripts/cmds/help.js**: fix bug & language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.15
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fix mqtt bug
- **bot/login/login.js**: fix mqtt bug
- **config.json**: 
```json
{
  "hideNotiMessage": {
    "wrongCommand": false,
    "adminOnly": false,
    "threadBanned": false,
    "userBanned": false
  }
}
```
- **fb-chat-api/src/getMessage.js**: update new thread colors
- **fb-chat-api/src/listenMqtt.js**: Update listenMqtt.js
- **fb-chat-api/src/threadColors.js**: update new thread colors
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **scripts/cmds/adboxonly.js**: add new subcommand: `noti` (on/off the notification when user is not admin of group use bot)
- **scripts/cmds/openjourney.js**: language update $ handle error
- **updater.js**: Update updater.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.14
### ⬆️ What's Changed
- **config.json**: 
```json
{
  "whiteListMode.notes": "if you enable this feature, only the ids in the whiteListIds section can use the bot"
}
```
- **fb-chat-api/index.js**: add function `unfriend` for fca
- **fb-chat-api/src/unfriend.js**: add function `unfriend` for fca
- **updater.js**: Update updater.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.13
### ⬆️ What's Changed
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **updater.js**: Update updater.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.12
### ⬆️ What's Changed
- **STEP_INSTALL.md**: Update STEP_INSTALL.md
- **bot/login/login.js**: fixes `getSeqId`
- **config.json**: 
```json
{
  "whiteListMode": {
    "enable": false,
    "whiteListIds": []
  }
}
```
- **fb-chat-api/src/listenMqtt.js**: fixes `getSeqId`
- **fb-chat-api/utils.js**: update new function: `checkLiveCookie`
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **replit.nix**: Update replit.nix
- **scripts/cmds/thread.js**: fix could not find thread joined
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.11
### ⬆️ What's Changed
- **LICENSE**: Update LICENSE
- **bot/login/login.js**: Update login.js
- **index.js**: Update index.js
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.10
### ⬆️ What's Changed
- **README.md**: Update README.md
- **scripts/cmds/gpt.js**: Don't let others interfere with your chats and gpt
- **scripts/cmds/rank.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.9
### ⬆️ What's Changed
- **bot/login/login.js**: code optimization
- **fb-chat-api/index.js**: fix duplicate values in getAppState()
- **fb-chat-api/src/addUserToGroup.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/setPostReaction.js**: can use `i_user` (another profile in facebook account)
- **scripts/cmds/gpt.js**: fix `You are using gpt chat` error
- **scripts/cmds/prefix.js**: language update
- **scripts/cmds/sendnoti.js**: add new sub-command `list`: show list of notification groups you are managing, and `info`: view info of notification group
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.8
### ⬆️ What's Changed
- **Goat.js**: Update Goat.js
- **fb-chat-api/src/listenMqtt.js**: Update listenMqtt.js
- **scripts/cmds/gpt.js**: new command `gpt`: use open ai api model `gpt-3.5-turbo`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.7
### ⬆️ What's Changed
- **Goat.js**: Update Goat.js
- **bot/login/handlerWhenListenHasError.js**: Update handlerWhenListenHasError.js
- **fb-chat-api/src/sendMessage.js**: Update sendMessage.js
- **package-lock.json**: Update package-lock.json
- **scripts/cmds/ban.js**: language update
- **scripts/cmds/guessnumber.js**: Official version released
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.6
### ⬆️ What's Changed
- **Goat.js**: fix listenMqtt loop issues
- **bot/handler/handlerAction.js**: fix events not working when `antiInbox is on`
- **bot/login/loadScripts.js**: code optimization
- **bot/login/login.js**: can use `i_user` (another profile in facebook account)
- **config.json**: 
```json
{
  "adminOnly.hideNotiMessage": false,
  "facebookAccount.i_user": ""
}
```
- **fb-chat-api/index.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/changeAvatar.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/changeBio.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/changeGroupImage.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/changeThreadColor.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/createNewGroup.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/getCurrentUserID.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/getFriendsList.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/getUserID.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/handleFriendRequest.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/listenMqtt.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/sendMessage.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/setMessageReaction.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/setPostReaction.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/setTitle.js**: can use `i_user` (another profile in facebook account)
- **fb-chat-api/src/unfriend.js**: can use `i_user` (another profile in facebook account)
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.5
### ⬆️ What's Changed
- **Goat.js**: added the feature to disable bot in inbox and automatically load the scripts when there is a change
- **bot/handler/handlerAction.js**: added the feature to disable bot in inbox and automatically load the scripts when there is a change
- **bot/login/loadData.js**: added the feature to disable bot in inbox and automatically load the scripts when there is a change
- **bot/login/login.js**: added the feature to disable bot in inbox and automatically load the scripts when there is a change
- **config.json**: 
```json
{
  "antiInbox": false,
  "autoLoadScripts": {
    "enable": false,
    "ignoreCmds": "",
    "ignoreEvents": "",
    "notes": "this feature will automatically load the script when scripts have been changed, you can set ignoreCmds to ignore commands, ignoreEvents to ignore events, separate by comma or space, example: \"cmd1.js cmd2.js cmd3.js\" (without backslash)"
  }
}
```
- **scripts/cmds/customrankcard.js**: fix file url from facebook expires after some time
- **scripts/cmds/rank.js**: fix file url from facebook expires after some time
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.4
### ⬆️ What's Changed
- **.gitignore**: Update .gitignore
- **Goat.js**: Update Goat.js
- **bot/login/handlerWhenListenHasError.js**: trim content to 2000 characters for discord hook (maximum limit)
- **bot/login/loadData.js**: code optimization
- **bot/login/loadScripts.js**: code optimization
- **bot/login/login.js**: code optimization
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **scripts/cmds/ban.js**: Release the official version
- **utils.js**: update function `convertTime`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.3
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fix can't use alias for ignoreadboxonly
- **bot/login/loadScripts.js**: fix cannot use database sqlite
- **bot/login/login.js**: i hope can fix listenMqtt error
- **dashboard/app.js**: hide log: forget to use `express-session` middleware
- **database/controller/globalData.js**: fix cannot use database sqlite
- **scripts/cmds/update.js**: command ability
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.2
### ⬆️ What's Changed
- **config.json**: 
```json
{
  "restartListenMqtt.delayAfterStopListening": 2000,
  "optionsFca.autoReconnect": true
}
```
- **.gitignore**: Update .gitignore
- **Goat.js**: and fix error listenMqtt
- **bot/login/loadScripts.js**: code optimization
- **bot/login/login.js**: hiden log error and fix error listenMqtt
- **fb-chat-api/README.MD**: Create README.MD
- **fb-chat-api/src/listenMqtt.js**: and fix error listenMqtt
- **fb-chat-api/utils.js**: hiden log error and fix error listenMqtt
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.1
### ⬆️ What's Changed
- **config.json**: 
```json
{
  "optionsFca.autoReconnect": false
}
```
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.3.0
### ⬆️ What's Changed
- **fb-chat-api/index.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/utils.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/addExternalModule.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/addUserToGroup.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeAdminStatus.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeArchivedStatus.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeAvatar.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeBio.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeBlockedStatus.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeGroupImage.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeNickname.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeThreadColor.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/changeThreadEmoji.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/createNewGroup.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/createPoll.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/deleteMessage.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/deleteThread.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/forwardAttachment.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getCurrentUserID.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getEmojiUrl.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getFriendsList.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getMessage.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getThreadHistory.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getThreadInfo.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getThreadList.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getThreadPictures.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getUserID.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/getUserInfo.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/handleFriendRequest.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/handleMessageRequest.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/httpGet.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/httpPost.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/httpPostFormData.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/listenMqtt.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/logout.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/markAsDelivered.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/markAsRead.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/markAsReadAll.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/markAsSeen.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/muteThread.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/removeUserFromGroup.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/resolvePhotoUrl.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/searchForThread.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/sendMessage.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/sendTypingIndicator.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/setMessageReaction.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/setPostReaction.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/setTitle.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/threadColors.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/unfriend.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/unsendMessage.js**: remove dependency package `fb-chat-api-temp`
- **fb-chat-api/src/uploadAttachment.js**: remove dependency package `fb-chat-api-temp`
- **scripts/cmds/backupdata.js**: change command name
- **bot/handler/handlerEvents.js**: code optimization
- **bot/login/checkLiveCookie.js**: code optimization
- **bot/login/handlerWhenListenHasError.js**: code optimization
- **bot/login/login.js**: code optimization
- **scripts/cmds/guessnumber.js**: code optimization
- **config.json**: 
```json
{
  "optionsFca.autoReconnect": true
}
```
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **scripts/cmds/anime.js**: delete anime command - api is down
- **package.json**: 
- **package-lock.json**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.43
### ⬆️ What's Changed
- **bot/login/login.js**: code optimization
- **bot/handler/handlerEvents.js**: code optimization
- **scripts/cmds/setalias.js**: code optimization
- **scripts/cmds/shortcut.js**: code optimization
- **database/controller/globalData.js**: code optimization and fix bug
- **database/models/sqlite/global.js**: code optimization and fix bug
- **logger/log.js**: add new function `log.dev()`
- **scripts/cmds/eval.js**: add error log in console when there is an error
- **scripts/cmds/guessnumber.js**: added ranking function for game `guessnumber`
- **scripts/cmds/backupdata.js**: new command: `backupdata` - backup bot data to json file
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.42
### ⬆️ What's Changed
- **utils.js**: update function `randomString`
- **scripts/events/welcome.js**: disable greetings for members banned by the `ban` command
- **scripts/cmds/guessnumber.js**: new command game `guessnumber`
- **bot/login/login.js**: can login with Netscape cookies
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **scripts/cmds/openjourney.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.41
### ⬆️ What's Changed
- **bot/login/checkLiveCookie.js**: update handler check live cookie
- **package-lock.json**: change the fca dependency package
- **package.json**: change the fca dependency package
- **bot/login/login.js**: fix unable to reconnect to listenMqtt
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.40
### ⬆️ What's Changed
- **scripts/events/autoUpdateInfoThread.js**: add category
- **scripts/events/checkwarn.js**: add category
- **scripts/events/leave.js**: add category
- **scripts/events/logsbot.js**: add category
- **scripts/events/newcommandevent.eg.js**: add category
- **scripts/events/onEvent.js**: add category
- **scripts/events/welcome.js**: add category
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.39
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: nothing change
- **bot/login/loadScripts.js**: 
- **scripts/cmds/openjourney.js**: fix error can't create image
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.38
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: nothing change
- **bot/login/login.js**: fix console freezing when login
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.37
### ⬆️ What's Changed
- **bot/login/login.js**: fix repeated feedback
- **Goat.js**: fix repeated feedback
- **func/prism.js**: 
- **scripts/cmds/ytb.js**: fix can't use `ytb` command
- **package-lock.json**: fix can't use `ytb` command
- **package.json**: fix can't use `ytb` command
- **scripts/cmds/openjourney.js**: new command: `openjourney` - create image from text
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.36
### ⬆️ What's Changed
- **bot/login/login.js**: fix bug
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.35
### ⬆️ What's Changed
- **database/controller/globalData.js**: convert `global.client.globalData` to `global.db.allGlobalData`
- **database/controller/dashBoardData.js**: convert `global.client.dashBoardData` to `global.db.allDashBoardData`
- **bot/login/login.js**: fix cannot automatically reconnect listenMqtt
- **dashboard/app.js**: added `app.use(bodyParser.json());`
- **database/controller/usersData.js**: added function `getMoney`
- **database/models/sqlite/global.js**: remove `unique`
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **scripts/cmds/notification.js**: nothing change
- **scripts/cmds/rank.js**: nothing change
- **Goat.js**: add new keys to `global.db`
- **config.json**: 
```json
{
  "notiWhenListenMqttError": {
    "notes": "This is the message when the bot is listening to the mqtt server and the mqtt server stops working due to account problems such as: locked acc, blocked due to spam,... bot will automatically send notifications to parts of your settings. You must change enable to true to use this feature. See bot/login/handlerWhenListenHasError.js file for details on how it works",
    "gmail": {
      "enable": false,
      "emailGetNoti": "",
      "note": "Bot will use gmailAccount to send email to emailGetNoti, can send notifications to many email, separate by comma or space, example: \"example1@gmail.com example2@gmail.com\" (without backslash)"
    },
    "telegram": {
      "enable": false,
      "botToken": "",
      "chatId": "",
      "note": "Can send notifications to many chatId, separate by comma or space, example: \"123456789 987654321\" (without backslash)"
    },
    "discordHook": {
      "enable": false,
      "webhookUrl": "",
      "note": "Can send notifications to many webhookUrl, separate by comma or space, example: \"https://discord.com/api/webhooks/123456789/123456789 https://discord.com/api/webhooks/987654321/987654321\" (without backslash)"
    }
  }
}
```
- **bot/login/handlerWhenListenHasError.js**: added the function to send notifications about email, telegram,... when mqtt server stops working due to account problems
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.34
### ⬆️ What's Changed
- **scripts/events/autoUpdateInfoThread.js**: fix error `cannot read properties of undefined (reading 'gender')`
- **scripts/events/logsbot.js**: nothing change
- **scripts/cmds/ban.js**: add unban feature
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.33
### ⬆️ What's Changed
- **scripts/cmds/shortcut.js**: fix `shortcut start xxx` not work
- **bot/handler/handlerEvents.js**: code optimization
- **bot/login/loadScripts.js**: code optimization
- **bot/login/login.js**: code optimization
- **scripts/cmds/filteruser.js**: code optimization
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **scripts/cmds/ban.js**: new command (ban user from group, beta version)
- **Goat.js**: new global variable
- **scripts/cmds/help.js**: Update new features, use command `help help` to see details
- **scripts/cmds/uid.js**: Update new features, use command `help help` to see details
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.32
### ⬆️ What's Changed
- **bot/login/handlerWhenListenHasError.js**: 
- **bot/login/login.js**: code optimization
- **utils.js**: code optimization
- **func/prism.js**: code optimization
- **Goat.js**: language update
- **languages/vi.lang**: language update
- **languages/en.lang**: language update
- **scripts/cmds/cmd.js**: support install command from `savetext.net` and `pastebin.com`
- **scripts/cmds/shortcut.js**: add filter when exporting list (use `help shortcut` command to see details)
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.31
### ⬆️ What's Changed
- **bot/login/getFbstate1.js**: detect and notify if the facebook account is checkpointed
- **bot/login/login.js**: detect and notify if the facebook account is checkpointed
- **func/colors.js**: added new func
- **func/prism.js**: added new func
- **logger/loading.js**: changed package `chalk` to `colors` function
- **logger/log.js**: changed package `chalk` to `colors` function
- **logger/logColor.js**: changed package `chalk` to `colors` function
- **languages/vi.lang**: languages update
- **languages/en.lang**: languages update
- **Goat.js**: changed package `chalk` to `colors` function, added function `sendMail` to utils
- **package-lock.json**: remove the chalk package
- **package.json**: remove the chalk package
- **utils.js**: changed package `chalk` to `colors` function, beauty code
- **scripts/cmds/videofb.js**: add command to download public facebook video
- **dashboard/app.js**: 
- **bot/login/handlerWhenListenHasError.js**: added example how to use handlerWhenListenHasError
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.30
### ⬆️ What's Changed
- **scripts/cmds/grouptag.js**: fixed bugs, language update
- **config.json**: 
```json
{
  "autoRestartWhenListenMqttError": false
}
```
- **bot/login/handlerWhenListenHasError.js**: new feature: callback when listen has error
- **bot/login/login.js**: new feature: callback when listen has error
- **dashboard/app.js**: added feature to change fbstate directly on dashboard
- **dashboard/views/changeFbstate.eta**: added feature to change fbstate directly on dashboard
- **dashboard/middleware/get.js**: added middleware `isAdmin`
- **database/controller/globalData.js**: fixed bugs
- **database/controller/usersData.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.29
### ⬆️ What's Changed
- **scripts/cmds/cmd.js**: fixed bugs
- **scripts/cmds/event.js**: fixed bugs
- **scripts/cmds/translate.js**: fixed bugs
### 🗑️ Files Deleted
- **scripts/cmds/videofb.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.28
### ⬆️ What's Changed
- **scripts/cmds/filteruser.js**: fix bug kick admin
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.27
### ⬆️ What's Changed
- **bot/autoUptime.js**: language update
- **scripts/cmds/user.js**: language update
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.26
### ⬆️ What's Changed
- **languages/cmds/en.js**: language update
- **scripts/cmds/cmd.js**: fixed bugs and add new feature: `cmd install <fileName> <code>`: install new command with code
- **scripts/cmds/event.js**: fixed bugs and add new feature: `event install <fileName> <code>`: install new event command with code
- **scripts/cmds/help.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.25
### ⬆️ What's Changed
- **scripts/cmds/update.js**: new command 'Check for and install updates for the chatbot' made by `Chat GPT`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.24
### ⬆️ What's Changed
- **scripts/events/welcome.js**: language update
- **bot/handler/handlerEvents.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.23
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: fixed error `An error has occurred: ETIMEDOUT`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.22
### ⬆️ What's Changed
- **scripts/cmds/admin.js**: language update
- **scripts/cmds/videofb.js**: fixed can't download video
- **bot/login/getFbstate1.js**: fixed can't login
- **bot/login/login.js**: fixed can't login
- **bot/login/loadScripts.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.21
### ⬆️ What's Changed
- **scripts/cmds/antichangeinfobox.js**: fixes error
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.20
### ⬆️ What's Changed
- **package.json**: update package `fb-chat-api-temporary`
- **package-lock.json**: update package `fb-chat-api-temporary`
- **bot/login/login.js**: update package `fb-chat-api-temporary`
### 🗑️ Files Deleted
- **fb-chat-api**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.19
### ⬆️ What's Changed
- **fb-chat-api/src/addExternalModule.js**: 
- **fb-chat-api/src/addUserToGroup.js**: 
- **fb-chat-api/src/changeAdminStatus.js**: 
- **fb-chat-api/src/changeArchivedStatus.js**: 
- **fb-chat-api/src/changeAvatar.js**: 
- **fb-chat-api/src/changeBio.js**: 
- **fb-chat-api/src/changeBlockedStatus.js**: 
- **fb-chat-api/src/changeGroupImage.js**: 
- **fb-chat-api/src/changeNickname.js**: 
- **fb-chat-api/src/changeThreadColor.js**: 
- **fb-chat-api/src/changeThreadEmoji.js**: 
- **fb-chat-api/src/createNewGroup.js**: 
- **fb-chat-api/src/createPoll.js**: 
- **fb-chat-api/src/deleteMessage.js**: 
- **fb-chat-api/src/deleteThread.js**: 
- **fb-chat-api/src/forwardAttachment.js**: 
- **fb-chat-api/src/getCurrentUserID.js**: 
- **fb-chat-api/src/getEmojiUrl.js**: 
- **fb-chat-api/src/getFriendsList.js**: 
- **fb-chat-api/src/getMessage.js**: 
- **fb-chat-api/src/getThreadHistory.js**: 
- **fb-chat-api/src/getThreadInfo.js**: 
- **fb-chat-api/src/getThreadList.js**: 
- **fb-chat-api/src/getThreadPictures.js**: 
- **fb-chat-api/src/getUserID.js**: 
- **fb-chat-api/src/getUserInfo.js**: 
- **fb-chat-api/src/handleFriendRequest.js**: 
- **fb-chat-api/src/handleMessageRequest.js**: 
- **fb-chat-api/src/httpGet.js**: 
- **fb-chat-api/src/httpPost.js**: 
- **fb-chat-api/src/httpPostFormData.js**: 
- **fb-chat-api/src/listenMqtt.js**: 
- **fb-chat-api/src/logout.js**: 
- **fb-chat-api/src/markAsDelivered.js**: 
- **fb-chat-api/src/markAsRead.js**: 
- **fb-chat-api/src/markAsReadAll.js**: 
- **fb-chat-api/src/markAsSeen.js**: 
- **fb-chat-api/src/muteThread.js**: 
- **fb-chat-api/src/removeUserFromGroup.js**: 
- **fb-chat-api/src/resolvePhotoUrl.js**: 
- **fb-chat-api/src/searchForThread.js**: 
- **fb-chat-api/src/sendMessage.js**: 
- **fb-chat-api/src/sendTypingIndicator.js**: 
- **fb-chat-api/src/setMessageReaction.js**: 
- **fb-chat-api/src/setPostReaction.js**: 
- **fb-chat-api/src/setTitle.js**: 
- **fb-chat-api/src/test.js**: 
- **fb-chat-api/src/threadColors.js**: 
- **fb-chat-api/src/unfriend.js**: 
- **fb-chat-api/src/unsendMessage.js**: 
- **fb-chat-api/index.js**: 
- **fb-chat-api/utils.js**: 
- **bot/login/login.js**: replace package `fb-chat-api`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.18
### ⬆️ What's Changed
- **package.json**: package `fb-chat-api` no longer exists
- **package-lock.json**: package `fb-chat-api` no longer exists
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.17
### ⬆️ What's Changed
- **package.json**: change package `fb-chat-api` to github repo
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.16
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: fixes error: TypeError: Cannot read property 'accessibilityData' of undefined
- **scripts/cmds/newcommand.eg.js**: template for create new command
- **scripts/events/newcommandevent.eg.js**: template for create new command event
- **README.md**: update readme
- **DOCS.md**: update docs
- **bot/handler/handlerEvents.js**: update
- **bot/login/loadScripts.js**: update
- **.vscode/GoatBot.code-snippets**: new snippets: GoatBotEventCreate
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.15
### ⬆️ What's Changed
- **config.json**: 
```json
{
  "database.autoSyncWhenStart": false
}
```
- **scripts/cmds/shortcut.js**: can overwrite existing shortcut
- **scripts/cmds/sendnoti.js**: fixes admin bot can't send notification
- **languages/cmds/en.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.14
### ⬆️ What's Changed
- **bot/login/login.js**: fixed error gban check
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.13
### ⬆️ What's Changed
- **bot/login/login.js**: language update
- **scripts/cmds/badwords.js**: language update
- **languages/cmds/en.js**: language update
- **scripts/cmds/filteruser.js**: Fixed a bug that could not delete members whose account was locked & language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.12
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: fixes error can't download video
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.11
### ⬆️ What's Changed
- **scripts/cmds/shortcut.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.10
### ⬆️ What's Changed
- **utils.js**: update shorten url function
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.9
### ⬆️ What's Changed
- **.vscode/GoatBot.code-snippets**: add code snippets
- **bot/login/login.js**: languages update
- **languages/cmds/en.js**: languages update
- **scripts/cmds/adduser.js**: language update
- **scripts/cmds/help.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.8
### ⬆️ What's Changed
- **scripts/cmds/callad.js**: language update
- **languages/cmds/en.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.7
### ⬆️ What's Changed
- **languages/cmds/en.js**: language update
- **languages/cmds/vi.js**: language update
- **scripts/cmds/warn.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.6
### ⬆️ What's Changed
- **bot/login/login.js**: easy login with terminal and auto-login again when cookie expires (if there is account configuration, password in config.json file)
- **config.json**: 
```json
{
  "facebookAccount.intervalGetNewCookie": 1440,
  "facebookAccount.notes": "time the system automatically retrieves new cookies from email/password, unit is minute, if you set null, the system will not automatically retrieve new cookies, it saves you from having to manually change your cookie every time it expires. recommended set to 1440 (1day) or 4320 (3day).TO BE ABLE TO USE THIS FEATURE YOU NEED TO ENTER THE ACCOUNT PASSWORD ABOVE"
}
```
- **languages/vi.lang**: language update
- **languages/en.lang**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.5
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: fixes error `An error occurred when executing onReply at command "ytb"`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.4
### ⬆️ What's Changed
- **scripts/cmds/tik.js**: fixes error `❌ An error occurred, please try again later`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.3
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: fixes error `An error occured when executing command "ytb"`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.2
### ⬆️ What's Changed
- **scripts/cmds/art.js**: fixes error when reply message no pictures attached
- **languages/cmds/en.js**: language update
- **package.json**: add gradient-string package
- **package-lock.json**: add gradient-string package
- **scripts/cmds/antichangeinfobox.js**: 
- **scripts/cmds/warn.js**: fixes error `❌ Can't find text on language "en" for command "warn" with key "list"`
- **languages/vi.lang**: language update
- **languages/en.lang**: language update
- **updater.js**: automatically install dependencies after update
- **index.js**: show author information
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.1
### ⬆️ What's Changed
- **bot/login/login.js**: update & code optimization
- **database/controller/dashBoardData.js**: update & code optimization
- **database/controller/globalData.js**: update & code optimization
- **database/controller/threadsData.js**: update & code optimization
- **database/controller/usersData.js**: update & code optimization
- **bot/login/checkLiveCookie.js**: update & code optimization
- **scripts/cmds/art.js**: new command: Convert photos into anime drawings
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.2.0
### ⬆️ What's Changed
- **bot/login/login.js**: change my server domain
- **scripts/cmds/antichangeinfobox.js**: change my server domain
- **scripts/cmds/avatar.js**: change my server domain
- **scripts/cmds/dhbc.js**: change my server domain
- **scripts/cmds/emojimix.js**: change my server domain
- **scripts/cmds/emojimean.js**: fix bug
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.40
### ⬆️ What's Changed
- **scripts/cmds/customrankcard.js**: fixes can't select photo by replying to message
- **scripts/cmds/rank.js**: fixes not being able to optional alphaSubcolor = 0
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.39
### ⬆️ What's Changed
- **updater.js**: update updater
- **scripts/cmds/help.js**: fix can't automatically create new folder when it doesn't exist
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.38
### ⬆️ What's Changed
- **languages/cmds/en.js**: language update and change the image storage address of some commands
- **scripts/cmds/setwelcome.js**: change photo storage address
- **scripts/cmds/setleave.js**: change photo storage address
- **scripts/cmds/setname.js**: change photo storage address
### 🗑️ Files Deleted
- **scripts/cmds/assets/guide/customrankcard/guide1.jpg**: change photo storage address
- **scripts/cmds/assets/guide/customrankcard/guide2.png**: change photo storage address
- **scripts/cmds/assets/guide/setleave/guide1.png**: change photo storage address
- **scripts/cmds/assets/guide/setname/guide1.png**: change photo storage address
- **scripts/cmds/assets/guide/setname/guide2.png**: change photo storage address
- **scripts/cmds/assets/guide/setwelcome/guide1.png**: change photo storage address
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.37
### ⬆️ What's Changed
- **languages/cmds/en.js**: language update
- **bot/handler/handlerEvents.js**: fixes error `TypeError: Cannot read property 'config' of undefined`
- **bot/login/login.js**: fixes auto restart bot when calling `cmd loadAll`
- **scripts/cmds/cmd.js**: can load multiple commands at once
- **scripts/cmds/customrankcard.js**: Can be customized more
- **scripts/cmds/rank.js**: can be customized more
- **scripts/cmds/help.js**: language update
- **scripts/cmds/tik.js**: fixes error when download slides
- **scripts/cmds/ytb.js**: fixes error `TypeError: Cannot read properties of null (reading '0')`
- **utils.js**: 
- **scripts/cmds/assets/guide/customrankcard/guide1.jpg**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.36
### ⬆️ What's Changed
- **scripts/cmds/emojimean.js**: automatically select the highest resolution image
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.35
### ⬆️ What's Changed
- **bot/login/getFbstate1.js**: can detect using old password when logging in
- **bot/handler/handlerEvents.js**: language update
- **languages/cmds/en.js**: language update
- **languages/en.lang**: language update
- **scripts/cmds/cmd.js**: language update
- **scripts/cmds/tik.js**: fixes errors cannot download videos/audio
- **scripts/cmds/ytb.js**: Delete the ytdl-core package & fixes error `Cannot Search Video`
- **scripts/cmds/emojimean.js**: New command: Searching for the meaning of Emoji, the data is taken from `https://www.emojiall.com/`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.34
### ⬆️ What's Changed
- **scripts/cmds/tik.js**: fixes error: `Error: connect ECONNREFUSED 0.0.0.0:443`
- **utils.js**: add `shortenURL` feature
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.33
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: Fixed a error that failed to generate data when adding a bot to a new chat box
- **database/controller/threadsData.js**: Fixed a error that failed to generate data when adding a bot to a new chat box
- **database/controller/dashBoardData.js**: minor bug fixes
- **database/controller/globalData.js**: minor bug fixes
- **database/controller/usersData.js**: minor bug fixes
- **scripts/events/logsbot.js**: fixes bot changing nickname twice when added to new chat box
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.32
### ⬆️ What's Changed
- **bot/login/login.js**: fixes facebook login problem
- **bot/login/getFbstate1.js**: fixes facebook login problem
- **config.json**: 
```json
{
  "facebookAccount.userAgent": "Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36"
}
```
- **logger/log.js**: remove the separator character
- **logger/loading.js**: remove the separator character
- **dashboard/views/dashboard-thread.eta**: code optimization
- **dashboard/views/dashboard.eta**: code optimization
- **dashboard/views/partials/footer.eta**: code optimization
- **dashboard/views/partials/header.eta**: code optimization
- **dashboard/views/partials/message.eta**: code optimization
- **dashboard/views/register-submit-code.eta**: code optimization
- **dashboard/views/verifyfbid-submit-code.eta**: code optimization
- **dashboard/views/verifyfbid.eta**: code optimization
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.31
### ⬆️ What's Changed
- **scripts/cmds/avatar.js**: fixes error: `TypeError: Cannot read properties of undefined (reading 'data')`
- **scripts/cmds/cmd.js**: 
- **scripts/cmds/restart.js**: 
- **config.json**: 
```json
{}
```
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.30
### ⬆️ What's Changed
- **Goat.js**: fixed `TypeError: Cannot read property 'match' of null`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.29
### ⬆️ What's Changed
- **Goat.js**: 
- **index.js**: 
- **bot/handler/handlerEvents.js**: languages update
- **bot/login/login.js**: languages update
- **languages/en.lang**: languages update
- **languages/vi.lang**: languages update
- **scripts/cmds/restart.js**: a new command: restart bot
- **config.json**: 
```json
{
  "autoRestart": {
    "time": null,
    "notes": "you can set time is interval with milisecond or cron time, example: 1000, 10000, 60000, 3600000, 86400000, 0 0 * * *,... docs: https://www.npmjs.com/package/node-cron. If you set time is 0 or false or null, the bot will not auto restart"
  }
}
```
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.28
### ⬆️ What's Changed
- **database/controller/threadsData.js**: bug fixes refreshInfo function: missing `userID` parameter when refreshing members information leads to huge data generation
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.27
### ⬆️ What's Changed
- **languages/cmds/en.js**: language update
- **scripts/cmds/help.js**: language update
- **scripts/cmds/notification.js**: more precise group filtering
- **scripts/cmds/setleave.js**: fixes the error when sending the link
- **scripts/cmds/setrankup.js**: fixes the error when sending the link
- **scripts/cmds/setwelcome.js**: fixes the error when sending the link
- **scripts/cmds/shortcut.js**: fixes the error when sending the link
- **scripts/cmds/thread.js**: can search and filter bot groups that are still participating in the group
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.26
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: code optimization & bug fixes & add feature autoRefreshThreadInfoFirstTime: when you set autoRefreshThreadInfoFirstTime to true on config, the bot will automatically refresh the thread information when get first message from the thread since starting the bot
- **config.json**: 
```json
{
  "database.autoRefreshThreadInfoFirstTime": false,
  "database.notes": "(1) type selects 'json' or 'sqlite' or 'mongodb'. If you choose mongodb, enter uri connect mongodb in the uriMongodb section, instructions to get uri connect mongodb at: https://youtu.be/z1f9urHW5xY. I recommend using 'mongodb' or 'sqlite', json is not recommended because it is not stable. (2) when you set autoSyncWhenStart to true, the bot will automatically synchronize the data in the database when starting the bot, this will make the bot start slower. (3) when you set autoRefreshThreadInfoFirstTime to true, the bot will automatically refresh the thread information when get first message from the thread since starting the bot"
}
```
- **bot/login/loadData.js**: code optimization & bug fixes
- **database/controller/threadsData.js**: code optimization & bug fixes refreshInfo function
- **index.js**: 
- **scripts/cmds/notification.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.25
### ⬆️ What's Changed
- **bot/login/login.js**: code optimization
- **bot/login/getFbstate1.js**: code optimization
- **scripts/cmds/jsontosqlite.js**: fixed error: `TypeError: Cannot read property 'globalData' of undefined` when convert global data
- **scripts/cmds/jsontomongodb.js**: fixed error: `TypeError: Cannot read property 'globalData' of undefined` when convert global data
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.24
### ⬆️ What's Changed
- **scripts/cmds/user.js**: code optimization
- **scripts/cmds/thread.js**: code optimization
- **scripts/cmds/moon.js**: the structure of the source web has changed, I fixed it
- **scripts/cmds/help.js**: continue with the next numbering for the next page
- **scripts/cmds/eval.js**: add function `output` & `out`: similar to message.reply() but will automatically convert input data types to strings
- **scripts/cmds/admin.js**: can reply to the message to select the target as the sender of that message
- **bot/handler/handlerEvents.js**: languages update
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.23
### ⬆️ What's Changed
- **scripts/cmds/adduser.js**: bugs fixes & language update
- **scripts/cmds/callad.js**: bugs fixes & language update
- **scripts/cmds/jsontomongodb.js**: bugs fixes & language update
- **scripts/cmds/jsontosqlite.js**: bugs fixes & language update
- **scripts/cmds/notification.js**: bugs fixes & language update
- **scripts/cmds/sendnoti.js**: bugs fixes & language update
- **utils.js**: bugs fixes `findUid` & language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.22
### ⬆️ What's Changed
- **database/controller/dashBoardData.js**: bug fixes & code optimization
- **database/controller/globalData.js**: bug fixes & code optimization
- **database/controller/threadsData.js**: bug fixes & code optimization
- **database/controller/usersData.js**: bug fixes & code optimization
- **scripts/cmds/busy.js**: bug fixes & code optimization
- **scripts/cmds/rules.js**: respond with the order number to see that rule
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.21
### ⬆️ What's Changed
- **configCommands.json**: youtube api key not used
- **database/controller/dashBoardData.js**: Bug fixes & code optimization
- **database/controller/globalData.js**: Bug fixes & code optimization
- **database/controller/threadsData.js**: Bug fixes & code optimization
- **database/controller/usersData.js**: Bug fixes & code optimization
- **scripts/cmds/busy.js**: Bug fixes & code optimization
- **scripts/cmds/help.js**: language update
- **scripts/cmds/setlang.js**: fixes not saving data when changing language of chat group
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.20
### ⬆️ What's Changed
- **scripts/cmds/filteruser.js**: fixes bugs bot listening members reaction message and kick members
- **config.json**: 
```json
{
  "language": "en",
  "notesLanguage": "change to your language with ISO 639-1 code, available languages: vi (Vietnamese), en (English)"
}
```
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.19
### ⬆️ What's Changed
- **scripts/cmds/customrankcard.js**: language update
- **scripts/cmds/hubble.js**: language update
- **scripts/cmds/thread.js**: more precise search feature
- **scripts/cmds/user.js**: more precise search feature
- **scripts/cmds/help.js**: fixes not showing description when viewing command info
- **bot/login/login.js**: can enable/disable auto-relogin when account.txt file changes in config.json/autoReloginWhenChangeAccount
- **config.json**: 
```json
{
  "autoReloginWhenChangeAccount": false
}
```
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.18
### ⬆️ What's Changed
- **scripts/cmds/ignoreonlyad.js**: add new command
- **scripts/cmds/ignoreonlyadbox.js**: add new command
- **scripts/cmds/jsontomongodb.js**: add new command
- **scripts/cmds/jsontosqlite.js**: add new command
- **bot/handler/handlerEvents.js**: language update
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **scripts/cmds/setlang.js**: language update
- **config.json**: 
```json
{
  "adminOnly.enable": "DEFAULT_adminOnly",
  "adminOnly.ignoreCommand": []
}
```
- **database/controller/threadsData.js**: fixes bugs
- **index.js**: language update
- **scripts/cmds/adminonly.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.17
### ⬆️ What's Changed
- **database/models/sqlite/userDashBoard.js**: edit filename
- **database/controller/index.js**: fixes bugs
- **database/connectDB/connectSqlite.js**: 
- **bot/login/loadData.js**: you can toggle the feature of refreshing user information, thread
- **config.json**: 
```json
{
  "database.type": "sqlite",
  "database.autoSyncWhenStart": true,
  "database.notes": "type selects 'json' or 'sqlite' or 'mongodb'. If you choose mongodb, enter uri connect mongodb in the uriMongodb section, instructions to get uri connect mongodb at: https://youtu.be/z1f9urHW5xY. I recommend using 'mongodb' or 'sqlite', json is not recommended because it is not stable."
}
```
- **logger/loading.js**: 
- **logger/log.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.16
### ⬆️ What's Changed
- **scripts/cmds/hubble.js**: update hubble data url
- **scripts/cmds/assets/font/BeVietnamPro-Bold.ttf**: add font
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.15
### ⬆️ What's Changed
- **scripts/cmds/rank.js**: remove rank card creation with api
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.14
### ⬆️ What's Changed
- **scripts/cmds/translate.js**: can translate any message by reaction "🌐" or custom by you to message
- **scripts/cmds/rules.js**: fixes bugs
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.13
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: language update
- **scripts/cmds/avatar.js**: language update
- **scripts/cmds/help.js**: language update
- **scripts/cmds/hubble.js**: new command: get image from hubble telescope
- **scripts/cmds/translate.js**: new command: translate text
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.12
### ⬆️ What's Changed
- **scripts/cmds/setrole.js**: language update
### 🗑️ Files Deleted
- **scripts/cmds/simsimi.js**: delete command
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.11
### ⬆️ What's Changed
- **scripts/cmds/setalias.js**: fixes bugs
- **bot/handler/handlerEvents.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.10
### ⬆️ What's Changed
- **scripts/cmds/rankup.js**: fixes `TypeError: Cannot read property of undefined (reading 'attachments')`
- **scripts/cmds/shortcut.js**: fixes cannot delete/remove shortcut
- **scripts/cmds/avatar.js**: language udpate
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.9
### ⬆️ What's Changed
- **scripts/cmds/shortcut.js**: fixes with attachment giving error
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.8
### ⬆️ What's Changed
- **scripts/cmds/admin.js**: language update
- **scripts/cmds/help.js**: language update
- **scripts/cmds/setrole.js**: language update
- **scripts/cmds/shortcut.js**: language update
- **languages/cmds/en.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.7
### ⬆️ What's Changed
- **bot/source/invalid_domain_for_site_key.jpg**: add image
- **bot/source/invalid_grant1.jpg**: add image
- **bot/source/invalid_grant2.jpg**: add image
- **bot/source/redirect_uri_mismatch.jpg**: add image
- **scripts/cmds/assets/guide/customrankcard/guide2.png**: add image
- **bot/login/checkLiveCookie.js**: 
- **bot/handler/handlerEvents.js**: language update
- **scripts/cmds/callad.js**: language update
- **scripts/cmds/help.js**: language update
- **scripts/cmds/rankup.js**: support custome message rankup
- **scripts/cmds/setalias.js**: fixes error `TypeError: Cannot read property 'has' of undefined`
- **scripts/cmds/setrankup.js**: a new command to set custom message rankup
- **scripts/cmds/antichangeinfobox.js**: language update
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
- **utils.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.6
### ⬆️ What's Changed
- **scripts/cmds/busy.js**: fixes bugs auto activated for all member
- **scripts/cmds/notification.js**: fixes error `TypeError: checkAndTranslate is not a function`
- **scripts/cmds/callad.js**: fixes error `TypeError: checkAndTranslate is not a function`
- **dashboard/routes/verifyfbid.js**: fixes error `TypeError: checkAndTranslate is not a function`
- **languages/vi.lang**: language update
- **languages/en.lang**: language update
- **scripts/events/leave.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.5
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: language update
- **scripts/cmds/emojimix.js**: language update
- **scripts/cmds/loadconfig.js**: language update
- **scripts/cmds/rules.js**: language update
- **scripts/cmds/setalias.js**: language update
- **scripts/cmds/daily.js**: new command get daily coins and exp
- **scripts/cmds/busy.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.4
### ⬆️ What's Changed
- **scripts/cmds/busy.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.3
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fixes can't use bot when inbox 1-1
- **scripts/events/logsbot.js**: fixes error `TypeError: checkAndTranslate is not a function`
- **scripts/cmds/customrankcard.js**: language update
- **scripts/cmds/help.js**: language update
- **scripts/cmds/thread.js**: language update
- **languages/cmds/en.js**: language update
- **database/controller/usersData.js**: fixes bugs
- **database/controller/threadsData.js**: fixes bugs
- **database/controller/globalData.js**: fixes bugs
- **database/controller/dashBoardData.js**: fixes bugs
- **languages/en.lang**: language update
- **languages/vi.lang**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.2
### ⬆️ What's Changed
- **languages/cmds/en.js**: language update
- **scripts/cmds/help.js**: language update
- **scripts/events/leave.js**: language update
- **scripts/events/welcome.js**: language update
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.1
### ⬆️ What's Changed
- **languages/en.lang**: 
- **languages/vi.lang**: 
- **scripts/cmds/help.js**: fixes error `TypeError: Cannot read property 'doNotHave' of undefined`
- **scripts/cmds/kick.js**: added languages
- **bot/handler/handlerEvents.js**: optimization function getLang
- **scripts/events/checkwarn.js**: added languages
- **scripts/events/leave.js**: added languages
- **scripts/events/logsbot.js**: added languages
- **scripts/events/welcome.js**: added languages
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.1.0
### ⬆️ What's Changed
- **config.json**: 
- **utils.js**: cancel automatic translation by api
- **dashboard/app.js**: fixes `Error: Login sessions require session support. Did you forget to use 'express-session' middleware`
- **database/controller/usersData.js**: add function `addMoney` and `subtractMoney`
- **bot/autoUptime.js**: fixes error `Cannot read property 'data' of undefined`
- **bot/handler/handlerEvents.js**: optimization
- **bot/login/loadScripts.js**: optimization
- **bot/login/login.js**: optimization
- **languages/en.lang**: add new text
- **languages/vi.lang**: add new text
- **languages/cmds/en.js**: you can customize the language according to this example
- **languages/events/en.js**: you can customize the language according to this example
- **scripts/cmds/cmd.js**: add custom language & optimization
- **scripts/cmds/adboxonly.js**: add custom language
- **scripts/cmds/adduser.js**: add custom language
- **scripts/cmds/admin.js**: add custom language
- **scripts/cmds/adminonly.js**: add custom language
- **scripts/cmds/all.js**: add custom language
- **scripts/cmds/anime.js**: add custom language
- **scripts/cmds/antichangeinfobox.js**: add custom language
- **scripts/cmds/appstore.js**: add custom language
- **scripts/cmds/autosetname.js**: add custom language
- **scripts/cmds/avatar.js**: add custom language
- **scripts/cmds/badwords.js**: add custom language
- **scripts/cmds/balance.js**: add custom language
- **scripts/cmds/batslap.js**: add custom language
- **scripts/cmds/busy.js**: add custom language
- **scripts/cmds/callad.js**: add custom language
- **scripts/cmds/count.js**: add custom language
- **scripts/cmds/customrankcard.js**: add custom language
- **scripts/cmds/dhbc.js**: add custom language
- **scripts/cmds/emojimix.js**: add custom language
- **scripts/cmds/eval.js**: add custom language
- **scripts/cmds/event.js**: add custom language
- **scripts/cmds/filteruser.js**: add custom language
- **scripts/cmds/getfbstate.js**: add custom language
- **scripts/cmds/grouptag.js**: add custom language
- **scripts/cmds/help.js**: add custom language
- **scripts/cmds/kick.js**: add custom language
- **scripts/cmds/loadconfig.js**: add custom language
- **scripts/cmds/moon.js**: add custom language
- **scripts/cmds/notification.js**: add custom language
- **scripts/cmds/prefix.js**: add custom language
- **scripts/cmds/rank.js**: add custom language
- **scripts/cmds/rankup.js**: add custom language
- **scripts/cmds/refresh.js**: add custom language
- **scripts/cmds/rules.js**: add custom language
- **scripts/cmds/sendnoti.js**: add custom language
- **scripts/cmds/setalias.js**: add custom language
- **scripts/cmds/setavt.js**: add custom language
- **scripts/cmds/setlang.js**: add custom language
- **scripts/cmds/setleave.js**: add custom language
- **scripts/cmds/setname.js**: add custom language
- **scripts/cmds/setrole.js**: add custom language
- **scripts/cmds/setwelcome.js**: add custom language
- **scripts/cmds/shortcut.js**: add custom language
- **scripts/cmds/simsimi.js**: add custom language
- **scripts/cmds/sorthelp.js**: add custom language
- **scripts/cmds/thread.js**: add custom language
- **scripts/cmds/tid.js**: add custom language
- **scripts/cmds/tik.js**: add custom language
- **scripts/cmds/trigger.js**: add custom language
- **scripts/cmds/uid.js**: add custom language
- **scripts/cmds/unsend.js**: add custom language
- **scripts/cmds/user.js**: add custom language
- **scripts/cmds/videofb.js**: add custom language
- **scripts/cmds/warn.js**: add custom language
- **scripts/cmds/weather.js**: add custom language
- **scripts/cmds/ytb.js**: add custom language
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.30
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: fixes `TypeError: Cannot read property 'length' of undefined`
- **scripts/cmds/customrankcard.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.29
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fixes `Can't find text: "handlerEvents.."`
- **package-lock.json**: update package `fb-chat-api` version 10.4.14
- **package.json**: update package `fb-chat-api` version 10.4.14
- **scripts/cmds/setavt.js**: fixes `TypeError: Cannot read property 'startsWith' of undefined`
- **scripts/cmds/ytb.js**: no need to use youtube api key v3 anymore
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.28
### ⬆️ What's Changed
- **scripts/cmds/notification.js**: fixes `Error: parseAndCheckLogin got status code: 404. Bailing out of trying to parse response.`
### 🗑️ Files Deleted
- **scripts/cmds/instagram.js**: api is no longer working
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.27
### ⬆️ What's Changed
- **bot/login/login.js**: fixes console freeze error
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.26
### ⬆️ What's Changed
- **scripts/cmds/setalias.js**: add option -g (applies to the whole system)
- **scripts/cmds/event.js**: add Argument and Parameter `globalModel`, `globalData`
- **scripts/cmds/cmd.js**: add Argument and Parameter `globalModel`, `globalData`
- **bot/login/loadScripts.js**: add Argument and Parameter `globalModel`, `globalData`
- **bot/handler/handlerEvents.js**: add Argument and Parameter `globalModel`, `globalData`
- **bot/login/login.js**: add Argument and Parameter `globalModel`, `globalData`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.25
### ⬆️ What's Changed
- **bot/handler/handlerAction.js**: add globalModel and globalData
- **utils.js**: add globalModel and globalData
- **scripts/cmds/eval.js**: add globalModel and globalData
- **index.js**: add globalModel and globalData
- **database/models/sqlite/global.js**: add globalModel and globalData
- **database/models/mongodb/global.js**: add globalModel and globalData
- **database/controller/index.js**: add globalModel and globalData
- **database/controller/globalData.js**: add globalModel and globalData
- **database/connectDB/connectSqlite.js**: add globalModel and globalData
- **database/connectDB/connectMongoDB.js**: add globalModel and globalData
- **dashboard/connectDB.js**: add globalModel and globalData
- **bot/login/loadData.js**: add globalModel and globalData
- **bot/login/login.js**: add globalModel and globalData
- **bot/handler/handlerEvents.js**: add globalModel and globalData
- **bot/login/checkLiveCookie.js**: Update checkLiveCookie.js
- **dashboard/views/register.eta**: 
- **database/controller/dashBoardData.js**: Update many error messages
- **database/controller/threadsData.js**: Update many error messages
- **database/controller/usersData.js**: Update many error messages
- **scripts/cmds/setname.js**: 
- **updater.js**: update updater
- **update.js**: update updater
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.24
### ⬆️ What's Changed
- **update.js**: update handle update
- **languages/en.lang**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.23
### ⬆️ What's Changed
- **dashboard/views/404.eta**: cancel minify and fixes bugs
- **dashboard/views/change-password.eta**: cancel minify and fixes bugs
- **dashboard/views/dashboard-custom-cmd.eta**: cancel minify and fixes bugs
- **dashboard/views/dashboard-leave.eta**: cancel minify and fixes bugs
- **dashboard/views/dashboard-rankup.eta**: cancel minify and fixes bugs
- **dashboard/views/dashboard-thread.eta**: cancel minify and fixes bugs
- **dashboard/views/dashboard-welcome.eta**: cancel minify and fixes bugs
- **dashboard/views/dashboard.eta**: cancel minify and fixes bugs
- **dashboard/views/donate.eta**: cancel minify and fixes bugs
- **dashboard/views/forgot-password-new-password.eta**: cancel minify and fixes bugs
- **dashboard/views/forgot-password-submit-code.eta**: cancel minify and fixes bugs
- **dashboard/views/forgot-password.eta**: cancel minify and fixes bugs
- **dashboard/views/home.eta**: cancel minify and fixes bugs
- **dashboard/views/login.eta**: cancel minify and fixes bugs
- **dashboard/views/profile.eta**: cancel minify and fixes bugs
- **dashboard/views/register-resend-code.eta**: cancel minify and fixes bugs
- **dashboard/views/register-submit-code.eta**: cancel minify and fixes bugs
- **dashboard/views/register.eta**: cancel minify and fixes bugs
- **dashboard/views/stats.eta**: cancel minify and fixes bugs
- **dashboard/views/verifyfbid-submit-code.eta**: cancel minify and fixes bugs
- **dashboard/views/verifyfbid.eta**: cancel minify and fixes bugs
- **bot/autoUptime.js**: add language adjustment function for terminal
- **bot/handler/handlerCheckData.js**: add language adjustment function for terminal
- **languages/vi.lang**: add language adjustment function for terminal
- **languages/en.lang**: add language adjustment function for terminal
- **index.js**: add language adjustment function for terminal
- **database/controller/index.js**: add language adjustment function for terminal
- **dashboard/routes/verifyfbid.js**: add language adjustment function for terminal
- **bot/login/socketIO.js**: add language adjustment function for terminal
- **bot/login/login.js**: add language adjustment function for terminal
- **bot/login/loadScripts.js**: add language adjustment function for terminal
- **bot/login/loadData.js**: add language adjustment function for terminal
- **scripts/cmds/grouptag.js**: add feature to view tag group information
- **database/models/mongodb/userDashBoard.js**: fixes mongodb not working
- **database/models/mongodb/user.js**: fixes mongodb not working
- **database/models/mongodb/thread.js**: fixes mongodb not working
- **database/controller/usersData.js**: fixes mongodb not working
- **database/controller/threadsData.js**: fixes mongodb not working
- **database/controller/dashBoardData.js**: fixes mongodb not working
- **dashboard/routes/api.js**: 
- **dashboard/app.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.22
### ⬆️ What's Changed
- **index.js**: confusion between variable "version" and "currentVersion" 🤧
- **scripts/cmds/setleave.js**: fixes can't customize newline text
- **scripts/cmds/setwelcome.js**: fixes can't customize newline text
- **scripts/cmds/shortcut.js**: fixes bug
- **scripts/cmds/simsimi.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.21
### ⬆️ What's Changed
- **scripts/cmds/refresh.js**: edit role 0 (everyone) to 1 (admin only)
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.20
### ⬆️ What's Changed
- **scripts/cmds/busy.js**: new command
- **scripts/cmds/filteruser.js**: new command
- **scripts/cmds/refresh.js**: new command
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.19
### ⬆️ What's Changed
- **scripts/cmds/tik.js**: fixes `Error: The first argument (url) must be a string`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.18
### ⬆️ What's Changed
- **utils.js**: fixes error `CREDENTIALS: Please provide a valid apiKey in file config.json`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.17
### ⬆️ What's Changed
- **database/connectDB/connectMongoDB.js**: fixes can't connect mongodb
- **database/controller/dashBoardData.js**: fixes can't connect mongodb
- **database/controller/index.js**: fixes can't connect mongodb
- **database/controller/threadsData.js**: fixes can't connect mongodb
- **database/controller/usersData.js**: fixes can't connect mongodb
- **index.js**: Update error reporting system
- **utils.js**: Update error reporting system
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.16
### ⬆️ What's Changed
- **index.js**: 
- **scripts/cmds/moon.js**: fixes error `TypeError: Cannot read property 'slice' of undefined`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.15
### ⬆️ What's Changed
- **bot/login/login.js**: fixes bot not working after some time
- **scripts/cmds/admin.js**: new command help you Add, remove, edit admin rights
- **scripts/cmds/cmd.js**: fixes error `TypeError: Cannot read properties of undefined (reading 'toLowerCase')`
- **scripts/cmds/event.js**: fixes error `TypeError: Cannot read properties of undefined (reading 'toLowerCase')``
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.14
### ⬆️ What's Changed
- **bot/login/login.js**: automatically remove duplicate event listeners
- **scripts/cmds/cmd.js**: fixes error: `TypeError: Cannot read property 'indexOf' of undefined`
- **index.js**: added notification feature when new update is available
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.13
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fixes adminOnly not working
- **bot/login/loadScripts.js**: 
- **scripts/cmds/cmd.js**: add function `install`: Download and install a script from a url, url is the path to the script (raw)
- **scripts/cmds/event.js**: add function `install`: Download and install a script from a url, url is the path to the script (raw)
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.12
### ⬆️ What's Changed
- **scripts/cmds/anime.js**: fixes error Dissallowed props: `attachent`
- **scripts/cmds/videofb.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.11
### ⬆️ What's Changed
- **utils.js**: 
- **scripts/cmds/anime.js**: new command random anime image
- **scripts/cmds/avatar.js**: new command create avatar anime
- **scripts/cmds/simsimi.js**: 
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.10
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: 
- **scripts/cmds/simsimi.js**: new command
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.9
### ⬆️ What's Changed
- **scripts/cmds/tik.js**: add slide download feature (images)
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.8
### ⬆️ What's Changed
- **utils.js**: update system translate
- **scripts/cmds/adduser.js**: update system translate
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.7
### ⬆️ What's Changed
- **scripts/cmds/videofb.js**: fixes error Cannot download video
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.6
### ⬆️ What's Changed
- **scripts/cmds/ytb.js**: fixes error `AxiosError: unable to verify the first certificate`
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.5
### ⬆️ What's Changed
- **bot/login/login.js**: fixes duplicate login
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.4
### ⬆️ What's Changed
- **bot/login/login.js**: fixes bugs
- **scripts/cmds/badwords.js**: fixes error `Cannot read properties of undefined (reading 'settings')`
- **scripts/cmds/loadconfig.js**: fixes error `Cannot read properties of undefined (reading 'dirConfig')`
- **scripts/cmds/tik.js**: fixes api
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.3
### ⬆️ What's Changed
- **bot/handler/handlerEvents.js**: fixes terminal freeze
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.2
### ⬆️ What's Changed
- **bot/login/loadData.js**: fixes terminal freeze
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>

---
## 📦 Version 1.0.1
### ⬆️ What's Changed
- **bot/login/login.js**: fixes terminal freeze
### Contributors
- <div style="display: flex; align-items: center;"><a href="https://github.com/ntkhang03">ntkhang03&nbsp;&nbsp;</a> <img src="https://github.com/ntkhang03.png" width="20" height="20" style="border-radius:50%; margin-top: px;" alt="ntkhang03"></div>
