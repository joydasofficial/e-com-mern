"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.token = exports.login = void 0;
const user_1 = require("../models/user");
const helpers_1 = require("../util/helpers");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Login Controller
const login = async (req, res, next) => {
    let isPasswordCorrect = false;
    let user;
    let tokens;
    try {
        // Get all parameters from request body
        const { email, password } = req.body;
        // Check if all the required fields are in request body
        if (!(email && password)) {
            return next({ statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Please enter all required fields' });
        }
        // Find User details from DB
        user = await user_1.User.findOne({ email });
        if (!user) {
            return next({ statusCode: http_status_codes_1.StatusCodes.NOT_FOUND, message: `User doesn't exist` });
        }
        isPasswordCorrect = await (0, helpers_1.compareHashPassword)(password, user.password);
        if (!isPasswordCorrect) {
            return next({ statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: `Wrong credentials` });
        }
        // Generate JWT Token
        tokens = (0, helpers_1.generateToken)(user._id);
        if (!tokens) {
            throw new Error('Something went wrong');
        }
        // Save Refresh Token in db
        const filter = { _id: user._id };
        const updateOperation = {
            $set: {
                token: tokens.refreshToken
            }
        };
        await user_1.User.updateOne(filter, updateOperation);
        // Send Response    
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Login Successful', tokens);
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, `Error: ${error}`);
    }
};
exports.login = login;
// Token Refresh Controller
const token = async (req, res, next) => {
    let verifiedToken;
    let user;
    let tokens;
    try {
        // Get all parameters from request body
        const { refreshToken } = req.body;
        // Check if all the required fields are in request body
        if (!(refreshToken)) {
            return next({ statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Token Missing' });
        }
        // Verify JWT Token
        if (process.env.REFRESH_TOKEN_SECRET) {
            verifiedToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        // Find User details from DB
        user = await user_1.User.findById(verifiedToken.id);
        if (!user) {
            return next({ statusCode: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'User not found' });
        }
        if (user.token === refreshToken) {
            // Generate JWT Token
            tokens = (0, helpers_1.generateToken)(user._id);
            // Save Refresh Token in db
            if (!tokens) {
                throw new Error("Something went wrong");
            }
            const filter = { _id: user._id };
            const updateOperation = {
                $set: {
                    token: tokens?.refreshToken
                }
            };
            await user_1.User.updateOne(filter, updateOperation);
            // Send Response    
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Token Refresh Successful', tokens);
        }
        else {
            return next({ statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: 'Token Refresh Failed' });
        }
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, `Error: ${error}`);
    }
};
exports.token = token;
// Logout Controller
const logout = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error("Token Missing");
        }
        let decodedToken;
        if (process.env.ACCESS_TOKEN_SECRET) {
            decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        }
        let user = await user_1.User.findById(decodedToken.id);
        if (!user) {
            throw new Error("User not found");
        }
        const filter = { _id: user._id };
        const updateOperation = {
            $set: {
                token: ''
            }
        };
        let { acknowledged } = await user_1.User.updateOne(filter, updateOperation);
        if (!acknowledged) {
            throw new Error("Something went wrong");
        }
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, "Logout Successful");
    }
    catch (error) {
        next({ statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: `${error}` });
    }
};
exports.logout = logout;
