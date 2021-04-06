import express from 'express';
import sanitizeMongo from 'express-mongo-sanitize';
import connectDB from './startup/connectDB.js';
import authRouter from './routes/auth/index.js';

connectDB();

const app = express();

app.use(express.json());
app.use(sanitizeMongo());

// routes
app.use('/auth', authRouter);

export default app;
