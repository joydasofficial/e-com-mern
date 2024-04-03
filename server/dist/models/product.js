"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model("Product", schema);
