"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const app = express_1.default.Router();
//route: /api/user/create 
app.post("/create", user_1.createUser);
//route: /api/user/profile 
app.get("/profile", user_1.getProfile);
exports.default = app;
