"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
// Custom Error Handler
const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
    });
};
exports.ErrorHandler = ErrorHandler;
