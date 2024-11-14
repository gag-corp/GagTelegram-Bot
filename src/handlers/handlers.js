import { actionHandlers } from './actionHandlers.js';
import { commandHandlers } from './commandHandlers.js';
import { hearsHandlers } from './hearsHandlers.js';
import { sacHandlers } from './sac.js';

export const registerHandlers = (bot, databases) => {
  commandHandlers(bot, databases);
  actionHandlers(bot, databases);
  sacHandlers(bot, databases.sacDb);
  hearsHandlers(bot);
};
