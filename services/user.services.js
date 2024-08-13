
const UserModel = require('../model/user.model');
const UserOTPVerification = require('../model/userOTPVerification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserService {
    // Register a new user with email and hashed password
    static async registerUser(email, password) {
        try {
            const createUser = new UserModel({ email, password });
            return await createUser.save();
        } catch (err) {
            throw err;
        }
    }
    
    // Find a user by their email
    static async findUserByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.error('Error in findUserByEmail:', err);
            throw err;
        }
    }
    

    // Check if a user exists by email
    static async checkUser(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    // Generate a JWT token for authentication
    static async generateToken(tokenData, secretKey, jwtExpiry) {
        return jwt.sign(tokenData, secretKey, { expiresIn: jwtExpiry });
    }

    // Verify OTP and update user verification status
    static async verifyOtp(userID, otp) {
        try {
            const otpRecord = await UserOTPVerification.findOne({ userID, otp });
            if (otpRecord && otpRecord.expiresAt > new Date()) {
                await UserModel.updateOne({ _id: userID }, { verified: true });
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    // Update user profile by user ID
    static async updateProfile(userID, username, profilePic) {
        try {
            const updateFields = {};
            if (username) updateFields.username = username;
            if (profilePic) updateFields.profilePic = profilePic;
    
            const result = await UserModel.updateOne(
                { _id: userID },
                { $set: updateFields }
            );
    
            return result;
        } catch (error) {
            console.error('Error in updateProfile:', error);
            throw error;
        }
    }
}

module.exports = UserService;
