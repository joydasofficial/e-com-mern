import mongoose from "mongoose";
import validator from "validator";

interface UserInterface extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  dob: Date;
  gender: "male" | "female";
  role: "admin" | "user";
  photo: string;
  age: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
      minLength: [3, "Name is Invalid"],
      trim: true
    },
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Please Enter Email"],
      validate: validator.default.isEmail,
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      validate: {
        validator: validator.default.isStrongPassword,
        message: "Password must be strong"
      }
    },
    dob: {
      type: Date,
      required: [true, "Please Enter Date of Birth"],
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please Enter Gender"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: [true, "Please Enter Role"],
      default: "user"
    },
    photo: {
      type: String,
      required: [true, "Please Enter Photo"],
    },
    token: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<UserInterface>("User", schema);
