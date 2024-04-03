import mongoose from "mongoose";

interface ProductInterface extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  image: string;
  brand: string;
  userId: string;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
      unique: true,
      minLength: [3, "Name is Invalid"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Please Enter Description"],
      minLength: [10, "Name is Invalid"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Please Enter Price"],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, "Please Enter Quantity"],
      trim: true
    },
    sku: {
      type: String,
      required: [true, "Please Enter SKU"],
      minLength: [8, "SKU is Invalid"],
      trim: true
    },
    image: {
      type: String,
      required: [true, "Please Enter Image"],
      trim: true
    },
    brand: {
      type: String,
      required: [true, "Please Enter Image"],
      trim: true
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<ProductInterface>("Product", schema);
