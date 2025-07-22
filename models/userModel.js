const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
        unique: true,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpires: {
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true // optional but recommended for tracking when verification codes are sent
});

// Method to generate and save verification code
userSchema.methods.generateVerificationCode = function () {
    // Generate a 6-digit random code
    this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiration to 10 minutes from now
    this.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    return this.verificationCode;
};

// Method to verify the code
userSchema.methods.verifyPhone = function (code) {
    if (this.verificationCode !== code) {
        return false;
    }
    if (this.verificationCodeExpires < new Date()) {
        return false;
    }
    this.phoneVerified = true;
    this.verificationCode = undefined;
    this.verificationCodeExpires = undefined;
    return true;
};

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = userModel;