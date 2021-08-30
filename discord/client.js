// Discord Bot
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const axios = require('axios');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DISCORD_THREAD_TO_TELEGRAM_CHAT_MAPPING = {};
JSON.parse(process.env.TELEGRAM_CHATS_MAPPING).map(mapping => {
    DISCORD_THREAD_TO_TELEGRAM_CHAT_MAPPING[mapping.discordThreadId] = mapping.telegramChatId
});
const TELEGRAM_DEFAULT_DISCORD_THREAD_ID = process.env.TELEGRAM_DEFAULT_DISCORD_THREAD_ID;

const prefix = '/';

client.once('ready', () => {
    console.log('Discord API Client is ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    console.log(JSON.stringify(message, null, 4));

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const messageText = args.join(' ');

    if (command === 'send-message') {
        console.log('DISCORD_THREAD_TO_TELEGRAM_CHAT_MAPPING', DISCORD_THREAD_TO_TELEGRAM_CHAT_MAPPING)
        if (!messageText) {
            return;
        }
         // FIXME: fix mapping Telegram chat ID based on discord thread ID
        const threadId = message.threadId ? messsage.threadId : TELEGRAM_DEFAULT_DISCORD_THREAD_ID;
        const chatId = DISCORD_THREAD_TO_TELEGRAM_CHAT_MAPPING[threadId];
        axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${messageText}`
        )
    }
})

module.exports = {
    client
}