import { connect, disconnect } from './database/database';
import { createLogger, format, transports } from 'winston';
import { newBot, start } from './telegram/telegram';

import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { config } from 'dotenv';

let bot: Telegraf<TelegrafContext>;

// Configure logger
export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.simple(), format.colorize()),
    }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

// Check required env vars
config();

for (const envVar of [
  'CRACKWATCH_TOKEN',
  'MONGO_HOST',
  'MONGO_USER',
  'MONGO_PASSWORD',
]) {
  if (!(envVar in process.env)) {
    logger.error('Missing required environment variable', {
      module: 'main',
      envVar,
    });
    process.exit(1);
  }
}

// Connect to the DB
connect(
  process.env.MONGO_USER,
  process.env.MONGO_PASSWORD,
  process.env.MONGO_HOST,
);

// Close connection before exiting
process.on('beforeExit', () => disconnect());

newBot(process.env.CRACKWATCH_TOKEN)
  .then((t) => {
    bot = t;
    start(bot);
  })
  .catch((error) => {
    logger.error('failed bot instantiation', { module: 'main', error });
    process.exit(1);
  });