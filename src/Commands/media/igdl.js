const axios = require("axios")
module.exports = {
    name: 'igdl',
    category: 'media',
    exp: 5,
    description: 'Downloads given instagram video and sends it as Audio',
    async execute(client, arg, M) {
      if (!arg)
        return client.sendMessage(M.from, { text: `⚠️ Please provide a Instagram Video link !` }, { quoted: M });
      if (!arg.includes("instagram.com"))
        return client.sendMessage(M.from, { text: `⚠️ Please provide a valid Instagram Video link !` }, { quoted: M });
  
      const queryURL = arg.split(" ");
      M.reply("*Mattekudasai, aku sama...*");
      const res = await axios.get("https://fantox001-scrappy-api.vercel.app/instadl?url=" + queryURL);
      const scrappedURL = res.data.videoUrl;
  
      return client.sendMessage(M.from, { video: { url: scrappedURL }, caption: `For Aku by aku` }, { quoted: M });
    }
  };
  