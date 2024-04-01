import { NextFunction, Request, Response } from "express";
import { CreateUserReqBody, UserDTO } from "../types/user";
import { User } from "../models/user";
import { calculateAge, genHashPassword, response } from "../util/helpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

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
      return response(res, StatusCodes.BAD_REQUEST, false, 'Please enter all required fields');
    }

    // Check if user already exist
    let existingUser = await User.findOne({ email: email});    
    if(existingUser){
      return response(res, StatusCodes.CONFLICT, false, 'User already exist');
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
    let accessToken: any, refreshToken: any;
    if(process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET){
      let id: any = user._id;
      accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "30m"});
      refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET);
    }else{
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
    return response(res, StatusCodes.CREATED, true, 'User Created Successfully', {
      "accessToken": accessToken,
      "refreshToken": refreshToken
    });

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
  if(req.headers.authorization){
    token = req.headers.authorization.split(' ')[1];
  }else{
    return response(res, StatusCodes.NOT_FOUND, false, 'Bad Request');
  }

  try {
    if(process.env.ACCESS_TOKEN_SECRET){
      verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);	
    }
  
    if(!verifiedToken){
      return response(res, StatusCodes.UNAUTHORIZED, false, 'Un-Authorized');
    }

    user = await User.findById(verifiedToken.id).select('_id name email dob gender photo role age createdAt updatedAt');
    
    if(!user){
      return response(res, StatusCodes.NOT_FOUND, false, 'User not found');
    }
  
    return response(res, StatusCodes.OK, true, 'Success', user);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
  }
}