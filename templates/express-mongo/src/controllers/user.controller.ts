import type { Types } from 'mongoose';
import { COOKIE_OPTIONS, generateOtp } from '../config';
import { Otp } from '../models/otp.model';
import { User } from '../models/user.model';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { sendOTPEmail } from '../utils/sendEmail';
import { signInSchema, signUpSchema, verifyEmailSchema } from '../utils/zod-schema';
import { ApiError } from '../utils/apiError';

const generateAccessAndRefereshTokens = async (
  userId: string | Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating referesh and access token');
  }
};

export const handleUserSignup = asyncHandler(async (req, res) => {
  const result = signUpSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, result.error.issues as unknown[], 'All fields are required'));
  }

  const { name, password, email } = result.data;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.status(409).json(new ApiResponse(409, null, 'User with this email already exists'));
  }

  const otp = generateOtp();

  await Otp.create({
    email,
    otp,
  });

  const emailSent = await sendOTPEmail(email, otp);
  if (!emailSent) {
    return res.status(502).json(new ApiResponse(500, null, 'Failed to send OTP email'));
  }

  req.session.tempUser = {
    name,
    email,
    password,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email,
      },
      'OTP sent successfully'
    )
  );
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const result = verifyEmailSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, result.error.issues as unknown[], 'All fields are required'));
  }

  const { otp, email } = result.data;

  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid or expired OTP'));
  }

  const userData = req.session.tempUser;
  if (!userData) {
    return res.status(400).json(new ApiResponse(400, null, 'Signup session expired'));
  }

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  const tokens = await generateAccessAndRefereshTokens(user._id as Types.ObjectId);
  if (!tokens || tokens === null)
    return res.status(500).json(new ApiResponse(500, null, 'failed to generate auth tokens'));

  const accessToken = tokens?.accessToken;

  delete req.session.tempUser;
  await Otp.deleteOne({ email });

  return res
    .status(201)
    .cookie('accessToken', accessToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        201,
        {
          createdUser,
          accessToken,
        },
        'User registered Successfully'
      )
    );
});

export const handleUserSignIn = asyncHandler(async (req, res) => {
  const result = signInSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, result.error.issues, 'All fields are required'));
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found'));
  }

  const validatePass = await user.checkPassword(password);

  if (!validatePass) {
    return res.status(401).json(new ApiResponse(401, null, 'Invalid email or password'));
  }

  const tokens = await generateAccessAndRefereshTokens(user._id as Types.ObjectId);

  if (!tokens || tokens === null) {
    return res.status(500).json(new ApiResponse(500, null, 'failed to generate auth tokens'));
  }

  const { accessToken } = tokens;

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  return res
    .status(200)
    .cookie('accessToken', accessToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        'User logged in successfully'
      )
    );
});
