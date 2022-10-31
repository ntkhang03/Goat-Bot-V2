<h1 align="center"><img src="./dashboard/images/logo-non-bg.png" width="22px"> Goat Bot - Bot Chat Messenger</h1>

<p align="center">
	<a href="https://nodejs.org/en/download/">
		<img src="https://img.shields.io/badge/Nodejs%20Support-16.x-brightgreen.svg?style=flat-square" alt="Nodejs Support v16.x">
	</a>
  <img alt="size" src="https://img.shields.io/github/repo-size/ntkhang03/Goat-Bot-V2.svg?style=flat-square&label=size">
  <img alt="code-version" src="https://img.shields.io/badge/dynamic/json?color=red&label=code%20version&prefix=v&query=%24.version&url=https://github.com/ntkhang03/Goat-Bot-V2/raw/main/package.json&style=flat-square">
  <img alt="visitors" src="https://visitor-badge.laobi.icu/badge?style=flat-square&page_id=ntkhang3.Goat-Bot-V2">
  <img alt="size" src="https://img.shields.io/badge/license-MIT-green?style=flat-square">
</p>

* [`Prerequisites`](#-prerequisites)
* [`Tutorial`](#-tutorial)
* [`Support`](#-support)
* [`Support Languages`](#-support-languages)
* [`Common Problems`](#-common-problems)
* [`Screenshots`](#-screenshots)
* [`Copyright (C)`](#-copyright-c)
* [`License`](#-license)

## 🚧 Prerequisites
- [Node.js 16.x](https://nodejs.org/en/download/)

## 📝 Tutorial
#### A Tutorial has been uploaded on YouTube, Watch it by clicking on the image down below
- Replit.com: https://www.youtube.com/watch?v=nTIT8OQeRnY
- VPS/Windows:

## 📙 Support
#### If you have major coding issues with this bot, please join and ask for help.
- https://www.facebook.com/groups/goatbot
- https://www.facebook.com/groups/goatbot/permalink/493150412403231

## 📚 Support Languages

- [x] `en: English`
- [x] `vi: Vietnamese`

- Change language in `config.json` file
- You can customize the language in the folder `languages/`, `languages/cmds/` and `languages/events/`

## 📌 Common Problems
<details>
	<summary>
		📌 Error 400: redirect_uri_mismatch
		<p><img src="./bot/source/redirect_uri_mismatch.jpg" width="150px"></p> 
	</summary>
	<p>1. Enable Google Drive API: <a href="https://youtu.be/nTIT8OQeRnY?t=347">Tutorial</a></p>
	<p>2. Add uri <a href="https://developers.google.com/oauthplayground">https://developers.google.com/oauthplayground</a> (not <a href="https://developers.google.com/oauthplayground/">https://developers.google.com/oauthplayground/</a>) to <b>Authorized redirect URIs</b> in <b>OAuth consent screen</b> <a href="https://youtu.be/nTIT8OQeRnY?t=491">Tutorial</a></p>  
	<p>3. Choose <b>https://www.googleapis.com/auth/drive</b> and <b>https://mail.google.com/</b> in <b>OAuth 2.0 Playground</b>: <a href="https://youtu.be/nTIT8OQeRnY?t=615">Tutorial</a></p>
</details>

<details>
	<summary>
		📌 Error for site owners: Invalid domain for site key
		<p><img src="./bot/source/invalid_domain_for_site_key.jpg" width="150px"></p>
	</summary>
		<p>1. Go to <a href="https://www.google.com/recaptcha/admin">https://www.google.com/recaptcha/admin</a></p>
		<p>2. Add domain <b>repl.co</b> (not <b>repl.com</b>) to <b>Domains</b> in <b>reCAPTCHA v2</b> <a href="https://youtu.be/nTIT8OQeRnY?t=698">Tutorial</a></p>
</details>

<details>
	<summary>
		📌 GaxiosError: invalid_grant
		<p><img src="./bot/source/invalid_grant1.jpg" width="150px"></p>
		<p><img src="./bot/source/invalid_grant2.jpg" width="150px"></p>
	</summary>
		<p>- if you don't publish the project in google console, the refresh token will expire after 1 week and you need to get it back. <a href="https://youtu.be/nTIT8OQeRnY?t=445">Tuatorial</a></p>
</details>


## 📸 Screenshots
### Bot
#### Rank system
- Rank card:
<p><img src="./bot/source/rank.png" width="399px"></p>

- Rankup notification:
<p><img src="./bot/source/rankup.png" width="399px"></p>

- Custom rank card:
<p><img src="./bot/source/customrankcard.png" width="399px"></p>

#### Weather:
<p><img src="./bot/source/weather.png" width="399px"></p>

#### Auto send notification when have user join or leave box chat (you can custom message):
<p><img src="./bot/source/wcgb.png" width="399px"></p>

### Dashboard
- #### Home:
<p><img src="./bot/source/dbHome.png" width="399px"></p>

- #### Stats:
<p><img src="./bot/source/dbStats.png" width="399px"></p>

- #### Login/Register:
<p><img src="./bot/source/dbLogin.png" width="399px"></p>
<p><img src="./bot/source/dbRegister.png" width="399px"></p>

- #### Dashboard Thread:
<p><img src="./bot/source/dbThread.png" width="399px"></p>

- #### Custom on/off:
<p><img src="./bot/source/dbCustom.png" width="399px"></p>

- #### Custom welcome message (similar with leave, rankup (coming soon), custom command (coming soon))
<p><img src="./bot/source/dbCustomWelcome.png" width="399px"></p>

## ✨ Copyright (C)
### [NTKhang (NTKhang03)](https://github.com/ntkhang03)

## 📜 License
### If you violate any rules, you will be banned from using my project
- Don't sell my source code
- Don't remove/edit my credits
