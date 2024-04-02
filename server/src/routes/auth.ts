import express from "express";
import { login, logout, token } from "../controllers/auth";

const app = express.Router();

//route: /api/auth/login
app.post("/login", login);

//route: /api/auth/token
app.post("/token", token)

//route: /api/auth/logout
app.get("/logout", logout)

export default app;