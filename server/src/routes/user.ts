import express from "express";
import { createUser, getProfile } from "../controllers/user";

const app = express.Router();

//route: /api/user/create 
app.post("/create", createUser);

//route: /api/user/profile 
app.get("/profile", getProfile)


export default app;