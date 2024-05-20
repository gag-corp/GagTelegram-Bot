import { createLogger, format, transports } from 'winston';

const timestampFormat = format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' });

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: format.combine(timestampFormat, logFormat),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), timestampFormat, logFormat),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
