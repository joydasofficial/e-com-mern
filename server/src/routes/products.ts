import express from "express";
import { authCheck } from "../middleware/authMiddleware";
import { checkSeller } from "../middleware/userTypeMiddleware";
import { createProduct, deleteProduct, getAllProduct, getProduct } from "../controllers/product";

const app = express.Router();

//route: /api/products/create 
app.post("/create", authCheck, checkSeller, createProduct);

//route: /api/products/get 
app.get("/get", authCheck, checkSeller, getProduct)

//route: /api/products/getAll
app.get("/getAll", getAllProduct)

//route: /api/products/delete
app.delete("/delete/:id", authCheck, checkSeller, deleteProduct)

export default app;