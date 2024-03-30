import bcrypt from "bcrypt";
import { Response } from "express";

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