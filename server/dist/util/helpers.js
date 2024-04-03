"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.compareHashPassword = exports.genHashPassword = exports.calculateAge = exports.response = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Response Wrapper
function response(res, statusCode, success, message, data) {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
}
exports.response = response;
// Calculate Age
function calculateAge(dateofbirth) {
    const today = new Date();
    const dob = new Date(dateofbirth);
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
exports.calculateAge = calculateAge;
// Function to hash a password
async function genHashPassword(password) {
    try {
        // Generate a salt
        const salt = await bcrypt_1.default.genSalt(10);
        // Hash the password with the salt
        const hash = await bcrypt_1.default.hash(password, salt);
        return hash; // Return the hashed password
    }
    catch (error) {
        throw new Error('Hashing failed ' + error);
    }
}
exports.genHashPassword = genHashPassword;
// Compare Password
async function compareHashPassword(password, dbpassword) {
    try {
        // Hash the password with the salt
        const isCorrect = await bcrypt_1.default.compare(password, dbpassword);
        return isCorrect; // Return the hashed password
    }
    catch (error) {
        throw new Error('Hashing failed ' + error);
    }
}
exports.compareHashPassword = compareHashPassword;
// Generate Token
function generateToken(id) {
    if (id && process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
        let accessToken = jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        let refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
        return { accessToken, refreshToken };
    }
    return null;
}
exports.generateToken = generateToken;
