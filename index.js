import Telegraf from 'telegraf'
import dotenv from 'dotenv';
import random from './src/random.js';
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
dotenv.config()

const bot = new Telegraf(process.env.token, {username: 'GaGCorpBot'});

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'usersdb.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()
db.data ||= { users: [], flexPlayers: [] }
db.write();

bot.start(ctx =>{
    const from = ctx.update.message.from;
    ctx.reply(`Salve gaguinhos, como vocês estão?`);
})

bot.hears('João', ctx =>{
    ctx.reply('João, o Foda Lerdinho?');
})
bot.hears('Expoente', ctx =>{
    ctx.reply('O Expoente é Pica!');
})

bot.hears('Amouranth', ctx =>{
    ctx.replyWithPhoto({ url: random.randomAmouranthLinks() }, 
    { caption: "Amouranth está online: https://www.twitch.tv/amouranth" });
});

bot.command('add', ctx =>{
    const from = ctx.update.message.from;
    if(db.data.users.find(user => user.id === from.id)){
        ctx.reply('Você já está cadastrado');
        return
    }   
    db.data.users.push(from);
    db.write();
    ctx.reply(`${from.first_name}, você foi adicionado a lista de usuários`);
});

bot.command('addflex', ctx =>{
    const from = ctx.update.message.from;
    if(db.data.flexPlayers.find(user => user.id === from.id)){
        ctx.reply('Você já está cadastrado');
        return
    }
    db.data.flexPlayers.push(from);
    db.write();
    ctx.reply(`${from.first_name}, você foi adicionado a lista de League of Legends`);
});

bot.hears(['flex', 'Flex', 'FLEX'], ctx =>{
    const from = ctx.update.message.from;
    let msg = `O ${from.first_name} está chamando para Flex. 4 vagas!! `;
    db.data.flexPlayers.forEach(player =>{
        msg += `[@${player.first_name}](tg://user?id=${player.id.toString()}) `;
    })
    if(msg == `O ${from.first_name} está chamando para Flex 4 vagas: `){
        return
    }
    ctx.reply(msg, {parse_mode: 'Markdown'});
});

bot.command(['everyone', 'all'], ctx =>{
    let msg = ``;
    db.data.users.forEach(user =>{
        msg += `[@${user.first_name}](tg://user?id=${user.id.toString()}) `;
    })
    if(msg == ``){
        return
    }
    ctx.reply(msg, {parse_mode: 'Markdown'});
});

bot.startPolling();