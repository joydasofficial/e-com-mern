import { NextFunction, Request, Response } from "express";
import { response } from "../util/helpers";
import { StatusCodes } from "http-status-codes";

// Check is user is seller
export const checkSeller = (user: any, req: Request, res: Response, next:NextFunction) => {      
  if(!user.isSeller){
    return response(res, StatusCodes.UNAUTHORIZED, false, 'Not Seller')
  }
  next(user);
}