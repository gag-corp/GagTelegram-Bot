import Tesseract from 'tesseract.js';
import logger from '../config/logger.js';
import variables from './variables.js';

function randomSticker() {
  return variables.stickersPack[
    Math.floor(Math.random() * variables.stickersPack.length)
  ];
}

function randomChance(percent) {
  return Math.floor(Math.random() * 100) < percent;
}

async function textFromImage(fileUrl)  {
  try {
    const { data: { text } } = await Tesseract.recognize(fileUrl, 'eng+por', {
      logger: (m) => logger.info(m),
    });
    return text;
  } catch (error) {
    logger.error(`Erro ao reconhecer o texto da imagem: ${error}`);
    throw new Error('Erro ao reconhecer o texto da imagem');
  }
}


export default {
  randomSticker,
  randomChance,
  textFromImage,
};
