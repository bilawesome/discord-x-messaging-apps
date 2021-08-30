if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const axios = require('axios');

const DISCORD_API_BASE_URL = 'https://discord.com/api/v8';
const TELEGRAM_CHAT_IDS_WHITELIST = process.env.TELEGRAM_CHAT_IDS_WHITELIST;

const TELEGRAM_API_URL = 'https://api.telegram.org';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_TO_DISCORD_THREAD_MAPPING = {};
JSON.parse(process.env.TELEGRAM_CHATS_MAPPING).map(mapping => {
    TELEGRAM_CHAT_TO_DISCORD_THREAD_MAPPING[mapping.telegramChatId] = mapping.discordThreadId
});

class IntegrationHandler {
    constructor(
        discordBotToken,
        discordWebhookId,
        discordWebhookToken,
    ) {
        this.discordBotToken = discordBotToken;
        this.discordWebhookId = discordWebhookId;
        this.discordWebhookToken = discordWebhookToken;
    }

    async onPhoto(context) {
        console.log(JSON.stringify(context, null, 4));

        if (!context.message.photo || !TELEGRAM_CHAT_IDS_WHITELIST.includes(context.chat.id)) {
            return;
        }

        const photoCount = context.message.photo.length;
        const thumbnailPhoto = context.message.photo[0];
        const actualPhoto = context.message.photo[photoCount - 1];
        const thumbnailPhotoRes = await axios.get(
            `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${thumbnailPhoto.file_id}`
        );
        const actualPhotoRes = await axios.get(
            `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${actualPhoto.file_id}`
        );
    
        const thumbnailPhotoUrl = `${TELEGRAM_API_URL}/file/bot${TELEGRAM_BOT_TOKEN}/${thumbnailPhotoRes.data.result.file_path}`;
        const actualPhotoUrl = `${TELEGRAM_API_URL}/file/bot${TELEGRAM_BOT_TOKEN}/${actualPhotoRes.data.result.file_path}`;
    
        const data = {
            content: `**@${context.from.username} sent an image to ${context.chat.title}**`,
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
        
        const discordThreadId = TELEGRAM_CHAT_TO_DISCORD_THREAD_MAPPING[context.message.chat.id]
        axios.post(
            `${DISCORD_API_BASE_URL}/webhooks/${this.discordWebhookId}/${this.discordWebhookToken}?thread_id=${discordThreadId}`,
            JSON.stringify(data),
            {
                headers: {
                    'Authorization': `Bot ${this.discordBotToken}`,
                    'Content-Type': 'application/json',
                    'Content-Disposition': 'filename'
                },
            }
        )
    }

    onMessage(context) {
        console.log(JSON.stringify(context, null, 4));

        if (!context.message.text || !TELEGRAM_CHAT_IDS_WHITELIST.includes(context.chat.id)) {
            return;
        }
        const discordThreadId = TELEGRAM_CHAT_TO_DISCORD_THREAD_MAPPING[context.message.chat.id]
        const url = `${DISCORD_API_BASE_URL}/webhooks/${this.discordWebhookId}/${this.discordWebhookToken}?thread_id=${discordThreadId}`;
        const data = {
            content: `**${(context.from.username || context.from.first_name)} sent a new message to ${context.chat.title}**\n>>> ${context.message.text}`,
        }

        axios.post(
            url,
            JSON.stringify(data),
            {
                headers: {
                    'Authorization': `Bot ${this.discordBotToken}`,
                    'Content-Type': 'application/json'
                },
            }
        )
    }
}

module.exports = {
    IntegrationHandler
}