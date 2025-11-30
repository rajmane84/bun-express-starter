export const JWT_SECRET = process.env.JWT_SECRET;

export const sendPasswordChangeNotification = `
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
`;
