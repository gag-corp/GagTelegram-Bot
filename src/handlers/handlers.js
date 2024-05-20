import { actionHandlers } from './actionHandlers.js';
import { commandHandlers } from './commandHandlers.js';
import { hearsHandlers } from './hearsHandlers.js';

export const registerHandlers = (bot, databases) => {
  commandHandlers(bot, databases);
  actionHandlers(bot, databases);
  hearsHandlers(bot);
};
