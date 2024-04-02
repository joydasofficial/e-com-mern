import express from "express";
import { createUser, getProfile } from "../controllers/user";
import { authCheck } from "../middleware/authMiddleware";

const app = express.Router();

//route: /api/user/create 
app.post("/create", createUser);

//route: /api/user/profile 
app.get("/profile", authCheck, getProfile)


export default app;