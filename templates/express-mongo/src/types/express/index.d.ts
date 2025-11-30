import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        name: string;
        email: string;
      };
      files?: any;
    }
  }
}

declare module 'express-session' {
  interface Session {
    tempUser?: {
      name: string;
      email: string;
      password: string;
    };
  }
}
