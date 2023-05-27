module.exports = {
  name: 'fbdl',
  aliases: ['fb', 'facebook'],
  category: 'media',
  exp: 5,
  description: 'Downloads given Instagram video and sends it as Audio',
  async execute(client, arg, M) {
    const url = arg;
    if(!url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return M.reply("Please provide a fucking facebook video link")
    try {
        client.utils.snapsave(url)
    .then((result) => {
      if (result.status && result.data) {
        const videoData = result.data.find((item) => item.resolution === "720p (HD)");
        console.log(videoData.url)
      
        if (videoData) {
          const videoUrl = videoData.url;
          client.sendMessage(M.from , {video: {url: videoUrl , caption: `For Aku by aku`}} , {quoted: M})
        } else {
          M.reply("720p video not found");
        }
      } else {
        console.log("Error:", result.msg);
      }
    })
    } catch (error) {
      console.error('Error occurred while scraping video:', error);
    }
  },
};
