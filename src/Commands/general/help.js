module.exports = {
    name: 'help',
    aliases: ['h', 'menu', 'list'],
    category: 'general',
    exp: 10,
    description: 'Displays the command list or specific command info',
    async execute(client, arg, M) {
        if (!arg) {
            const categories = client.cmd.reduce((obj, cmd) => {
                const category = cmd.category || 'Uncategorized'
                obj[category] = obj[category] || []
                obj[category].push(cmd.name)
                return obj
            }, {})
            const emojis = ['👨🏻‍💻', '💰', '🎃', '⚙️', '📽️', '🌀', '🎵', '🛹', '🛠️', '🎊']
            const commandList = Object.keys(categories)
            let commands = ''
            for (const category of commandList) {
                commands += `*${client.utils.capitalize(
                  category,
                  true
                  )}* ${emojis[commandList.indexOf(category)]} :-  \n\`\`\`${categories[category].map((cmd) => 
                    `${cmd}`).join(', ')}\`\`\`\n\n`
                
                }

                let message = `*${client.utils.greetings()}* ${pushName}.Watashiwa ${client.utils.capitalize(client.name)} tomōshimasu\n\n🧧 Prefix : [ ${client.prefix} ]\n\n→ Type *${client.prefix}help* <Command-Name> to see command description and usage.📝 Here's the Commands listed below:\n\n${commands}`
                const buffer = await client.utils.getBuffer('https://w0.peakpx.com/wallpaper/813/845/HD-wallpaper-kurumi-yandere.jpg')
            await client.sendMessage(
                M.from,
                {
                    video: {
                        url: 'https://i.imgur.com/c55P8Kq.mp4'
                    },
                    gifPlayback: true,
                    caption: message,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Shiina Bot',
                            body: 'Shiina by 💫ᴄᴀꜱᴛʟᴇᴠɴɪᴀ 先輩🍁',
                            sourceUrl: 'https://github.com/Eximinati',
                            thumbnail: buffer,
                            mediaType: 1
                        }
                    }
                },
                {
                    quoted: M
                }

            )
            return
        }
        const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg))
        if (!command) return M.reply('Command not found')
        const message = `*CMD INFO*\n\n*🟥 Name:* ${command.name}\n*🟩 Aliases:* ${command.aliases.join(
            ', '
        )}\n*🟨 Desc:* ${command.description}`
        M.reply(message)     
    }
}
