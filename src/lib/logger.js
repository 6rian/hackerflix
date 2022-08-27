import path from 'path';
import winston from 'winston';

const LOGS_DIR = `${path.resolve('./')}/logs`;

const { timestamp, label, combine, json } = winston.format;

const logger = winston.createLogger({
  format: combine(label({ label: 'app' }), timestamp(), json()),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: `${LOGS_DIR}/combined.log`,
    }),
  ],
});

// Create a stream for the HTTP request logger to use
logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  },
};

export default logger;
