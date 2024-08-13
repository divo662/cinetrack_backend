// In user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    username: {
        type: String,
        required: false,
    },
    profilePic: {
        type: String,
        required: false,
    }
});

const SALT_ROUNDS = 10;

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password') || this.isNew) {
            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;