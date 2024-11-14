import logger from '../config/logger.js';

export const sacHandlers = (bot, sacDb) => {
  const sacRegex = {
    hugo: /^\/sac(hugo |ugo |huguinho )/i,
    henrique: /^\/sac(hen |rique |henrique )/i,
    mello: /^\/sac(mello |mellera |matheus )/i,
    leo: /^\/sac(leo |leonardo |nominho )/i,
    joao: /^\/sac(joão |joao |jão |jao )/i,
    gio: /^\/sac(gio |giovanni |gago )/i,
    rod: /^\/sac(rod |rodzinho |rodizinho )/i,
    bello: /^\/sac(bell |bello |gabrielbello )/i,
    lecandre: /^\/sac(lecandre |candrele |lec |bruno )/i,
    expoente: /^\/sac(expoente |expoas )/i,
  };

  const handleReclamacao = async (ctx, user) => {
    logger.info(`Command /sac${user} used by ${ctx.from.username} - #${ctx.from.id}`);

    if (!sacDb.data) {
      sacDb.data = { reclamacoes: {} };
    } else if (!sacDb.data.reclamacoes) {
      sacDb.data.reclamacoes = {};
    }

    sacDb.data.reclamacoes[user] ||= { count: 0, reclamacoes: [] };
    sacDb.data.reclamacoes[user].count++;
    sacDb.data.reclamacoes[user].reclamacoes.push({
      from: {
        id: ctx.from.id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
      },
      message: ctx.message.text.split(' ').slice(1).join(' '),
      date: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    });
    await sacDb.write();

    ctx.reply(`Reclamação para ${user.charAt(0).toUpperCase() + user.slice(1)} registrada com sucesso!`);
  };

  Object.entries(sacRegex).forEach(([user, regex]) => {
    bot.hears(regex, (ctx) => handleReclamacao(ctx, user));
  });

  bot.command('/sac', (ctx) => {
    logger.info(`Command /sac used by ${ctx.from.username} - #${ctx.from.id}`);
    ctx.reply(`Comandos disponíveis:
/sacHugo
/sacHenrique
/sacMello
/sacLeo
/sacJoao
/sacGio
/sacRod
/sacBello
/sacLecandre
/sacExpoente
`);
  });
};
