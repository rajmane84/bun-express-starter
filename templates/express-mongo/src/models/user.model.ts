import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document, IUserMethods {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}

interface IUserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      match: [
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (this:IUser, next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
  next;
});

userSchema.methods.checkPassword = async function (
  this: IUser,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: IUser): string {
  const payload = {
    _id: this._id,
    email: this.email,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
  return accessToken;
};

userSchema.methods.generateRefreshToken = function (this: IUser): string {
  const payload = {
    _id: this._id,
  };

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return refreshToken;
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
