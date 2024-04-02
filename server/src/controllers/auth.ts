import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { compareHashPassword, genHashPassword, generateToken, response } from "../util/helpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { Login, Token, Tokens } from "../types/auth";

// Login Controller
export const login = async (
  req: Request<{}, {}, Login>,
  res: Response,
  next: NextFunction
) => {
	let isPasswordCorrect: boolean = false;
	let user: any;
  let tokens: Tokens | null;

  try {
    // Get all parameters from request body
    const { email, password } = req.body;

    // Check if all the required fields are in request body
    if(!(email && password )){
		  return next({statusCode: StatusCodes.BAD_REQUEST, message: 'Please enter all required fields'});
    }

    // Find User details from DB
		user = await User.findOne({ email });

		if(!user){
			return next({statusCode: StatusCodes.NOT_FOUND, message: `User doesn't exist`});
		}

		isPasswordCorrect = await compareHashPassword(password, user.password);

		if(!isPasswordCorrect){
			return next({statusCode: StatusCodes.UNAUTHORIZED, message: `Wrong credentials`});
		}

    // Generate JWT Token
		tokens = generateToken(user._id);
		if(!tokens){
			throw new Error('Something went wrong');
		}
      
    // Save Refresh Token in db
		const filter = { _id: user._id };
		const updateOperation = {
			$set: {
				token: tokens.refreshToken
			}
		}; 

		await User.updateOne(filter, updateOperation);
    
    // Send Response    
    return response(res, StatusCodes.OK, true, 'Login Successful', tokens);

  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error: ${error}`);
  }
};

// Token Refresh Controller
export const token = async (
  req: Request<{}, {}, Token>,
  res: Response,
  next: NextFunction
) => {
	let verifiedToken: any;
	let user: any;
  let tokens: Tokens | null;

  try {
    // Get all parameters from request body
    const { refreshToken } = req.body;

    // Check if all the required fields are in request body
    if(!(refreshToken)){
			return next({statusCode: StatusCodes.BAD_REQUEST, message: 'Token Missing'});
		}

		// Verify JWT Token
		if(process.env.REFRESH_TOKEN_SECRET){
			verifiedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);			
		}

		// Find User details from DB
		user = await User.findById(verifiedToken.id);		
		if(!user){
			return next({statusCode: StatusCodes.NOT_FOUND, message: 'User not found'});
		}

		if(user.token===refreshToken){
			// Generate JWT Token
			tokens = generateToken(user._id);

			// Save Refresh Token in db
			if(!tokens){
				throw new Error("Something went wrong");
			}

			const filter = { _id: user._id };
			const updateOperation = {
				$set: {
					token: tokens?.refreshToken
				}
			}; 

			await User.updateOne(filter, updateOperation);

			// Send Response    
			return response(res, StatusCodes.OK, true, 'Token Refresh Successful', tokens);
		}else{
			return next({statusCode: StatusCodes.UNAUTHORIZED, message: 'Token Refresh Failed'});
		}

  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error: ${error}`);
  }
};

// Logout Controller
export const logout = async (
	req: Request,
  res: Response,
  next: NextFunction
) => {
	try {
		let token = req.headers.authorization?.split(' ')[1];		
		if(!token){
			throw new Error("Token Missing");
		}

		let decodedToken: any;
		if(process.env.ACCESS_TOKEN_SECRET){
			decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		}

		let user = await User.findById(decodedToken.id);
		if(!user){
			throw new Error("User not found");
		}

		const filter = { _id: user._id }
		const updateOperation = {
			$set: {
					token: ''
			}
		}; 

		let { acknowledged } = await User.updateOne(filter, updateOperation);
		if(!acknowledged){
			throw new Error("Something went wrong");
		}

		return response(res, StatusCodes.OK, true, "Logout Successful");
	} catch (error) {
		next({statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: `${error}` });
	}
}