import { NextFunction, Request, Response } from "express";
import { response } from "../util/helpers";
import { StatusCodes } from "http-status-codes";
import { CreateProductReqBody } from "../types/product";
import { Product } from "../models/product";

// Create Product Controller
export const createProduct = async (
  user: any,
  req: Request<{}, {}, CreateProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all parameters from request body
    const { name, description, price, quantity, sku, image, brand } = req.body;

    // Check if all the required fields are in request body
    if(!(name && description && price && quantity && sku && image &&  brand)){
      return next({statusCode: StatusCodes.BAD_REQUEST, message: 'Please enter all required fields'});
    }

    // Save Product
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      sku,
      image,
      brand,
      userId: user.id
    });    

    // Send Response    
    return response(res, StatusCodes.CREATED, true, 'Product Created Successfully', product);

  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error ${error}`);
  }
};

// Get Product by user
export const getProduct = async(
  user: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    let product = await Product.find({userId: user.id}).populate('userId');
    if(!product){
      next({statusCode: StatusCodes.NOT_FOUND, message: "Product Not Found"})
    }

    return response(res, StatusCodes.OK, true, 'Success', product);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
  }
}

// Get All Product
export const getAllProduct = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    let product = await Product.find();
    if(!product){
      next({statusCode: StatusCodes.NOT_FOUND, message: "Product Not Found"})
    }

    return response(res, StatusCodes.OK, true, 'Success', product);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
  }
}

// Delete Product Product
export const deleteProduct = async(
  user: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{    
    const id: string = req.params.id.split("=")[1];
    
    if(!id){
      return next({statusCode: StatusCodes.BAD_REQUEST, message: "Missing Id"})
    }
    
    let product = await Product.findById(id);
    console.log(product);

    if(!product){
      return next({statusCode: StatusCodes.NOT_FOUND, message: "Product Not Found"})
    }

    if(product?.userId != user.id){
      return next({statusCode: StatusCodes.UNAUTHORIZED, message: "User not authorized to delete this product"});
    }

    let { acknowledged } = await Product.deleteOne({_id: id });
    if(!acknowledged) {
      return next({statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to delete the product"});
    }
  
    return response(res, StatusCodes.OK, true, 'Product deleted successfully');
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
  }
}