import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { compareHashPassword, genHashPassword, response } from "../util/helpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { Login, Token } from "../types/auth";

// Login Controller
export const login = async (
  req: Request<{}, {}, Login>,
  res: Response,
  next: NextFunction
) => {
	let isPasswordCorrect: boolean = false;
	let user: any;
  let accessToken: any, refreshToken: any;

  try {
    // Get all parameters from request body
    const { email, password } = req.body;

    // Check if all the required fields are in request body
    if(!(email && password )){
      return response(res, StatusCodes.BAD_REQUEST, false, 'Please enter all required fields');
    }

    // Find User details from DB
		try {
			user = await User.findOne({ email });

			if(user){
				isPasswordCorrect = await compareHashPassword(password, user.password);
			}else{
				return response(res, StatusCodes.NOT_FOUND, false, `User doesn't exist`);
			}
		} catch (error) {
			console.error(error);
		}

    // Generate JWT Token
    if(user && isPasswordCorrect && process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET){
      let id: any = user._id;
      accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "30m"});
      refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET);
    }else if(!isPasswordCorrect){
			return response(res, StatusCodes.UNAUTHORIZED, false, `Wrong credentials`);
		}
		else{
      console.error("Environment Variables are not accessible");
    }

    // Save Refresh Token in db
    if(refreshToken){
      const filter = { _id: user._id };
      const updateOperation = {
        $set: {
            token: refreshToken
        }
      }; 

      await User.updateOne(filter, updateOperation);
    }
    
    // Send Response    
    return response(res, StatusCodes.OK, true, 'Login Successful', {
      "accessToken": accessToken,
      "refreshToken": refreshToken
    });

  } catch (error) {
    return response(res, StatusCodes.UNAUTHORIZED, false, `Error: ${error}`);
  }
};

// Token Refresh
export const token = async (
  req: Request<{}, {}, Token>,
  res: Response,
  next: NextFunction
) => {
	let verifiedToken: any;
	let user: any;
  let accessToken: any, newRefreshToken: any;

  try {
    // Get all parameters from request body
    const { refreshToken } = req.body;

    // Check if all the required fields are in request body
    if(!(refreshToken)){
      return response(res, StatusCodes.BAD_REQUEST, false, 'Refresh token is not present');
    }

	// Verify JWT Token
	if(process.env.REFRESH_TOKEN_SECRET){
		verifiedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);			
	}

    // Find User details from DB
	if(verifiedToken){
		try {
			user = await User.findById(verifiedToken.id);		
		} catch (error) {
			console.error(error);
		}
	}else{
		return response(res, StatusCodes.BAD_REQUEST, false, `Invalid Token`);
	}

	if(!user){
		return response(res, StatusCodes.BAD_REQUEST, false, `Invalid Token`);
	}
	
	if(user.token==refreshToken){
		// Generate JWT Token
		if(user && process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET){
			let id: any = user._id;
			accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "30m"});
			newRefreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET);
		}else{
			console.error("Environment Variables are not accessible");
		}

		// Save Refresh Token in db
		if(newRefreshToken){
			const filter = { _id: user._id };
			const updateOperation = {
				$set: {
						token: newRefreshToken
				}
			}; 

			await User.updateOne(filter, updateOperation);
		}

		// Send Response    
		return response(res, StatusCodes.OK, true, 'Token Refresh Successful', {
			"accessToken": accessToken,
			"refreshToken": refreshToken
		});
	}else{
		return response(res, StatusCodes.UNAUTHORIZED, false, 'Token Refresh Failed');
	}

  } catch (error) {
    return response(res, StatusCodes.UNAUTHORIZED, false, `Error: ${error}`);
  }
};