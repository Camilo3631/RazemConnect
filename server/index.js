import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import usersRouter from './routes/users.js';
import contactsRouter from './routes/contacts.js';
import messagesRouter from './routes/messages.js';
import { socketManager } from './managers/socketManager.js';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});


app.locals.io = io;

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', usersRouter);
app.use('/api', contactsRouter);
app.use('/api', messagesRouter);


socketManager(io);

await connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

async function connectDB() {
  const client = new MongoClient(process.env.MongoURI);

  app.locals.db = client.db('razem_chat');

  console.log('✅ Connected to MongoDB');
}

export default app;