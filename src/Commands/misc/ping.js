module.exports = {
    name: 'ping',
    aliases: ['speed'],
    category: 'misc',
    exp: 1,
    description: 'Bot response in second',
    async execute(client, arg, M) {
        await M.reply(`*_${client.utils.calculatePing(M.messageTimestamp, Date.now())} second(s)_*`)
    }
}
