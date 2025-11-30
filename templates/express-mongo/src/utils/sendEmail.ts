// NOTE: Use nodemailer for local development and testing
// For production, consider using services like SendGrid, Mailgun, Resend, Amazons SES etc.

import { transporter } from '../config';

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  html: string;
  [key: string]: any; // Allow extra mail options
}

// TODO: Test this function with different types and numbers of extra arguments
const SendEmail = async <T extends unknown[]>(
  email: string,
  subject: string,
  html: string,
  ...args: T
): Promise<boolean> => {
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
    // Merge extra args into mailOptions (e.g., attachments, cc, etc.)
    ...Object.fromEntries(args.map((arg, i) => [`extra${i}`, arg]) as [string, unknown][]),
  };

  try {
    await transporter.sendMail(mailOptions);

    // Process extra args (log, validate, etc.)
    args.forEach((arg, index) => {
      console.log(`Extra arg ${index}:`, arg, typeof arg);
      // Add your custom processing here
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', (error as Error).message);
    return false;
  }
};

export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Signup Verification Code',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify Your Email</h2>
                <p>Your verification code is:</p>
                <h1 style="font-size: 36px; letter-spacing: 5px; color: #4A90E2;">${otp}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendPasswordChangeNotification = async (email: string): Promise<boolean> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Password Changed Successfully',
    html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">Password Changed Successfully</h2>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #555;">Your password has been successfully updated.</p>
    </div>
    
    <p style="color: #666; line-height: 1.6;">
        If you did not make this change or believe your account has been compromised, please 
        <a href="#" style="color: #4A90E2; text-decoration: none;">reset your password immediately</a> 
        or contact our support team.
    </p>
    
    <div style="margin-top: 30px; text-align: center;">
        <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #4A90E2; 
           color: white; text-decoration: none; border-radius: 4px;">Login to Your Account</a>
    </div>
    
    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
        For security reasons, please do not share this email with anyone.
    </p>
</div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
