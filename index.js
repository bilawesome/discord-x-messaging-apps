if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const DISCORD_API_BASE_URL = 'https://discord.com/api/v8';
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_TEST_WEBHOOK_ID = process.env.DISCORD_TEST_WEBHOOK_ID;
const DISCORD_TEST_WEBHOOK_TOKEN = process.env.DISCORD_TEST_WEBHOOK_TOKEN;

const prefix = '-';

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    console.log(JSON.stringify(message, null, 4));

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.channel.send('pong!');
    }
})

client.login(DISCORD_BOT_TOKEN)





// TELEGRAM

const Telegraf = require('telegraf').Telegraf;
const axios = require('axios');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((context) => {
    context.reply('bilawesome bot has started!');
})

bot.help((context) => {
    context.reply('This bot can perform the following commands:');
});

bot.on('sticker', (context) => {
    context.reply('Cool sticker!');
})

bot.hears('hello', (context) => {
    context.reply('Hello back to u!');
})

bot.command('say', (context) => {
    msg = context.message.text;
    msgArray = msg.split(' ');
    msgArray.shift();
    newMsg = msgArray.join(' ');
    context.reply(newMsg);
})

bot.command('fortune', (context) => {
    url = 'http://yerkee.com/api/fortune';
    axios.get(url)
        .then(
            (res) => {
                console.log(res.data.fortune);
                context.reply(res.data.fortune);
            }
        );
})

bot.command('discord_test', (context) => {
    console.log(context);
    url = `${DISCORD_API_BASE_URL}/webhooks/${DISCORD_TEST_WEBHOOK_ID}/${DISCORD_TEST_WEBHOOK_TOKEN}`;
    msg = context.message.text;
    msgArray = msg.split(' ');
    msgArray.shift();
    newMsg = msgArray.join(' ');
    data = {
        content: `Received message from Telegram: ${newMsg}`
    }

    axios.post(
        url,
        JSON.stringify(data),
        {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            },
        })
})

bot.launch();
