## **STEP INSTALL GOAT BOT V2**
> This is a guide to install Goat Bot V2 on mobile devices (Android, iOS) and PC (Windows, MacOS, Linux) with replit.com

* Watch the detailed video tutorial to install Goat Bot V2 on mobile devices (Android, iOS) 
<div align="center">
	<a href="https://www.youtube.com/watch?v=grVeZ76HlgA"><img src="https://img.youtube.com/vi/grVeZ76HlgA/maxresdefault.jpg" width="400"></a>
</div>

* If you want to install Goat Bot V2 on vps/computer, please follow the guide below:
<div align="center">
	<a href="https://www.youtube.com/watch?v=uCbSYNQNEwY"><img src="https://img.youtube.com/vi/uCbSYNQNEwY/maxresdefault.jpg" width="400"></a>
</div>

---
<h1 align="center"><b>STEP BY STEP GUIDE</b></h1>

* Download kiwi browser from play store. Open kiwi browser and go to https://replit.com
```
https://replit.com
```
* Create a new team education, then create a new project with `bash` language, then open console and type:
```bash
git clone https://github.com/ntkhang03/Goat-Bot-V2 && cp -r Goat-Bot-V2/. . && rm -rf Goat-Bot-V2
```
* Then type:
```bash
npm install
```
* Download extension `Cookie Editor` from chrom web store, then go to https://facebook.com, open that extension and click `Export` -> `Export as JSON`
* Then back to replit, open file `account.txt` and paste your cookie there
---
* Go to https://console.cloud.google.com/ to create a new project (don't forget to **`public`** your project) and add Authorized redirect URIs: `https://developers.google.com/oauthplayground` (without backslash at the end), then go to https://developers.google.com/oauthplayground to create a new OAuth 2.0 Client ID with permission: `https://www.googleapis.com/auth/drive` and `https://mail.google.com` then copy your `Refresh token` `Client ID` and `Client Secret` to `config.json` in part `credentials` -> `google`
```
https://console.cloud.google.com/
```
```
https://developers.google.com/oauthplayground
```
* Go to https://www.google.com/recaptcha/admin/create to create a new reCAPTCHA v2 with `I'm not a robot checkbox`
* Add domain **`repl.co`** (not repl.com) to your reCAPTCHA v2 
* Accept the reCAPTCHA v2 terms of service 
* Then copy your `Site key` and `Secret key` to `config.json`
```
https://www.google.com/recaptcha/admin/create
```
* Go to https://betterstack.com/better-uptime or https://uptimerobot.com/ to create a new monitor for your project
```
https://betterstack.com/better-uptime
```

