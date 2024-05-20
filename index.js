import dotenv from 'dotenv';
import { default as Telegraf } from 'telegraf';
import { initializeDatabases } from './src/config/database.js';
import { registerHandlers } from './src/handlers/handlers.js';

dotenv.config();

const bot = new Telegraf(process.env.TOKEN, { username: 'GaGCorpBot' });

(async () => {
    const databases = await initializeDatabases();

    registerHandlers(bot, databases);

    bot.launch();
})();
