const UserModel = require('../model/user.model');
const UserService = require('../services/user.services');
const UserOTPVerification = require('../model/userOTPVerification');
const nodemailer = require('nodemailer');
require('dotenv').config(); 
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User Controller
exports.registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await UserService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'Email already registered' });
        }

        // Register the user using the service
        const user = await UserService.registerUser(email, password);

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP expiration time (e.g., 15 minutes)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Save OTP to the database
        await new UserOTPVerification({
            userID: user._id,
            otp,
            expiresAt,
        }).save();

        // Create Nodemailer transporter for emailing the generated OTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Define email logic
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Cinetrack - Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 5px;">
                    <h2 style="color: #333;">Welcome to Cinetrack!</h2>
                    <p style="color: #555;">Hi there,</p>
                    <p style="color: #555;">We're excited to have you on board. To complete your registration and verify your email address, please use the OTP code below:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #007BFF; color: #fff; border-radius: 5px;">${otp}</span>
                    </div>
                    <p style="color: #555;">This code is valid for the next 15 minutes. If you didn't initiate this registration, please ignore this email.</p>
                    <p style="color: #555;">If you need any help or have questions, feel free to reach out to our support team.</p>
                    <p style="color: #555;">Thank you,<br>The Cinetrack Team</p>
                </div>
            `,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ status: false, message: 'Failed to send verification email' });
            }
            console.log('Email sent:', info.response);

            res.json({ status: true, userId: user._id, message: 'User registered successfully' });
        });
    } catch (err) {
        console.error('Error in registerUser:', err);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Controller to handle OTP resend requests
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await UserService.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ status: false, message: 'User does not exist' });
        }

        const newOtp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

        await UserOTPVerification.findOneAndUpdate(
            { userID: user._id },
            { otp: newOtp, expiresAt },
            { upsert: true } 
        );

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your New OTP Code',
            html: `
                <p>Here is your new OTP code:</p>
                <h3>${newOtp}</h3>
                <p>This code is valid for the next 15 minutes.</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ status: false, message: 'Failed to send new OTP' });
            }
            console.log('New OTP sent:', info.response);
            res.json({ status: true, message: 'New OTP sent successfully' });
        });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Controller for verifying OTP
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await UserService.checkUser(email);
        if (!user) {
            return res.status(400).json({ status: false, message: 'User does not exist' });
        }

        const otpRecord = await UserOTPVerification.findOne({
            userID: user._id,
            otp,
            expiresAt: { $gte: Date.now() }, 
        });

        if (!otpRecord) {
            return res.status(400).json({ status: false, message: 'Invalid or expired OTP' });
        }

        user.verified = true;
        await user.save();

        await UserOTPVerification.deleteOne({ _id: otpRecord._id });

        res.json({ status: true, message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

  // Set up Profile controller logic
exports.setupProfile = async (req, res) => {
    try {
      const { userID, username, profilePic } = req.body;
  
      if (!userID || (!username && !profilePic)) {
        return res.status(400).json({ status: false, message: "Invalid input" });
      }
  
      const result = await UserService.updateProfile(userID, username, profilePic);
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
  
      if (result.modifiedCount === 0) {
        return res.status(200).json({ status: true, message: "No changes were made" });
      }
  
      res.json({ status: true, message: "Profile updated successfully" });
    } catch (err) {
      console.error('Error in setupProfile:', err);
      res.status(500).json({ status: false, message: "An error occurred while updating the profile" });
    }
  };
  

    // login user controller logic
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login Attempt:', email, password);

        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ status: false, message: "User does not exist" });
        }

        console.log('Stored Password Hash:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ status: false, message: "Incorrect Password" });
        }

        const token = await UserService.generateToken(
            { _id: user._id, email: user.email, userName: user.username, profilePicture: user.profilePic },
            "secretKey",
            "1h"
        );

        res.json({ 
            status: true, 
            token, 
            userId: user._id.toString(),
            userName: user.username, 
            profilePicture: user.profilePic 
        });
    } catch (err) {
        console.error('Error in loginUser:', err);
        res.status(500).json({ status: false, message: err.message });
    }
};

  // change password controller logic
exports.changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        console.log("Attempting to change password for user ID:", userId);
        console.log("New password received:", newPassword);

        const user = await UserModel.findById(userId);

        if (!user) {
            console.log("User not found for user ID:", userId);
            return res.status(404).json({ status: false, message: "User not found" });
        }

        user.password = newPassword;
        await user.save();

        console.log("User after password change:", user);

        const isMatch = await user.comparePassword(newPassword);
        console.log("Verification of new password:", isMatch);

        res.json({ status: true, message: "Password changed successfully" });
    } catch (err) {
        console.error('Error in changePassword:', err);
        res.status(500).json({ status: false, message: "An error occurred" });
    }
};


// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        const expiresAt = new Date(Date.now() + 3600000);

        await new UserOTPVerification({
            userID: user._id,
            otp,
            expiresAt,
        }).save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <p>Here is your reset password OTP code:</p>
                <h3>${otp}</h3>
                <p>This code is valid for the next 1 hour.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ status: true, message: "OTP sent to email" });
    } catch (err) {
        console.error('Error in requestPasswordReset:', err);
        res.status(500).json({ status: false, message: "An error occurred" });
    }
};


// Verify Reset OTP
exports.verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const otpRecord = await UserOTPVerification.findOne({
            userID: user._id,
            otp,
            expiresAt: { $gte: Date.now() }, // Check if OTP has expired
        });

        if (!otpRecord) {
            return res.status(400).json({ status: false, message: 'Invalid or expired OTP' });
        }

        await UserOTPVerification.deleteOne({ _id: otpRecord._id });

        res.json({ status: true, message: "OTP verified successfully" });
    } catch (err) {
        console.error('Error in verifyResetOtp:', err);
        res.status(500).json({ status: false, message: "An error occurred" });
    }
};

// Reset Password controller
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        console.log("Attempting to reset password for email:", email);
        console.log("New password received:", newPassword);

        const user = await UserModel.findOne({ email });

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ status: false, message: "User not found" });
        }

        user.password = newPassword;
        await user.save();

        console.log("User after reset:", user);

        const isMatch = await user.comparePassword(newPassword);
        console.log("Verification of new password:", isMatch);

        res.json({ status: true, message: "Password reset successfully" });
    } catch (err) {
        console.error('Error in resetPassword:', err);
        res.status(500).json({ status: false, message: "An error occurred" });
    }
};