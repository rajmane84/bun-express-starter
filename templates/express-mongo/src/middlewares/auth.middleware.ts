import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Types } from 'mongoose';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken -createdAt -updatedAt -coverImage'
  );

  if (!user) {
    throw new ApiError(401, 'Invalid Access Token');
  }

  const userData = {
    _id: user._id as Types.ObjectId,
    name: user.name,
    email: user.email
  };

  req.user = userData;
  next();
});