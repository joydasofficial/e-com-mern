"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const helpers_1 = require("../util/helpers");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authCheck = (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1] || null;
        if (!token) {
            throw new Error("Not Authorized");
        }
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("Something went wrong");
        }
        let decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next({ id: decodedToken.id, isSeller: true });
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, false, `${error}`);
    }
};
exports.authCheck = authCheck;
