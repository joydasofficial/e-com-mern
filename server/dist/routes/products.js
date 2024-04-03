"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userTypeMiddleware_1 = require("../middleware/userTypeMiddleware");
const product_1 = require("../controllers/product");
const app = express_1.default.Router();
//route: /api/products/create 
app.post("/create", authMiddleware_1.authCheck, userTypeMiddleware_1.checkSeller, product_1.createProduct);
//route: /api/products/get 
app.get("/get", authMiddleware_1.authCheck, userTypeMiddleware_1.checkSeller, product_1.getProduct);
//route: /api/products/getAll
app.get("/getAll", product_1.getAllProduct);
//route: /api/products/delete
app.delete("/delete/:id", authMiddleware_1.authCheck, userTypeMiddleware_1.checkSeller, product_1.deleteProduct);
exports.default = app;
