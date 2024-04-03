import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";

// Response Wrapper
export function response(res: Response, statusCode: number, success: boolean, message: string, data?: any){
  return res.status(statusCode).json({
    success,
    message,
    data
  })
}

// Calculate Age
export function calculateAge(dateofbirth: Date): number {
  const today = new Date();
  const dob: Date = new Date(dateofbirth);
  let age: number = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

// Function to hash a password
export async function genHashPassword(password: string) {
  try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);

      // Hash the password with the salt
      const hash = await bcrypt.hash(password, salt);

      return hash; // Return the hashed password
  } catch (error) {
      throw new Error('Hashing failed ' + error);
  }
}

// Compare Password
export async function compareHashPassword(password: string, dbpassword: string) {
  try {
      // Hash the password with the salt
      const isCorrect = await bcrypt.compare(password, dbpassword);
      return isCorrect; // Return the hashed password
  } catch (error) {
      throw new Error('Hashing failed ' + error);
  }
}

// Generate Token
export function generateToken(id: string){
  if(id && process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET){
    let accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "30m"});
    let refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET);
    return {accessToken, refreshToken}
  }
  return null
}