import express from 'express';
import morgan from 'morgan';
import sanitizeMongo from 'express-mongo-sanitize';
import connectDB from './startup/connectDB.js';
import logger from './startup/logger.js';
import authRouter from './routes/auth/index.js';

connectDB();

const log = logger.child({ module: 'expressApp' });
const app = express();

log.info(process.env.NODE_ENV);
log.warn(app.get('env'));

app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(express.json());
app.use(sanitizeMongo());

// routes
app.use('/auth', authRouter);

export default app;
