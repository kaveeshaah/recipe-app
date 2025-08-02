# Password Reset Setup Guide

## 📧 Email Configuration

To enable the "Forgot Password" functionality, you need to set up email sending. This guide uses Gmail, but you can use other email providers.

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to your Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Copy the generated 16-character password

### 2. Environment Variables

Create a `.env` file in your backend folder with:

```env
# Database
MONGO_URI=mongodb://localhost:27017/recipe-app

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Features Added

#### Backend Routes:

- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password/:token` - Reset password with token

#### Frontend Pages:

- `/forgot-password` - Request password reset
- `/reset-password/:token` - Reset password form

#### Email Template:

- Professional HTML email with FlavorFindr branding
- Reset button and fallback link
- 1-hour expiration warning
- Security notes

### 4. How It Works

1. **User clicks "Forgot Password"** → Goes to `/forgot-password`
2. **Enters email** → Backend generates secure token
3. **Email sent** with reset link containing token
4. **User clicks link** → Goes to `/reset-password/:token`
5. **Enters new password** → Backend verifies token and updates password

### 5. Security Features

- ✅ Secure random tokens (32 bytes)
- ✅ Token expiration (1 hour)
- ✅ Password hashing with bcrypt
- ✅ Token cleanup after use
- ✅ Input validation
- ✅ Rate limiting friendly

### 6. Testing

1. **Start both servers**:

   ```bash
   # Backend
   cd backend && npm start

   # Frontend
   cd frontend && npm start
   ```

2. **Test the flow**:
   - Go to `/login`
   - Click "Forgot Password?"
   - Enter your email
   - Check your email inbox
   - Click the reset link
   - Enter new password

### 7. Troubleshooting

**Email not sending?**

- Check your EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail app password is correct
- Check spam/junk folder

**Reset link not working?**

- Check if token expired (1 hour limit)
- Verify FRONTEND_URL in .env matches your frontend URL
- Check browser console for errors

**Other email providers:**

- Replace `service: 'gmail'` in `/routes/auth.js`
- Update SMTP settings accordingly

### 8. Production Notes

For production:

- Use environment variables for all sensitive data
- Consider using services like SendGrid, Mailgun, or AWS SES
- Implement rate limiting for reset requests
- Add more comprehensive logging
- Use HTTPS for all reset links
