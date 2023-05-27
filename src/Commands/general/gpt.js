const { chat } = require("../../lib/chatGpt")
module.exports = {
    name: 'gpt',
    category: 'general',
    exp: 5,
    description: 'Deletes the quoted message',
    async execute(client, arg, M) {
        if (!process.env.openAi) return M.reply('You have not provided an OpenAI API key in the config file')
        
        let user = "923087880256@s.whatsapp.net"
        if(arg === 'who made you' || arg === 'who is your creator'
        || arg === 'who is your owner' || arg === 'who wrote your code'
        || arg === 'who write your code' || arg === 'name of your create'
        || arg === 'number of your creator'|| arg === 'no. of your creator'
        || arg === 'no of your creator' || arg === 'creator' || arg === 'owner'
        || arg === 'creator name' || arg === 'owner name'
        ){
            return await client.sendMessage(M.from , {text: `@${user.split("@")[0]} is my owner` , mentions: [user]} , {quoted: M})
        }
        
        let context = arg
        console.log(context)
        

        // const input = args.join(' ')
        if (context === null) return M.reply('Please provide some text to prompt the AI')
        try {

            const response = await chat(context)

            let res = response.response;

            let text = `📝 Question: ${context}\n\n✏️ Answer: ${res.trim().replace(/\n\n/, '\n')}`;

            // let text = `Q. ${context}\n\n${'A.'+res}`
            return (await M.reply(text))
            // await this.client.sendMessage(m.from , {text: text} ,{quoted: m})
        
        } catch (err) {
            M.reply(`Error kun: ${err}`)
        }
    }
}