import { NextFunction, Request, Response } from "express";
import { CreateUserReqBody } from "../types/user";
import { User } from "../models/user";

export const createUser = async (
  req: Request<{}, {}, CreateUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, dob, gender, photo, _id, role } = req.body;

    const user = await User.create({
      _id,
      name,
      email,
      dob: new Date(dob),
      gender,
      photo,
      role
    });

    return res.status(201).json({
      success: true,
      message: `User Created Successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error: ${error}`,
    });
  }
};
