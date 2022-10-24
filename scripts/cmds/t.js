const fs = require('fs-extra');
console.log(fs.readdirSync('./').map(file => '"' + 'scripts/cmds/' + file+ '": "add custom language"').join(',\n'));
