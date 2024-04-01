"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = exports.login = void 0;
const user_1 = require("../models/user");
const helpers_1 = require("../util/helpers");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Login Controller
const login = async (req, res, next) => {
    let isPasswordCorrect = false;
    let user;
    let accessToken, refreshToken;
    try {
        // Get all parameters from request body
        const { email, password } = req.body;
        // Check if all the required fields are in request body
        if (!(email && password)) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, 'Please enter all required fields');
        }
        // Find User details from DB
        try {
            user = await user_1.User.findOne({ email });
            if (user) {
                isPasswordCorrect = await (0, helpers_1.compareHashPassword)(password, user.password);
            }
            else {
                return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, `User doesn't exist`);
            }
        }
        catch (error) {
            console.error(error);
        }
        // Generate JWT Token
        if (user && isPasswordCorrect && process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
            let id = user._id;
            accessToken = jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
            refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
        }
        else if (!isPasswordCorrect) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, false, `Wrong credentials`);
        }
        else {
            console.error("Environment Variables are not accessible");
        }
        // Save Refresh Token in db
        if (refreshToken) {
            const filter = { _id: user._id };
            const updateOperation = {
                $set: {
                    token: refreshToken
                }
            };
            await user_1.User.updateOne(filter, updateOperation);
        }
        // Send Response    
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Login Successful', {
            "accessToken": accessToken,
            "refreshToken": refreshToken
        });
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, false, `Error: ${error}`);
    }
};
exports.login = login;
// Token Refresh
const token = async (req, res, next) => {
    let verifiedToken;
    let user;
    let accessToken, newRefreshToken;
    try {
        // Get all parameters from request body
        const { refreshToken } = req.body;
        // Check if all the required fields are in request body
        if (!(refreshToken)) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, 'Refresh token is not present');
        }
        // Verify JWT Token
        if (process.env.REFRESH_TOKEN_SECRET) {
            verifiedToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        // Find User details from DB
        if (verifiedToken) {
            try {
                user = await user_1.User.findById(verifiedToken.id);
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, `Invalid Token`);
        }
        if (!user) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, `Invalid Token`);
        }
        if (user.token == refreshToken) {
            // Generate JWT Token
            if (user && process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
                let id = user._id;
                accessToken = jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
                newRefreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
            }
            else {
                console.error("Environment Variables are not accessible");
            }
            // Save Refresh Token in db
            if (newRefreshToken) {
                const filter = { _id: user._id };
                const updateOperation = {
                    $set: {
                        token: newRefreshToken
                    }
                };
                await user_1.User.updateOne(filter, updateOperation);
            }
            // Send Response    
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Token Refresh Successful', {
                "accessToken": accessToken,
                "refreshToken": refreshToken
            });
        }
        else {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, false, 'Token Refresh Failed');
        }
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, false, `Error: ${error}`);
    }
};
exports.token = token;
