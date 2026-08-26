import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import usersRouter from './routes/users.js';
import contactsRouter from './routes/contacts.js';
import messagesRouter from './routes/messages.js';
import { socketManager } from './managers/socketManager.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.set('trust proxy', 1);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

app.locals.io = io;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', usersRouter);
app.use('/api', contactsRouter);
app.use('/api', messagesRouter);

socketManager(io);

async function connectDB() {
  const client = new MongoClient(process.env.MongoURI);

  await client.connect();

  app.locals.db = client.db('razem_chat');

  console.log('✅ Connected to MongoDB');
}

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;