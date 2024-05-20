import logger from '../config/logger.js';
import Random from '../services/random.js';

export const hearsHandlers = (bot) => {
  bot.hears(/retardado/i, (ctx) => {
    logger.info(`Hears retardado by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const from = ctx.update.message.from;
    ctx.reply(
      `[@${from.first_name}...](tg://user?id=${from.id.toString()}) R word.`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.hears([/alagado/i, /alagou/i, /alagar/i], (ctx) => {
    logger.info(`Hears alagado by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    ctx.reply(`Tem lugar alagado? Partiu Rua do Rio!!!`, {
      reply_to_message_id: ctx.message.message_id,
    });
  });

  bot.hears(/^Opa$/i, (ctx) => {
    logger.info(`Hears Opa by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const chance = Random.randomChance(80);
    if (chance) {
      ctx.reply(`Vez dela! 👍`);
    }
  });

  bot.hears(/Mello/i, (ctx) => {
    logger.info(`Hears Mello by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.replyWithPhoto({ source: './src/assets/softwarewex.jpg' });
    }
  });

  bot.hears(/lecandre/i, (ctx) => {
    logger.info(`Hears lecandre by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply(`Ledancre, o Brunasso?`);
    }
  });

  bot.hears(/Jo[aã]o/i, (ctx) => {
    logger.info(`Hears João by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply('João, o Foda Lerdinho?');
    }
  });

  bot.hears(/Giovanni/i, (ctx) => {
    logger.info(`Hears Giovanni by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply('Tá na média, 19cm.');
    }
  });

  bot.hears(/Expoente/i, (ctx) => {
    logger.info(`Hears Expoente by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply('O Expoente é Pica!');
    }
  });

  bot.hears([/casimiro/i, /caz[eé]/i], (ctx) => {
    logger.info(`Hears casimiro by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const chance = Random.randomChance(50);
    if (chance) {
      ctx.replyWithPhoto(
        {
          source: './src/assets/teemo.png',
        },
        {
          caption: 'Veja se o Cazé está online: https://www.twitch.tv/casimito',
        }
      );
    }
  });

  bot.hears(/amigos/i, (ctx) => {
    logger.info(`Hears amigos by ${ctx.update.message.from.username} - #${ctx.update.message.from.id}`);
    const sticker_id =
      'CAACAgEAAxkBAAIByWMOvKP6xx-6bce5GaBHYWgXA5q3AAI-BAAC8lEBR9qLjxoJkpJ9KQQ';
    const chance = Random.randomChance(60);
    if (chance) {
      ctx.replyWithSticker(sticker_id);
    }
  });
};
