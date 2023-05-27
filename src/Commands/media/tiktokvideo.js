module.exports = {
    name: 'tiktok',
    category: 'media',
    exp: 5,
    description: 'Downloads given instagram video and sends it as Audio',
    async execute(client, arg, M) {
  if (!arg)
        return client.sendMessage(
          M.from,
          { text: `⚠️ Please provide a Tiktok Video link !` },
          { quoted: M }
        );

        if(!arg.includes("tiktok")){
          return M.reply("⚠️ Please provide a valid Tiktok link!")
        }

        require('../../lib/tiktokscrapper').Tiktok(arg).then( data => {
            client.sendMessage(M.from, { video: { url: data.watermark },caption:`For Aku by aku`},{ quoted: M })
        })
        },
    }