if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Telegraf = require('telegraf').Telegraf;
const axios = require('axios');

const DISCORD_API_BASE_URL = 'https://discord.com/api/v8';
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_TEST_WEBHOOK_ID = process.env.DISCORD_TEST_WEBHOOK_ID;
const DISCORD_TEST_WEBHOOK_TOKEN = process.env.DISCORD_TEST_WEBHOOK_TOKEN;

const TELEGRAM_API_URL = 'https://api.telegram.org';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;


const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((context) => {
    context.reply('DAO Discord x Telegram Bot has started!');
});

bot.help((context) => {
    context.reply('This bot does not perform any commands as of now.');
});

bot.on('photo', async (context) => {
    console.log(JSON.stringify(context, null, 4));

    photoCount = context.message.photo.length;
    thumbnailPhoto = context.message.photo[0];
    actualPhoto = context.message.photo[photoCount - 1];
    thumbnailPhotoRes = await axios.get(
        `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${thumbnailPhoto.file_id}`
    );
    actualPhotoRes = await axios.get(
        `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${actualPhoto.file_id}`
    );

    thumbnailPhotoUrl = `${TELEGRAM_API_URL}/file/bot${TELEGRAM_BOT_TOKEN}/${thumbnailPhotoRes.data.result.file_path}`;
    actualPhotoUrl = `${TELEGRAM_API_URL}/file/bot${TELEGRAM_BOT_TOKEN}/${actualPhotoRes.data.result.file_path}`;

    data = {
        content: `**@${context.from.username} sent an image to ${context.chat.title}:**`,
        embeds: [
            {
                type: 'image',
                url: actualPhotoUrl,
                title: `Image sent by @${context.from.username} to ${context.chat.title}`,
                description: context.message.caption,
                thumbnail: {
                    url: actualPhotoUrl
                }
            }
        ]
    }

    axios.post(
        `${DISCORD_API_BASE_URL}/webhooks/${DISCORD_TEST_WEBHOOK_ID}/${DISCORD_TEST_WEBHOOK_TOKEN}`,
        JSON.stringify(data),
        {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Disposition': 'filename'
            },
        })
})

bot.on('message', (context) => {
    console.log(JSON.stringify(context, null, 4));

    if (!context.message.text) {
        return;
    }
    url = `${DISCORD_API_BASE_URL}/webhooks/${DISCORD_TEST_WEBHOOK_ID}/${DISCORD_TEST_WEBHOOK_TOKEN}`;
    data = {
        content: `**@${context.from.username} sent a new message to ${context.chat.title}:**\n>>> ${context.message.text}`,
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

// bot.hears('hello', (context) => {
//     context.reply('Hello back to u!');
// })

bot.launch();

module.exports = {
    bot
}