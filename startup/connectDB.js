import mongoose from 'mongoose';
import config from 'config';
import logger from './logger.js';

const log = logger.child({ module: 'connectDB' });
const dbConf = config.get('db');

export default function () {
  mongoose
    .connect(`mongodb://${dbConf.host}:${dbConf.port}/${dbConf.name}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => {
      log.info('Successfully connected to MongoDB ...');
    })
    .catch(error => {
      log.error('Error connecting to MongoDB ...', error.message);
      process.exit(1);
    });
};
