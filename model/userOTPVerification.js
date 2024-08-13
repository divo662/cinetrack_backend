const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserOTPVerificationSchema = new Schema({
    userID: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const UserOTPVerification = mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);

module.exports = UserOTPVerification;
