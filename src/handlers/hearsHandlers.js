import Random from '../random.js';

export const hearsHandlers = (bot) => {
  bot.hears(/retardado/i, (ctx) => {
    console.log('Command retardado used.');
    const from = ctx.update.message.from;
    ctx.reply(
      `[@${from.first_name}...](tg://user?id=${from.id.toString()}) R word.`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.hears([/alagado/i, /alagou/i, /alagar/i], (ctx) => {
    console.log('Command alagado used.');
    ctx.reply(`Tem lugar alagado? Partiu Rua do Rio!!!`, {
      reply_to_message_id: ctx.message.message_id,
    });
  });

  bot.hears(/^Opa$/i, (ctx) => {
    console.log('Command Opa used.');
    const chance = Random.randomChance(80);
    if (chance) {
      ctx.reply(`Vez dela! 👍`);
    }
  });

  bot.hears(/Mello/i, (ctx) => {
    console.log('Command Mello used.');
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.replyWithPhoto({ source: './src/softwarewex.jpg' });
    }
  });

  bot.hears(/lecandre/i, (ctx) => {
    console.log('Command /lecandre used.');
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply(`Ledancre, o Brunasso?`);
    }
  });

  bot.hears(/Jo[aã]o/i, (ctx) => {
    console.log('Command Joao used.');
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply('João, o Foda Lerdinho?');
    }
  });

  bot.hears(/Giovanni/i, (ctx) => {
    console.log('Command Giovanni used.');
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply('Tá na média, 19cm.');
    }
  });

  bot.hears(/Expoente/i, (ctx) => {
    console.log('Command Expoente used.');
    const chance = Random.randomChance(15);
    if (chance) {
      ctx.reply('O Expoente é Pica!');
    }
  });

  bot.hears([/casimiro/i, /caz[eé]/i], (ctx) => {
    console.log('Command Casimiro used.');
    const chance = Random.randomChance(50);
    if (chance) {
      ctx.replyWithPhoto(
        {
          source: './src/teemo.png',
        },
        {
          caption: 'Veja se o Cazé está online: https://www.twitch.tv/casimito',
        }
      );
    }
  });

  bot.hears(/amigos/i, (ctx) => {
    console.log('Command /amigos used.');
    const sticker_id =
      'CAACAgEAAxkBAAIByWMOvKP6xx-6bce5GaBHYWgXA5q3AAI-BAAC8lEBR9qLjxoJkpJ9KQQ';
    const chance = Random.randomChance(60);
    if (chance) {
      ctx.replyWithSticker(sticker_id);
    }
  });
};
