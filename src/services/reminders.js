import { format, isBefore, parseISO } from 'date-fns';
import schedule from 'node-schedule';
import logger from '../config/logger.js';
import checkRace from './raceChecker.js';

export async function checkReminders(databases, bot) {
  const { remindersDb } = databases;
  const now = new Date();

  const dueReminders = remindersDb.data.reminders.filter((reminder) =>
    isBefore(parseISO(reminder.reminderTime), now)
  );

  for (const reminder of dueReminders) {
    try {
      logger.info(`Enviando lembrete...`);
      await bot.telegram.sendMessage(
        reminder.chatId,
        `Lembrete: @${reminder.username} pediu para lembrar disso: ${reminder.reminderText}`,
        { reply_to_message_id: reminder.messageId }
      );
    } catch (error) {
      logger.error(
        `Erro ao enviar lembrete para ${reminder.chatId}: ${error.message}`
      );
    }
  }

  remindersDb.data.reminders = remindersDb.data.reminders.filter(
    (reminder) => !dueReminders.includes(reminder)
  );

  await remindersDb.write();
}

export async function checkBirthdays(databases, bot) {
  const { birthdaysDb } = databases;
  const now = new Date();
  const today = format(now, 'MM-dd');

  const todayBirthdays = birthdaysDb.data.birthdays.filter((birthday) => {
    const birthdayDate = parseISO(birthday.date);
    return format(birthdayDate, 'MM-dd') === today;
  });

  for (const birthday of todayBirthdays) {
    try {
      await bot.telegram.sendMessage(
        birthday.chatId,
        `Hoje é aniversário do ${birthday.username}! 🎉🎂`
      );
    } catch (error) {
      logger.error(
        `Erro ao enviar lembrete de aniversário para ${birthday.chatId}: ${error.message}`
      );
    }
  }
}

export function scheduleJobs(databases, bot) {
  schedule.scheduleJob('* * * * *', () => {
    checkReminders(databases, bot);
  });

  schedule.scheduleJob('0 0 * * *', () => {
    checkBirthdays(databases, bot);
  });

  const chatId = process.env.RODIZINHO_CHATID;
  schedule.scheduleJob('*/5 * * * *', () => {
    checkRace(bot, chatId);
  });
}
