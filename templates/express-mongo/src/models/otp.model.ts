import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IOtp extends Document {
  email: string;
  otp: string; // Hashed OTP
  attempts: number;
  isOtpUsed: boolean;
  createdAt: Date;

  compareOtp(otp: string): Promise<boolean>;
  incrementAttempts(): void;
  markAsUsed(): void;
}

const otpSchema: Schema<IOtp> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
        'Please use a valid email',
      ],
      index: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
      minlength: [4, 'OTP must be at least 4 characters'],
    },
    attempts: {
      type: Number,
      default: 0,
      min: [0, 'Attempts cannot be negative'],
      max: [5, 'Max 5 attempts allowed'],
    },
    isOtpUsed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Auto-delete after 5 minutes
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
otpSchema.index({ email: 1, createdAt: -1 }); // Latest OTP per email

// Hash OTP before saving (pre-save middleware)
otpSchema.pre('save', async function (this: IOtp, next) {
  if (this.isModified('otp')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.otp = await bcrypt.hash(this.otp, salt);
      next;
    } catch (error) {
      next;
    }
  } else {
    next;
  }
});

// Instance methods
otpSchema.methods.compareOtp = async function (candidateOtp: string): Promise<boolean> {
  if (this.isOtpUsed) return false;
  if (this.attempts >= 5) return false;

  const isMatch = await bcrypt.compare(candidateOtp, this.otp);
  if (isMatch) {
    this.markAsUsed();
  } else {
    this.incrementAttempts();
  }
  await this.save();
  return isMatch;
};

otpSchema.methods.incrementAttempts = function () {
  this.attempts += 1;
};

otpSchema.methods.markAsUsed = function () {
  this.isOtpUsed = true;
};

// Prevent multiple concurrent validations
otpSchema.methods.validateOtp = async function (candidateOtp: string): Promise<boolean> {
  return await this.compareOtp(candidateOtp);
};

export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
