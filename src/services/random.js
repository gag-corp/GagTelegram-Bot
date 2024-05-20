import variables from './variables.js';

function randomSticker() {
  return variables.stickersPack[
    Math.floor(Math.random() * variables.stickersPack.length)
  ];
}

function randomChance(percent) {
  return Math.floor(Math.random() * 100) < percent;
}

export default {
  randomSticker,
  randomChance,
};
