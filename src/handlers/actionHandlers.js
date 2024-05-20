import logger from '../config/logger.js';

export const actionHandlers = (bot, databases) => {
  const { r6Fila, naoMarca, flexFila } = databases;

  bot.action('simR6', (ctx) => {
    logger.info(`Action simR6 used by ${ctx.from.username} - #${ctx.from.id}`);
    let userExists = false;
    r6Fila.data.forEach((user) => {
      if (user.id === ctx.from.id) {
        userExists = true;
      }
    });
    if (!userExists) {
      r6Fila.data.push(ctx.from);
      r6Fila.write();
      ctx.deleteMessage();
      let fila = ``;
      r6Fila.data.forEach((user) => {
        fila += `${user.first_name}, `;
      });
      let msg = `${fila}estão na fila.\n🚨 ${
        5 - r6Fila.data.length
      } vagas restantes! Alguém mais vem? `;
      databases.usersdb.data.r6Players.forEach((player) => {
        if (player.id === ctx.from.id) {
          return;
        }
        const foundInr6Fila = r6Fila.data.find((user) => {
          return user.id === player.id;
        });
        if (foundInr6Fila) {
          return;
        }
        const foundInnaoMarca = naoMarca.data.find((user) => {
          return user.id === player.id;
        });
        if (foundInnaoMarca) {
          return;
        }
        const mention = player.username || player.first_name;
        msg += `[@${mention}](tg://user?id=${player.id.toString()}) `;
      });
      if (r6Fila.data.length === 5) {
        return ctx.replyWithMarkdown(
          `O Lobby ta cheio!\n${fila}estão na fila!`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Não vou mais jogar', callback_data: 'naoR6' }],
              ],
            },
          }
        );
      } else {
        return ctx.replyWithMarkdown(msg, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Sim', callback_data: 'simR6' },
                { text: 'Não', callback_data: 'naoR6' },
              ],
            ],
          },
        });
      }
    }
  });

  bot.action('naoR6', (ctx) => {
    logger.info(`Action naoR6 used by ${ctx.from.username} - #${ctx.from.id}`);
    naoMarca.data.push(ctx.from);
    naoMarca.write();
    let userExists = false;
    r6Fila.data.forEach((user) => {
      if (user.id === ctx.from.id) {
        userExists = true;
      }
    });
    if (userExists) {
      r6Fila.data = r6Fila.data.filter((user) => user.id !== ctx.from.id);
      r6Fila.write();
      let fila = ``;
      r6Fila.data.forEach((user) => {
        fila += `${user.first_name}, `;
      });
      let msg = `${
        ctx.from.first_name
      } desistiu de jogar!\n${fila}estão na fila.\n🚨 ${
        5 - r6Fila.data.length
      } vagas restantes! Alguém mais vem? `;
      databases.usersdb.data.r6Players.forEach((player) => {
        if (player.id === ctx.from.id) {
          return;
        }
        const foundInr6Fila = r6Fila.data.find((user) => {
          return user.id === player.id;
        });
        if (foundInr6Fila) {
          return;
        }
        const foundInnaoMarca = naoMarca.data.find((user) => {
          return user.id === player.id;
        });
        if (foundInnaoMarca) {
          return;
        }
        const mention = player.username || player.first_name;
        msg += `[@${mention}](tg://user?id=${player.id.toString()}) `;
      });
      ctx.deleteMessage();
      return ctx.replyWithMarkdown(msg, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Sim', callback_data: 'simR6' },
              { text: 'Não', callback_data: 'naoR6' },
            ],
          ],
        },
      });
    }
  });

  bot.action('simFlex', (ctx) => {
    logger.info(`Action simFlex used by ${ctx.from.username} - #${ctx.from.id}`);
    let userExists = false;
    flexFila.data.forEach((user) => {
      if (user.id === ctx.from.id) {
        userExists = true;
      }
    });
    if (!userExists) {
      flexFila.data.push(ctx.from);
      flexFila.write();
      let fila = ``;
      flexFila.data.forEach((user) => {
        fila += `${user.first_name}, `;
      });
      let msg = `${fila}estão na fila.\n🚨 ${
        5 - flexFila.data.length
      } vagas restantes! Alguém mais vem? `;
      databases.usersdb.data.flexPlayers.forEach((player) => {
        if (player.id === ctx.from.id) {
          return;
        }
        const foundInflexFila = flexFila.data.find((user) => {
          return user.id === player.id;
        });
        if (foundInflexFila) {
          return;
        }
        const mention = player.username || player.first_name;
        msg += `[@${mention}](tg://user?id=${player.id.toString()}) `;
      });
      ctx.deleteMessage();
      if (flexFila.data.length === 1) {
        return ctx.replyWithMarkdown(
          `O Lobby ta cheio!\n${fila}estão na fila!`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Não vou mais jogar', callback_data: 'naoFlex' }],
              ],
            },
          }
        );
      } else {
        return ctx.replyWithMarkdown(msg, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Sim', callback_data: 'simFlex' },
                { text: 'Não', callback_data: 'naoFlex' },
              ],
            ],
          },
        });
      }
    }
  });

  bot.action('naoFlex', (ctx) => {
    logger.info(`Action naoFlex used by ${ctx.from.username} - #${ctx.from.id}`);
    let userExists = false;
    flexFila.data.forEach((user) => {
      if (user.id === ctx.from.id) {
        userExists = true;
      }
    });
    if (userExists) {
      flexFila.data = flexFila.data.filter((user) => user.id !== ctx.from.id);
      flexFila.write();
      let fila = ``;
      flexFila.data.forEach((user) => {
        fila += `${user.first_name}, `;
      });
      let msg = `${
        ctx.from.first_name
      } desistiu de jogar!\n${fila}estão na fila.\n🚨 ${
        5 - flexFila.data.length
      } vagas restantes! Alguém mais vem? `;
      databases.usersdb.data.flexPlayers.forEach((player) => {
        if (player.id === ctx.from.id) {
          return;
        }
        const foundInflexFila = flexFila.data.find((user) => {
          return user.id === player.id;
        });
        if (foundInflexFila) {
          return;
        }
        const mention = player.username || player.first_name;
        msg += `[@${mention}](tg://user?id=${player.id.toString()}) `;
      });
      ctx.deleteMessage();
      return ctx.replyWithMarkdown(msg, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Sim', callback_data: 'simFlex' },
              { text: 'Não', callback_data: 'naoFlex' },
            ],
          ],
        },
      });
    }
  });
};
