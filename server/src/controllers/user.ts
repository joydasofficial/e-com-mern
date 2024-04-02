import { NextFunction, Request, Response } from "express";
import { CreateUserReqBody, UserDTO } from "../types/user";
import { User } from "../models/user";
import { calculateAge, genHashPassword, generateToken, response } from "../util/helpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { Tokens } from "../types/auth";

// Create User Controller
export const createUser = async (
  req: Request<{}, {}, CreateUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all parameters from request body
    const { name, email, password, dob, gender, photo, role } = req.body;

    // Calculate Age
    const age = calculateAge(dob);

    // Check if all the required fields are in request body
    if(!(name && email && password && dob && gender && photo )){
      return next({statusCode: StatusCodes.BAD_REQUEST, message: 'Please enter all required fields'});
    }

    // Check if user already exist
    let existingUser = await User.findOne({ email: email});    
    if(existingUser){
      return next({statusCode: StatusCodes.CONFLICT, message: 'User already exist'});
    }

    // Generate Hash Password
    let hashPassword = await genHashPassword(password);

    // Save User
    const user = await User.create({
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
    let tokens: Tokens | null;
    tokens = generateToken(user._id);

    // Save Refresh Token in db
    if(tokens?.refreshToken){
      const filter = { _id: user._id };
      const updateOperation = {
        $set: {
            token: tokens.refreshToken
        }
      }; 

      await User.updateOne(filter, updateOperation);
    }
    
    // Send Response    
    return response(res, StatusCodes.CREATED, true, 'User Created Successfully', tokens);

  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error ${error}`);
  }
};

// Get Profile
export const getProfile = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  let verifiedToken: any;
  let user: UserDTO | null;

  // Get token from header
  // TODO: Add auth middleware
  if(!req.headers.authorization){
    return next({statusCode: StatusCodes.NOT_FOUND, message: 'Bad Request'});
  }

  token = req.headers.authorization.split(' ')[1];

  try {
    if(process.env.ACCESS_TOKEN_SECRET){
      verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);	
    }
  
    if(!verifiedToken){
      return next({statusCode: StatusCodes.UNAUTHORIZED, message: 'Un-Authorized'});
    }

    user = await User.findById(verifiedToken.id).select('_id name email dob gender photo role age createdAt updatedAt');
    
    if(!user){
      return next({statusCode: StatusCodes.NOT_FOUND, message: 'User not found'});
    }
  
    return response(res, StatusCodes.OK, true, 'Success', user);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
  }
}