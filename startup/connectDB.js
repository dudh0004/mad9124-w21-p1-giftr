import mongoose from 'mongoose';
import config from 'config';
import logger from './logger.js';

const log = logger.child({ module: 'connectDB' });
const dbConf = config.get('db');

// mongodb+srv://giftrAdmin:NIpNIPsR7BnVkcpd@giftr.fha8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

export default async function connectDB () {
  // const { scheme, host, port, name, username, password, authSource } = config.get('db')
  // const credentials = username && password ? `${username}:${password}@` : ''
  // let connectionString = `${scheme}://${credentials}${host}`

  // if (scheme === 'mongodb') {
  //   connectionString += `:${port}/${name}?authSource=${authSource}`
  // } else {
  //   connectionString += `/${authSource}?retryWrites=true&w=majority`
  // }

  // try {
  //   await mongoose.connect(
  //     connectionString,
  //     {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useCreateIndex: true,
  //       useFindAndModify: false,
  //       dbName: name
  //     }
  //   );
  //   log.info(`Connected to MongoDB @ ${name}...`);
  // } catch (error) {
  //   log.error(`Error connecting to MongoDB ...`, error);
  //   process.exit(1);
  // }


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
