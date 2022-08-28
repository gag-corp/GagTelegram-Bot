import Telegraf from 'telegraf'
import dotenv from 'dotenv';
dotenv.config()

const bot = new Telegraf(process.env.token, {username: 'GaGEveryoneBot'});

let lista = [];

bot.start(ctx =>{
    const from = ctx.update.message.from;
    ctx.reply(`Seja bem vindo ${from.first_name}`);
})

bot.hears('João', ctx =>{
    ctx.reply('João o Foda Lerdinho?');
})
bot.hears('Expoente', ctx =>{
    ctx.reply('O Expoente é Pica!');
})


bot.command('add', ctx =>{
    const from = ctx.update.message.from;
    lista.push(from);
});

bot.hears('marca ai', ctx =>{
    let msg = ``;
    for(let i = 0; i < lista.length; i++){
    msg += `[@${lista[i].first_name}](tg://user?id=${lista[i].id.toString()}) `;
    }
    if(msg == ``){
        return
    }
    ctx.reply(msg, {parse_mode: 'Markdown'});
} );


bot.startPolling();