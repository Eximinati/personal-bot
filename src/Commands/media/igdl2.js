module.exports = {
    name: 'igdl2',
    category: 'media',
    exp: 5,
    description: 'Downloads given instagram video and sends it as Audio',
    async execute(client, arg, M) {
      if (!arg) return M.reply(`⚠️ Please provide a Instagram Video link !`);

      const videoUrl = arg;

      if (videoUrl.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) {
          client.utils.snapsave(videoUrl)
          .then((result) => {
              if (result && result.status) {
                  const videoUrl = result.data[0].url;
                  M.reply("*Mattekudasai, aku sama...*");
                  console.log(videoUrl);
                  return client.sendMessage(M.from, { video: { url: videoUrl } , caption: `For Aku by aku` }, { quoted: M });
              }
          });
      }
    }
  }