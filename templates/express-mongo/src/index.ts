import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB';
import cookieParser from 'cookie-parser';
import V1Router from './routes/v1/route';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:6000/test-database');

app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));

app.use('/api/v1', V1Router);

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});