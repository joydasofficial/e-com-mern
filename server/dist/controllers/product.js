"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getAllProduct = exports.getProduct = exports.createProduct = void 0;
const helpers_1 = require("../util/helpers");
const http_status_codes_1 = require("http-status-codes");
const product_1 = require("../models/product");
// Create Product Controller
const createProduct = async (user, req, res, next) => {
    try {
        // Get all parameters from request body
        const { name, description, price, quantity, sku, image, brand } = req.body;
        // Check if all the required fields are in request body
        if (!(name && description && price && quantity && sku && image && brand)) {
            return next({ statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Please enter all required fields' });
        }
        // Save Product
        const product = await product_1.Product.create({
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
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.CREATED, true, 'Product Created Successfully', product);
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, `Error ${error}`);
    }
};
exports.createProduct = createProduct;
// Get Product by user
const getProduct = async (user, req, res, next) => {
    try {
        let product = await product_1.Product.find({ userId: user.id }).populate('userId');
        if (!product) {
            next({ statusCode: http_status_codes_1.StatusCodes.NOT_FOUND, message: "Product Not Found" });
        }
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Success', product);
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
    }
};
exports.getProduct = getProduct;
// Get All Product
const getAllProduct = async (req, res, next) => {
    try {
        let product = await product_1.Product.find();
        if (!product) {
            next({ statusCode: http_status_codes_1.StatusCodes.NOT_FOUND, message: "Product Not Found" });
        }
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Success', product);
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
    }
};
exports.getAllProduct = getAllProduct;
// Delete Product Product
const deleteProduct = async (user, req, res, next) => {
    try {
        const id = req.params.id.split("=")[1];
        if (!id) {
            return next({ statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: "Missing Id" });
        }
        let product = await product_1.Product.findById(id);
        console.log(product);
        if (!product) {
            return next({ statusCode: http_status_codes_1.StatusCodes.NOT_FOUND, message: "Product Not Found" });
        }
        if (product?.userId != user.id) {
            return next({ statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: "User not authorized to delete this product" });
        }
        let { acknowledged } = await product_1.Product.deleteOne({ _id: id });
        if (!acknowledged) {
            return next({ statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to delete the product" });
        }
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.OK, true, 'Product deleted successfully');
    }
    catch (error) {
        return (0, helpers_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, `Error: ${error}`);
    }
};
exports.deleteProduct = deleteProduct;
