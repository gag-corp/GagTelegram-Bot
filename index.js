import dotenv from 'dotenv';
import { default as Telegraf } from 'telegraf';
import { initializeDatabases } from './src/config/database.js';
import logger from './src/config/logger.js';
import { registerHandlers } from './src/handlers/handlers.js';

dotenv.config();

const bot = new Telegraf(process.env.TOKEN, { username: 'GaGCorpBot' });

(async () => {
    try {
        const databases = await initializeDatabases();
        registerHandlers(bot, databases);

        bot.launch();
        logger.info('Bot started successfully');
    } catch (error) {
        logger.error(`Error starting bot: ${error.message}`);
    }
})();
