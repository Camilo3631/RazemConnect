import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';    
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import loginRouter from './routes/login.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.json());  

app.use("/api", loginRouter); 


await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

async function connectDB() {
  const client = new MongoClient(process.env.MongoURI);
  app.locals.db = client.db('razem_chat');
  console.log('✅ Connected to MongoDB');
} 

export default app;
