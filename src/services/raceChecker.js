import fs from 'fs';
import { promisify } from 'util';
import logger from '../config/logger.js';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);


const checkRace = async (bot, chatId) => {
  try {
    const corridasAbertas = await readFile('data/CorridasAbertas.txt', 'utf8');
    const corridasEnviadas = await readFile('data/CorridasEnviadas.txt', 'utf8');

    if (corridasAbertas !== corridasEnviadas) {
      await bot.telegram.sendMessage(chatId, corridasAbertas);
      await writeFile('data/CorridasEnviadas.txt', corridasAbertas, 'utf8');
      logger.info('Corridas enviadas com sucesso!');
    }
  } catch (error) {
    logger.error(`Erro ao enviar corridas: ${error}`);
  }
};

export default checkRace;