import mongoose from "mongoose";
import validator from "validator";

interface UserInterface extends Document {
  _id: string;
  name: string;
  email: string;
  dob: Date;
  gender: "male" | "female";
  role: "admin" | "user";
  photo: string;
  age: number; // Virtual Attribute
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please Enter ID"],
    },
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Please Enter Email"],
      validate: validator.default.isEmail,
    },
    dob: {
      type: Date,
      required: [true, "Please Enter Date of Birth"],
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
    },
    photo: {
      type: String,
      required: [true, "Please Enter Photo"],
    },
  },
  {
    timestamps: true,
  }
);

schema.virtual("age").get(function () {
  const today = new Date();
  const dob: Date = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
});

export const User = mongoose.model<UserInterface>("User", schema);
