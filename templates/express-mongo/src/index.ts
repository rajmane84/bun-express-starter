import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import AuthRouter from './routes/auth.route.ts';
import HealthRouter from './routes/health.route.ts';
import UserRouter from './routes/user.route.ts';

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

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/health", HealthRouter);
app.use("/api/v1/user", UserRouter);

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});