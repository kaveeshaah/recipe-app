const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure nodemailer
let transporter = null;

// Only create transporter if we have valid email credentials and not in simulation mode
if (process.env.EMAIL_SIMULATION_MODE !== 'true' && 
    process.env.EMAIL_USER && 
    process.env.EMAIL_PASS && 
    process.env.EMAIL_USER !== 'your_email@gmail.com') {
  
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    secure: false,
    port: 587
  });

  // Verify email configuration
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email configuration error:', error.message);
      console.log('💡 Tip: Make sure EMAIL_USER and EMAIL_PASS are set correctly in .env');
      transporter = null; // Disable transporter if verification fails
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.log('📧 Email simulation mode is enabled - no real emails will be sent');
}

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    });

    if (!user) return res.status(400).json({ message: "Invalid email/username or password" });

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response
    const responseData = {
      token,
      userId: user._id,
      username: user.username
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot Password route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token and expiration (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Check if we're in simulation mode
    if (process.env.EMAIL_SIMULATION_MODE === 'true') {
      return res.json({ 
        message: "Password reset email sent successfully",
        debug: {
          mode: "simulation",
          resetToken: resetToken,
          resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`
        }
      });
    }

    // Email content for real sending
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'FlavorFindr - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; margin: 0;">FlavorFindr</h1>
            <p style="color: #6c757d; margin: 5px 0;">Your Recipe Companion</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 5px solid #667eea;">
            <h2 style="color: #2c3e50; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #6c757d; line-height: 1.6;">Hello <strong>${user.username}</strong>,</p>
            <p style="color: #6c757d; line-height: 1.6;">
              We received a request to reset your password for your FlavorFindr account. 
              If you made this request, click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block;
                        font-weight: bold;">
                Reset My Password
              </a>
            </div>
            
            <p style="color: #6c757d; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="color: #667eea; word-break: break-all; font-size: 14px;">
              ${resetUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #dc3545; font-size: 14px; margin: 0;">
                ⚠️ This link will expire in 1 hour for security reasons.
              </p>
              <p style="color: #6c757d; font-size: 14px; margin: 10px 0 0 0;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px;">
            <p>© 2025 FlavorFindr. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      // Check if transporter is available
      if (!transporter) {
        throw new Error("Email service is not configured properly");
      }
      
      await transporter.sendMail(mailOptions);
      res.json({ message: "Password reset email sent successfully" });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Don't expose email configuration errors to the client
      res.status(500).json({ 
        message: "Failed to send reset email. Please try again later or contact support." 
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error processing password reset request" });
  }
});

// Reset Password route
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

// Get all users (for admin/testing purposes)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
