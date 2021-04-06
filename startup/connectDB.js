import mongoose from 'mongoose';

export default function () {
  mongoose
    .connect(`mongodb://localhost:27017/giftr`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.info('Successfully connected to MongoDB ...');
    })
    .catch(error => {
      console.error('Error connecting to MongoDB ... ', error.message);
      process.exit(1);
    });
}
