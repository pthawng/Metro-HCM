import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import als from './als.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { combine, timestamp, printf, colorize, json } = winston.format;

// Format cho console (development)
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    const requestId = als.getStore();
    const trace = requestId ? ` [${requestId.substring(0, 8)}...]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]${trace}: ${message}${metaStr}`;
  })
);

// Format cho file (production) — structured JSON
const prodFormat = combine(
  timestamp(),
  json()
);

const transports = [
  new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/error.log'),
    level: 'error',
    format: prodFormat,
  }),
  new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/combined.log'),
    format: prodFormat,
  }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({ format: devFormat })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports,
  // Không crash app khi logger lỗi
  exitOnError: false,
});

export default logger;
