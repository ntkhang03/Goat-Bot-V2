const malScraper = require("mal-scraper");
module.exports = {
  'config': {
    'name': "aninews",
    'aliases': ['animenews'],
    'version': '1.0',
    'author': "kshitiz",
    'countDown': 0x5,
    'role': 0x0,
    'shortDescription': {
      'en': "get latest news of anime from MyAnimeList"
    },
    'longDescription': {
      'en': "get latest news of anime from MyAnimeList"
    },
    'category': "anime",
    'guide': {
      'en': "{p}malnews"
    }
  },
  'onStart': async function ({
    api: _0x12a312,
    event: _0x2e06fd
  }) {
    malScraper.getNewsNoDetails(0x5).then(_0x55b618 => _0x12a312.sendMessage("TOP 5 LATEST MAL NEWS\n\n\u300E 1 \u300F" + _0x55b618[0x0].title + "\n\n\u300E 2 \u300F" + _0x55b618[0x1].title + "\n\n\u300E 3 \u300F" + _0x55b618[0x2].title + "\n\n\u300E 4 \u300F" + _0x55b618[0x3].title + "\n\n\u300E 5 \u300F" + _0x55b618[0x4].title, _0x2e06fd.threadID, _0x2e06fd.messageID))['catch'](_0x25ac9f => {
      console.error(_0x25ac9f);
      _0x12a312.sendMessage("Sorry, something went wrong while fetching the news.", _0x2e06fd.threadID);
    });
  }
};
