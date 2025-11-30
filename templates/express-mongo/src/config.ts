import rateLimit from 'express-rate-limit';
import { type Request, type Response, type NextFunction } from 'express';
import nodemailer from 'nodemailer';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV! === 'production' ? true : false,
  domain: process.env.NODE_ENV! === 'production' ? process.env.DOMAIN! : 'localhost',
};

// Rate limiting for sensitive routes
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many attempts, please try again after 15 minutes',
});

// Debug middleware
export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  console.log('Request files:', req.files);
  console.log('Request body:', req.body);
  next();
};

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const generateOtp = (length = 6) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
