import axios from 'axios';
import { compareAsc, format, isValid, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import logger from '../config/logger.js';
import proxmox from '../services/proxmox.js';
import Random from '../services/random.js';

export const commandHandlers = (bot, databases) => {
  const { usersdb, dbIdea, flexFila, r6Fila, naoMarca, remindersDb, birthdaysDb } =
    databases;

  let awaitingOcr = new Map();

  bot.start((ctx) => {
    logger.info(
      `Command /start used by ${ctx.from.username} - #${ctx.from.id}`
    );
    ctx.reply('Bot started!');
  });

  bot.command('help', (ctx) => {
    logger.info(`Command /help used by ${ctx.from.username} - #${ctx.from.id}`);
    ctx.reply(
      `Comandos disponíveis:
            /help - Mostra os comandos disponíveis;
            /all - Marca todos do grupo;
            /flex - Marca os jogadores de flex;
            /r6 - Marca os jogadores de R6;
            /minecraft - Verifica o status do servidor de Minecraft;
            /iniciarmine - Inicia o servidor de Minecraft;
            /reiniciarmine - Reinicia o servidor de Minecraft;
            /addeveryone - Adiciona você a lista de usuários;
            /addflex - Adiciona você a lista de jogadores de flex;
            /addr6 - Adiciona você a lista de jogadores de R6;
            /clima - Mostra o clima de uma cidade;
            /gagsticker - Envia um sticker aleatório;
            /fazuelly - Envia o áudio do Fazuelly;
            /statsr6 - Mostra o status do servidor de R6;
            /ideia - Salva uma ideia;
            /ideias - Mostra as ideias salvas;
            /delideia - Deleta uma ideia pelo id;`
    );
  });

  bot.command('ocr', (ctx) => {
    logger.info(`Command /ocr used by ${ctx.from.username} - #${ctx.from.id}`);
    ctx.reply('Envie a imagem que deseja reconhecer o texto');
    awaitingOcr.set(ctx.chat.id, true);
  });

  bot.on('photo', async (ctx) => {
    if (!awaitingOcr.get(ctx.chat.id)) {
      logger.info(`Photo received by ${ctx.from.username} - #${ctx.from.id} but not expecting it`);
      return;
    }
    try{
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const fileUrl = await bot.telegram.getFileLink(fileId);

      const imageBuffer = await axios.get(fileUrl, { responseType: 'arraybuffer' }).then(res => res.data);
      const preprocessedImage = await preprocessImageForOcr(imageBuffer);

      const text = await Random.textFromImage(preprocessedImage);
      logger.info(`Texto reconhecido: ${text}`);
      ctx.reply(text);
    } catch (error) {
      logger.error(`Erro ao reconhecer o texto da imagem: ${error}`);
      ctx.reply('Erro ao reconhecer o texto da imagem');
    } finally {
      awaitingOcr.delete(ctx.chat.id);
    }
  });

  async function preprocessImageForOcr(imageBuffer) {
    return await sharp(imageBuffer)
      .resize({width: 1024})
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();
  }


  bot.command('lembrete', async (ctx) => {
    const from = ctx.message.from;
    const messageId = ctx.message.message_id;
    const chatId = ctx.message.chat.id;

    const [_, dateStr, timeStr, ...msgParts] = ctx.message.text.split(' ');
    const msg = msgParts.join(' ');

    const datetimeStr = `${dateStr} ${timeStr}`;
    const datetime = parse(datetimeStr, 'dd/MM/yyyy HH:mm', new Date(), {
      locale: ptBR,
    });

    if (!isValid(datetime)) {
      logger.warn(`Formato de data ou hora inválido: ${datetimeStr}`);
      ctx.reply('Formato de data ou hora inválido. Use DD/MM/YYYY HH:mm');
      return;
    }

    remindersDb.data.reminders.push({
      chatId,
      messageId,
      userId: from.id,
      username: from.username,
      reminderText: msg,
      reminderTime: datetime.toISOString(),
    });

    await remindersDb.write();

    logger.info(
      `Lembrete agendado para ${datetimeStr} por ${from.username} - #${from.id}`
    );
    ctx.reply(
      `Lembrete agendado para ${format(datetime, 'dd/MM/yyyy HH:mm', {
        locale: ptBR,
      })}.`
    );
  });

  bot.command('listarLembretes', (ctx) => {
    logger.info(
      `Command /listar_lembretes used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const reminders = remindersDb.data.reminders;
    if (reminders.length === 0) {
      ctx.reply('Nenhum lembrete agendado.');
      return;
    }

    let message = 'Lembretes agendados:\n';
    reminders.forEach((reminder, index) => {
      const reminderTime = format(
        new Date(reminder.reminderTime),
        'dd/MM/yyyy HH:mm',
        { locale: ptBR }
      );
      message += `${index + 1}. @${reminder.username}: ${
        reminder.reminderText
      } em ${reminderTime}\n`;
    });

    ctx.reply(message);
  });

  bot.command('addaniversario', (ctx) => {
    logger.info(
      `Command /addAniversario used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const [command, username, date] = ctx.message.text.split(' ');
    if (!username || !date) {
      return ctx.reply('Use o formato: /addbirthday @username DD/MM ou DD/MM/YYYY');
    }

    const [day, month, year] = date.split('/');
    let isoDate;
    if (year) {
      isoDate = `${year}-${month}-${day}`;
    } else {
      isoDate = `${new Date().getFullYear()}-${month}-${day}`;
    }

    birthdaysDb.data.birthdays.push({
      username: username.replace('@', ''),
      date: isoDate,
      chatId: ctx.chat.id,
    });
    birthdaysDb.write();

    ctx.reply(`Aniversário do ${username} adicionado para o dia ${date}`);
  });



  bot.command('aniversarios', (ctx) => {
    if (birthdaysDb.data.birthdays.length === 0) {
      return ctx.reply('Nenhum aniversário cadastrado.');
    }

    const sortedBirthdays = birthdaysDb.data.birthdays.sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return compareAsc(dateA, dateB);
    });

    let message = 'Aniversários:\n';
    sortedBirthdays.forEach((birthday) => {
      const dateObj = parseISO(birthday.date);
      let formattedDate;
      if (birthday.date.length === 10) {
        formattedDate = format(dateObj, 'dd/MM/yyyy');
      } else {
        formattedDate = format(dateObj, 'dd/MM');
      }
      message += `${birthday.username}: ${formattedDate}\n`;
    });

    ctx.reply(message);
  });

  bot.command('ideia', (ctx) => {
    logger.info(
      `Command /ideia used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const from = ctx.update.message.from;
    const ideia = ctx.update.message.text.split(' ').slice(1).join(' ');
    if (!ideia) {
      ctx.reply('Use o comando ideia <ideia>');
      return;
    }
    dbIdea.data.ideias.push({
      id: dbIdea.data.ideias.length + 1,
      ideia: ideia,
    });
    dbIdea.write();
    ctx.reply(`${from.first_name}, sua ideia foi salva!`);
  });

  bot.command('ideias', (ctx) => {
    logger.info(
      `Command /ideias used by ${ctx.from.username} - #${ctx.from.id}`
    );
    if (dbIdea.data.ideias.length == 0) {
      ctx.reply('Nenhuma ideia cadastrada');
      return;
    }
    let msg = `As ideias são: \n\n`;
    dbIdea.data.ideias.forEach((ideia) => {
      msg += `${ideia.id} - ${ideia.ideia} \n`;
    });
    ctx.reply(msg);
  });

  bot.command('delideia', (ctx) => {
    logger.info(
      `Command /delideia used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const from = ctx.update.message.from;
    const id = ctx.update.message.text.split(' ').slice(1).join(' ');
    if (!id) {
      ctx.reply('Use o comando delideia <id>');
      return;
    }
    dbIdea.data.ideias = dbIdea.data.ideias.filter((i) => i.id != id);
    dbIdea.data.ideias.forEach((ideia, index) => {
      ideia.id = index + 1;
    });
    dbIdea.write();
    ctx.reply(`${from.first_name}, ideia deletada`);
  });

  bot.command('iniciarmine', async (ctx) => {
    logger.info(
      `Command /iniciarmine used by ${ctx.from.username} - #${ctx.from.id}`
    );
    try {
      const resposta = await proxmox.iniciarLXC(201);
      ctx.reply(resposta);
    } catch (error) {
      ctx.reply(error.message);
    }
  });

  bot.command('minecraft', async (ctx) => {
    logger.info(
      `Command /minecraft used by ${ctx.from.username} - #${ctx.from.id}`
    );
    try {
      const resposta = await proxmox.verificarLXC(201);
      ctx.reply(resposta);
    } catch (error) {
      ctx.reply(error.message);
    }
  });

  bot.command('reiniciarmine', async (ctx) => {
    logger.info(
      `Command /reiniciarmine used by ${ctx.from.username} - #${ctx.from.id}`
    );
    try {
      const resposta = await proxmox.reiniciarLXC(201);
      ctx.reply(resposta);
    } catch (error) {
      ctx.reply(error.message);
    }
  });

  bot.command('addeveryone', (ctx) => {
    logger.info(
      `Command /addeveryone used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const from = ctx.update.message.from;
    if (usersdb.data.users.find((user) => user.id === from.id)) {
      ctx.reply('Você já está cadastrado');
      return;
    }
    usersdb.data.users.push(from);
    usersdb.write();
    ctx.reply(`${from.first_name}, você foi adicionado a lista de usuários`);
  });

  bot.command('addr6', (ctx) => {
    logger.info(
      `Command /addr6 used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const from = ctx.update.message.from;
    if (usersdb.data.r6Players.find((user) => user.id === from.id)) {
      ctx.reply('Você já está cadastrado');
      return;
    }
    usersdb.data.r6Players.push(from);
    usersdb.write();
    ctx.reply(
      `${from.first_name}, você foi adicionado a lista de Rainbow Six Siege`
    );
  });

  bot.command('addprogrammer', (ctx) => {
    logger.info(
      `Command /addprogrammer used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const from = ctx.update.message.from;
    if (usersdb.data.programmers.find((user) => user.id === from.id)) {
      ctx.reply('Você já está cadastrado');
      return;
    }
    usersdb.data.programmers.push(from);
    usersdb.write();
    ctx.reply(
      `${from.first_name}, você foi adicionado a lista de programadores`
    );
  });

  bot.command('addflex', (ctx) => {
    logger.info(
      `Command /addflex used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const from = ctx.update.message.from;
    if (usersdb.data.flexPlayers.find((user) => user.id === from.id)) {
      ctx.reply('Você já está cadastrado');
      return;
    }
    usersdb.data.flexPlayers.push(from);
    usersdb.write();
    ctx.reply(
      `${from.first_name}, você foi adicionado a lista de League of Legends`
    );
  });

  bot.command(['everyone', 'all', 'familia'], (ctx) => {
    logger.info(
      `Command /everyone used by ${ctx.from.username} - #${ctx.from.id}`
    );
    if (usersdb.data.users.length == 0) {
      ctx.reply('Ninguém está cadastrado');
      return;
    }
    const from = ctx.update.message.from;
    let message_id;
    let msg;
    if (ctx.update.message.reply_to_message) {
      message_id = ctx.update.message.reply_to_message.message_id;
    }
    if (ctx.update.message.text.includes('familia')) {
      msg = `Cadê minha familia? `;
    } else {
      msg = `${from.first_name} quer que vocês vejam isso! `;
    }
    usersdb.data.users.forEach((user) => {
      if (user.id === from.id) {
        return;
      }
      const mention = user.username || user.first_name;
      msg += `[@${mention}](tg://user?id=${user.id.toString()}) `;
    });
    const options = {
      parse_mode: 'Markdown',
      reply_to_message_id: message_id || undefined,
    };
    ctx.reply(msg, options);
  });

  bot.command('programmers', (ctx) => {
    logger.info(
      `Command /programmers used by ${ctx.from.username} - #${ctx.from.id}`
    );
    if (usersdb.data.programmers.length === 0) {
      ctx.reply('Ninguém está cadastrado');
      return;
    }
    let message_id;
    if (ctx.update.message.reply_to_message) {
      message_id = ctx.update.message.reply_to_message.message_id;
    }
    let msg = `🚨ATENÇÃO GAROTOS DE PROGRAMA🚨`;
    usersdb.data.programmers.forEach((user) => {
      const mention = user.username || user.first_name;
      msg += `[@${mention}](tg://user?id=${user.id.toString()}) `;
    });
    const options = {
      parse_mode: 'Markdown',
      reply_to_message_id: message_id || undefined,
    };
    ctx.reply(msg, options);
  });

  bot.command('clima', async (ctx) => {
    logger.info(
      `Command /clima used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const apiKey = process.env.APIWEATHER;
    let cidade = 'Rio de Janeiro';
    const date = new Date();
    const timeNow = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    if (ctx.update.message.text.split(' ').length > 1) {
      cidade = ctx.update.message.text.split(' ').slice(1).join(' ');
    }
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const data = response.data;
        let msg = `Gaguinho Games informa: \n
                    Cidade -> ${cidade}
                    Temp atual às ${timeNow} -> ${data.main.temp}°C
                    Temp máxima -> ${data.main.temp_max}°C
                    Temp mínima -> ${data.main.temp_min}°C
                    Umidade -> ${data.main.humidity}%
                    Céu -> ${data.weather[0].description}\n
                    Consulte outra cidade adicionando o nome da mesma após o comando /clima.`;
        if (
          (data.weather[0].id >= 200 && data.weather[0].id <= 232) ||
          (data.weather[0].id >= 501 && data.weather[0].id <= 531)
        ) {
          msg += `\n\n\n🚨⛈️🚨[@BELLO COELHO](tg://user?id=526914306) CUIDADO, VAI CHOVER!🚨⛈️🚨`;
        }
        ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        ctx.reply('Cidade não encontrada');
      }
    } catch (error) {
      ctx.reply('Erro ao obter o clima');
    }
  });

  bot.command('gagsticker', (ctx) => {
    logger.info(
      `Command /gagsticker used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const sticker_id = Random.randomSticker();
    ctx.replyWithSticker(sticker_id);
  });

  bot.command('statsr6', async (ctx) => {
    logger.info(
      `Command /statsr6 used by ${ctx.from.username} - #${ctx.from.id}`
    );
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(
      'https://www.ubisoft.com/en-us/game/rainbow-six/siege/status'
    );
    await page.click(
      '.svg-inline--fa.fa-plus-square.fa-w-14.fa-sm.text-primary.mr-3'
    );
    await page.evaluate(() => {
      window.scrollBy(0, 300);
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const screenshot = await page.screenshot();
    await browser.close();
    const output = await sharp(screenshot)
      .extract({
        left: 55,
        top: 200,
        width: 800 - 50 - 305,
        height: 600 - 200 - 96,
      })
      .toBuffer();
    await ctx.replyWithPhoto({ source: output });
  });

  bot.command('r6', async (ctx) => {
    logger.info(`Command /r6 used by ${ctx.from.username} - #${ctx.from.id}`);
    naoMarca.data = [];
    r6Fila.data = [];
    r6Fila.data.push(ctx.from);
    r6Fila.write();
    const from = ctx.message.from;
    let msg = `O ${from.first_name} está chamando para jogar R6! Alguém vem? `;
    usersdb.data.r6Players.forEach((player) => {
      if (player.id === from.id) {
        return;
      }
      if (!player.username) {
        msg += `[@${player.first_name}](tg://user?id=${player.id.toString()}) `;
      } else {
        msg += `[@${player.username}](tg://user?id=${player.id.toString()}) `;
      }
    });
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
  });

  bot.command('flex', (ctx) => {
    logger.info(`Command /flex used by ${ctx.from.username} - #${ctx.from.id}`);
    flexFila.data = [];
    flexFila.data.push(ctx.from);
    flexFila.write();
    const from = ctx.message.from;
    let msg = `O ${from.first_name} está chamando para Flex! Alguém vem? `;
    usersdb.data.flexPlayers.forEach((player) => {
      if (player.id === from.id) {
        return;
      }
      if (!player.username) {
        msg += `[@${player.first_name}](tg://user?id=${player.id.toString()}) `;
      } else {
        msg += `[@${player.username}](tg://user?id=${player.id.toString()}) `;
      }
    });
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
  });
};
