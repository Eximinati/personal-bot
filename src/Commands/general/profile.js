module.exports = {
    name: 'profile',
    aliases: ['p'],
    category: 'general',
    exp: 5,
    description: 'Gives you your stats',
    async execute(client, arg, M) {
        const groupMetadata = await client.groupMetadata(M.from)
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        const user = M.quoted?.participant ? M.quoted.participant : M.mentions[0] ? M.mentions[0] : M.sender

        let pfp
        try {
            pfp = await client.profilePictureUrl(user, 'image')
        } catch {
            pfp =
                'https://w0.peakpx.com/wallpaper/346/996/HD-wallpaper-love-live-sunshine-404-error-love-live-sunshine-anime-girl-anime.jpg'
        }

        let bio
        try {
            bio = (await client.fetchStatus(user)).status
        } catch {
            bio = ''
        }

       
        const username = (await client.contact.getContact(user, client)).username
        let text = ''
        text += `🏮 *Username:* ${username}#${user.substring(3, 7)}\n\n`
        text += `🎫 *Bio:* ${bio}\n\n`
        text += `💈 *Number:* wa.me/${user.split('@')[0]}\n\n`
        text += `👑 *Admin:* ${groupAdmins.includes(user) ? 'T' : 'F'}\n\n`

        //user.substring(3, 7)
        client.sendMessage(
            M.from,
            {
                image: {
                    url: pfp
                },
                caption: text
            },
            {
                quoted: M
            }
        )
    }
}
