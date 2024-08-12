const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FABiBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACB7XzbV/L0yBIASeHjI15Ymz3cZkIYmaOIqyGPpPayuC6p8qVTsKI2cccUit00w2ZzCDVr6Pw2+I4H7cMXIWv2M1nWNjBIbkpsZG3L4j5ZNqcvrrcWKlUvAIjGefFfsYQEj0LN1FiAv5LmvNe+FnZXoaVJN1sDK2b89QvRSmaOknIT3PLiE+pyiNjYmGsWAjFJF/Dn7cUNAHtLrewg4ejVqPlEP+g3G+VwLZwYDVk0TazTeu3VK0OA8DB/0/QMXDmccJE3zf8zvCeccUjEpLrIHgfb4NSXfbbIewiba3bx3+HBml8sAJIXDaqA5i324dBjMYowIRJvGeHI5S5kvYsK0a2E8JsQqhHkv50fYAvsdt3e07lzdrK+MPW4zmxMzfmzeUjrDwbPeM1ryvVngUrc8RMP39KNrYlf1PG4pKUFnwFoYbTLkZ8zWWu8LzAhVOzkgm8i4nzav746SO0Hcu7lEEKk8xAhfOiwafi+Z+JIgGP/yjqn3s2kY9GEXnoF21vI0uotbbUjIhwbvSNo2TJu44w2FvSiPLPq+7lUHa/0icrJAXGSo+vA1o6pWk4J18KVjO1oemM0adK8am3tFAposZ4kq6hOZGFJopebuUhzSQCSEURsY5HpMmNb4dW5CWpAv6t9WMRtfUIphFRIg+MwvzHV306aCw0CH0HIKAcoQ2nE2d+E+0UnlYRRxBPd9NvT+5zOfAZL09SoKoYW/8153ADnvLCyaCHOQm5CYMt7vxfiI98bkhfg0W8myuafed/5HdsHR8KEsSXhsAhyhePpFboe3eKf8B6dBfnnOfoj2WH6JLW2nNtNlihVCgPPCfGRKe3nAOqBTNQVwaUKE4lPRMHX8y1mLd1pMA6boYphv+2MuIg/NKK8Bs2JH/KCJYanAAZdK8W9rRpB1wM9mEOBdRDCaFSyDS2XL0PIp+0S+aRsuSham4vVEAl9OlNt0NGOP5YaI2KzHkz2nYXSiW+IjFkSB5QoCbpuJUuJWftPD+MZ5l1DGki0M8SHNw8dLTv1Cnt0sHXpvpXpwG6X/xbQzHpawZQaGrSLgeSj1vxHU9pLKaxkfhdWrIkKgF8K944isYjPcp0HER0+YbIm+S+oNCojbQHivD8THoDl8rfQV2AjtWJ+IUnt4EskZb/v3UzuErWfW89uAH2zVcFg/Bz/u3vpFYciisM34UFXr4SiwuCq5t+v1OrzixLRwBLz8nTyCw7Wva1d0FV9fAI9e0ZSsa6wMnj26lZw1XF3bulMi9XBhQzn51Sjte6bJ3L0kuo5exgmH8pCPm4LIU2rMHb+TjBJ+pRHgTSww1Q5+IydYupBgpYybd7zitbPzN9fEYffGwleNa1dAzcDyT5NlSj2zKqanFcKpVLrngQvzIphhiPkEB3V9+L9c5GJICQq1yE3/pyp4J0/x34zQUAGA6pg/FIUdhrP7w6rHASCp/MbML";
const _U = "1DTJ3h1kzcyWk6JTQx442zNi4-ZyfLBWXCiDl6bKiJgghfbtWarzHY5HTnDaas9kfBgLBO6RAcP2e0bR8fToietdr1Q5TO39Nk12l11gGvWjTrzmGF_UcSBnoJK2PWejLuLTz-Qalh3GgO3M2iBkToEZC6ZaodDSLUeaqgCTIy_qJrLGC2agm4lh37Sh5ojs9MHhkuayh4-CuTcrolX5SXQ";

module.exports = {
  config: {
    name: "dalle",
    version: "1.0.2",
    author: "hedroxyy",
    role: 0,
    countDown: 5,
    shortDescription: { en: "dalle3 image generator" },
    longDescription: { en: "dalle3 is a image generator powdered by OpenAi" },
    category: "ai",
    guide: { en: "{prefix}dalle <search query>" }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");

    try {
      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("response received but imgurl are missing ", event.threadID, event.messageID);
        return;
      }

      const imgData = [];

      for (let i = 0; i < Math.min(4, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage("Can't Full Fill this request ", event.threadID, event.messageID);
    }
  }
};
