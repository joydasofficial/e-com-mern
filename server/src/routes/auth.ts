import express from "express";
import { login, token } from "../controllers/auth";

const app = express.Router();

//route: /api/auth/login
app.post("/login", login);

//route: /api/auth/token
app.post("/token", token)

export default app;