import { NextFunction, Request, Response } from "express";

// Custom Error Handler
export const ErrorHandler = (err: any, req: Request, res: Response, next:NextFunction) => {    
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  return res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMsg,
  })
}