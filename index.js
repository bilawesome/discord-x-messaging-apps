if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { client: discordClient } = require('./discord/client');
const { bot: telegramBot } = require('./telegram/bot');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;


// Telegram Bot
telegramBot.launch();
console.log('Telegram bot is ready!')

// Discord API Client
discordClient.login(DISCORD_BOT_TOKEN)
