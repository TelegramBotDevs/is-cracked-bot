import { logger } from './../main';
import mongoose from 'mongoose';

let database: mongoose.Connection;
export const connect = (username: string, password: string, host: string): void => {
  const uri = `mongodb://${username}:${password}@${host}:27017/?retryWrites=true&w=majority`;
  if (database) {
    return;
  }
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      dbName: 'crackwatch',
    });
    database = mongoose.connection;
  } catch (err) {
    logger.error('internal mongo error', {
      module: 'database',
      error: err.message,
    });
    process.exit(1);
  }

  database.once('open', async () => {
    logger.info('Connected to database', { host, username });
    logger.debug('Mongo uri', { uri });
  });
  database.on('error', () => {
    logger.error('Error connecting to database', { host, username });
    process.exit(1);
  });
};

export const disconnect = (): void => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};
