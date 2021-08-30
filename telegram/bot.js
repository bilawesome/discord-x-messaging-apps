if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { IntegrationHandler } = require('../discord/integration-handler');
const Telegraf = require('telegraf').Telegraf;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_TEST_WEBHOOK_ID = process.env.DISCORD_TEST_WEBHOOK_ID;
const DISCORD_TEST_WEBHOOK_TOKEN = process.env.DISCORD_TEST_WEBHOOK_TOKEN;

const integrationHandler = new IntegrationHandler(
    DISCORD_BOT_TOKEN,
    DISCORD_TEST_WEBHOOK_ID,
    DISCORD_TEST_WEBHOOK_TOKEN
)

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
bot.on('photo', async (context) => {
    integrationHandler.onPhoto(context);
})
bot.on('message', (context) => {
    integrationHandler.onMessage(context);
})

module.exports = {
    bot
}