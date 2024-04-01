"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.createUser = void 0;
const user_1 = require("../models/user");
const helpers_1 = require("../util/helpers");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create User Controller
const createUser = async (req, res, next) => {
    try {
        // Get all parameters from request body
        const { name, email, password, dob, gender, photo, role } = req.body;
        // Calculate Age
        const age = (0, helpers_1.calculateAge)(dob);
        // Check if all the required fields are in request body
        if (!(name && email && password && dob && gender && photo)) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, 'Please enter all required fields');
        }
        // Check if user already exist
        let existingUser = await user_1.User.findOne({ email: email });
        if (existingUser) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.CONFLICT, false, 'User already exist');
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
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.CREATED, true, 'User Created Successfully', {
            "accessToken": accessToken,
            "refreshToken": refreshToken
        });
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, `Error ${error}`);
    }
};
exports.createUser = createUser;
// Get Profile
const getProfile = async (req, res, next) => {
    let token;
    let verifiedToken;
    let user;
    // Get token from header
    // TODO: Add auth middleware
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    else {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, 'Bad Request');
    }
    try {
        if (process.env.ACCESS_TOKEN_SECRET) {
            verifiedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        }
        if (!verifiedToken) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, false, 'Un-Authorized');
        }
        user = await user_1.User.findById(verifiedToken.id).select('_id name email dob gender photo role age createdAt updatedAt');
        if (!user) {
            return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, 'User not found');
        }
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Success', user);
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
    }
};
exports.getProfile = getProfile;
