"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const user_1 = require("../models/user");
const helpers_1 = require("../util/helpers");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = async (req, res, next) => {
    try {
        // Get all parameters from request body
        const { name, email, password, dob, gender, photo, role } = req.body;
        // Calculate Age
        const age = (0, helpers_1.calculateAge)(dob);
        // Check if all the required fields are in request body
        if (!(name && email && password && dob && gender && photo)) {
            (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, 'Please enter all required fields');
        }
        // Check if user already exist
        let existingUser = await user_1.User.findOne({ email: email });
        if (existingUser) {
            (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.CONFLICT, false, 'User already exist');
        }
        // Generate Hash Password
        let hashPassword = await (0, helpers_1.genHashPassword)(password);
        // Save User
        const user = await user_1.User.create({
            name,
            email,
            password: hashPassword,
            dob: new Date(dob),
            gender,
            photo,
            role,
            age
        });
        // Generate JWT Token
        let accessToken, refreshToken;
        if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
            let id = user._id;
            accessToken = jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
            refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
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
        (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.CREATED, true, 'User Created Successfully', {
            "accessToken": accessToken,
            "refreshToken": refreshToken
        });
    }
    catch (error) {
        (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, 'User Created Successfully', {
            success: false,
            message: `Error: ${error}`,
        });
    }
};
exports.createUser = createUser;
