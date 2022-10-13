const axios = require('axios');
const fs = require('fs-extra');
const log = require('./logger/log.js');
const chalk = require('chalk');

(async () => {
	const { data: versions } = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/versions.json');
	const currentVersion = require('./package.json').version;
	const versionsNeedToUpdate = versions.slice(versions.findIndex(v => v.version === currentVersion) + 1);
	if (versionsNeedToUpdate.length === 0)
		return log.info("SUCCESS", "Bạn đang sử dụng phiên bản mới nhất");

	fs.writeFileSync(`${__dirname}/versions.json`, JSON.stringify(versions, null, 2));
	log.info("UPDATE", `Có ${chalk.yellow(versionsNeedToUpdate.length)} phiên bản cần cập nhật mới, bất đầu tiến hành cập nhật...`);

	for (const version of versionsNeedToUpdate) {
		log.info("UPDATE", `Update version ${version.version}`);
		const { files, deleteFiles } = version;

		for (const filePath in files) {
			const description = files[filePath];
			const fullPath = `${__dirname}/${filePath}`;
			const { data: getFile } = await axios.get(`https://github.com/ntkhang03/Goat-Bot-V2/raw/main/${filePath}`, {
				responseType: 'arraybuffer'
			});
			if (filePath === "config.json") {
				fs.copyFileSync(`${__dirname}/config.json`, `${__dirname}/config.backup.json`);
				fs.writeFileSync(fullPath, getFile);
				console.log(chalk.bold.blue('[↑]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
			else if (fs.existsSync(fullPath)) {
				fs.writeFileSync(fullPath, Buffer.from(getFile));
				console.log(chalk.bold.blue('[↑]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
			else {
				const cutFullPath = filePath.split('/');
				cutFullPath.pop();
				for (let i = 0; i < cutFullPath.length; i++) {
					const path = `${__dirname}/${cutFullPath.slice(0, i + 1).join('/')}`;
					if (!fs.existsSync(path))
						fs.mkdirSync(path);
				}
				fs.writeFileSync(fullPath, Buffer.from(getFile));
				console.log(chalk.bold.green('[+]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
		}

		for (const filePath in deleteFiles) {
			const description = deleteFiles[filePath];
			const fullPath = `${__dirname}/${filePath}`;
			if (fs.existsSync(fullPath)) {
				fs.unlinkSync(fullPath);
				console.log(chalk.bold.red('[-]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
		}
	}

	const { data: packageJson } = await axios.get("https://github.com/ntkhang03/Goat-Bot-V2/raw/main/package.json");
	fs.writeFileSync(__dirname + "/package.json", JSON.stringify(packageJson, null, 2));
	log.info("UPDATE", "Cập nhật thành công ✓");

})();