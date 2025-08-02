# Password Reset Setup Guide

## Quick Setup for Development

The password reset feature is currently configured for **simulation mode** which means it won't send real emails but will show you the reset link in the console.

### Current Status: ✅ Ready to Test

1. **Simulation Mode Enabled**: The system will generate reset tokens and show the reset URL in the server console
2. **No Email Configuration Required**: You can test the functionality without setting up Gmail

### How to Test

1. Go to the "Forgot Password" page
2. Enter an email address of an existing user
3. Check the **backend server console** - you'll see:
   ```
   === EMAIL SIMULATION MODE ===
   Password reset requested for: user@example.com
   Reset token: abc123...
   Reset URL: http://localhost:3000/reset-password/abc123...
   Token expires in 1 hour
   ============================
   ```
4. Copy the Reset URL and use it to test the password reset

### To Enable Real Email Sending

If you want to send actual emails, follow these steps:

1. **Get Gmail App Password**:

   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Go to "App passwords" and generate a password for "Mail"

2. **Update `.env` file**:

   ```env
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_16_character_app_password
   EMAIL_SIMULATION_MODE=false
   ```

3. **Restart the server**

### Features Included

- ✅ Secure token generation
- ✅ Token expiration (1 hour)
- ✅ Beautiful HTML email template
- ✅ Development simulation mode
- ✅ Reset password functionality
- ✅ User validation

### Routes Available

- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token

### Frontend Pages

- `/forgot-password` - Request reset
- `/reset-password/:token` - Reset password form
