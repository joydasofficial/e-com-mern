import express from "express";
import { createUser } from "../controllers/user";

const app = express.Router();

//route: /api/user/new 
app.post("/new", createUser)

export default app;