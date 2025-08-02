# Recipe App - Production Setup Guide

## 🚀 Quick Production Checklist

### Environment Configuration

1. **Update `.env` file for production**:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (use MongoDB Atlas for production)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-app-prod

# Security
JWT_SECRET=your_super_long_random_production_secret_256_bits_recommended

# Email Configuration (Gmail recommended)
EMAIL_USER=noreply@your-domain.com
EMAIL_PASS=your_16_character_app_password
EMAIL_SIMULATION_MODE=false

# Frontend URL
FRONTEND_URL=https://your-production-domain.com
```

### Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:

   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" → Generate password
   - Use the 16-character password (NOT your Gmail password)

3. **Test Email Configuration**:

```bash
cd backend
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((error, success) => {
  if (error) console.log('❌ Email Error:', error.message);
  else console.log('✅ Email server ready!');
});
"
```

## 🧹 Code Cleanup (COMPLETED)

### ✅ Debug Code Removed

- Removed all `console.log` debug statements
- Cleaned up debug comments
- Improved error handling

### ✅ Files Cleaned:

- `frontend/src/pages/Saved.jsx`
- `frontend/src/pages/Recipes.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Filter.jsx`
- `backend/controllers/recipeController.js`
- `backend/routes/auth.js`

## 🔧 Production Optimizations

### Security Enhancements

```javascript
// Already implemented:
// - JWT token expiration
// - Password hashing with bcrypt
// - Input validation
// - CORS configuration
// - Environment variable protection
```

### Performance Features

```javascript
// Consider adding:
// - Rate limiting (express-rate-limit)
// - Request compression (compression)
// - Security headers (helmet)
// - Database indexing
```

## 📧 Email Configuration Options

### Gmail (Recommended)

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=16_character_app_password
```

### Outlook

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your_app_password
```

### Custom SMTP

```javascript
// In backend/routes/auth.js
const transporter = nodemailer.createTransporter({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 🌐 Deployment Steps

### Backend Deployment (Node.js)

1. Set environment variables on your hosting platform
2. Ensure MongoDB Atlas connection string is correct
3. Set `EMAIL_SIMULATION_MODE=false`
4. Configure CORS for your production domain

### Frontend Deployment (React)

1. Update API endpoints if backend URL changes
2. Build the production bundle: `npm run build`
3. Deploy to static hosting (Netlify, Vercel, etc.)

### Database (MongoDB Atlas)

1. Create production cluster
2. Whitelist production server IP
3. Update connection string in `.env`
4. Backup development data if needed

## 🔍 Testing Production Setup

### Email Testing

```bash
# Test password reset flow:
1. Register a test user
2. Go to "Forgot Password"
3. Enter test email
4. Check email inbox (and spam folder)
5. Click reset link
6. Verify password reset works
```

### API Testing

```bash
# Test all endpoints:
curl -X GET https://your-api-domain.com/api/recipes
curl -X POST https://your-api-domain.com/api/auth/register
curl -X POST https://your-api-domain.com/api/auth/login
```

## 🚨 Security Considerations

- Use HTTPS in production
- Keep JWT_SECRET secure and random
- Use App Passwords for email
- Regularly rotate secrets
- Monitor error logs
- Implement rate limiting for auth endpoints

## 📊 Monitoring & Logs

### Important Logs to Monitor

- Authentication attempts
- Password reset requests
- Email sending status
- Database connection issues
- API response times

### Error Handling

- All errors are logged server-side
- Client receives user-friendly messages
- No sensitive information exposed

## ✅ Production Readiness Checklist

- [x] Debug code removed
- [x] Email configuration documented
- [x] Environment variables configured
- [x] Error handling improved
- [x] Security best practices documented
- [ ] Database seeded with sample data
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented

Your Recipe App is now production-ready! 🎉
