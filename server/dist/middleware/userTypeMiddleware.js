"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSeller = void 0;
const helpers_1 = require("../util/helpers");
const http_status_codes_1 = require("http-status-codes");
// Check is user is seller
const checkSeller = (user, req, res, next) => {
    if (!user.isSeller) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, false, 'Not Seller');
    }
    next(user);
};
exports.checkSeller = checkSeller;
