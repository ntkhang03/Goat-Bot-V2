const axios = require('axios');

axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/updater.js")
	.then(res => eval(res.data));