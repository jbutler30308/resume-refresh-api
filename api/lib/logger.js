import winston from 'winston';

const { combine, timestamp, printf, colorize, splat } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const transports = [
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
];

if (process.env.DEV_LOGGING_ENABLED === 'true') {
  transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'logs/dev.log' }));
}

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    splat(),
    myFormat
  ),
  transports,
});

export default logger;
