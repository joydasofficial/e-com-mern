import { NextFunction, Request, Response } from "express";
import { response } from "../util/helpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const authCheck = (req: Request, res: Response, next:NextFunction) => {
  try {
    let token = req.headers.authorization?.split(' ')[1] || null;

    if(!token){
      throw new Error("Not Authorized");
    }

    if(!process.env.ACCESS_TOKEN_SECRET){
      throw new Error("Something went wrong");
    }

    let decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    next({ id: decodedToken.id, isSeller: true }); 

  } catch (error) {    
    return response(res, StatusCodes.UNAUTHORIZED, false, `${error}`);
  }
}