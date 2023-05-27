const YT = require('../../lib/YT')
// const yts = require('yt-search')
const yts = require("youtube-yts");

module.exports = {
    name: 'ytaudio',
    aliases: ['yta', 'play'],
    category: 'media',
    exp: 5,
    description: 'Downloads given YT Video and sends it as Audio',
    async execute(client, arg, M) {
        const link = async (term) => {
            const { videos } = await yts(term.trim())
            if (!videos || !videos.length) return null
            return videos[0].url
        }
        if (!arg) return M.reply('Please use this command with a valid youtube.com link')
        const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/
        const term = validPathDomains.test(arg) ? arg.trim() : await link(arg)
        if (!term) return M.reply('Please use this command with a valid youtube contant link')
        if (!YT.validateURL(term.trim())) return M.reply('Please use this command with a valid youtube.com link')
        const { videoDetails } = await YT.getInfo(term)
        M.reply('*Mattekudasai, aku sama...*')
        let text = `*Title:* ${videoDetails.title} | *Type:* Audio | *From:* ${videoDetails.ownerChannelName}`
        client.sendMessage(
            M.from,
            {
                image: {
                    url: `https://i.ytimg.com/vi/${videoDetails.videoId}/maxresdefault.jpg`
                },
                caption: text
            },
            {
                quoted: M
            }
        )
        if (Number(videoDetails.lengthSeconds) > 1800) return M.reply('Cannot download audio longer than 30 minutes')
        const audio = YT.getBuffer(term, 'audio')
            .then(async (res) => {
                await client.sendMessage(
                    M.from,
                    {
                        audio: res,
                        mimetype: 'audio/mpeg',
                        fileName: videoDetails.title + '.mp3'
                    },
                    {
                        quoted: M
                    }
                )
            })
            .catch((err) => {
                return M.reply(err.toString())
                client.log(err, 'red')
            })
    }
}
//M.quoted.mtype === 'imageMessage',
