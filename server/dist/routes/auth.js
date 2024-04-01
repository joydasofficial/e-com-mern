"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const app = express_1.default.Router();
//route: /api/auth/login
app.post("/login", auth_1.login);
//route: /api/auth/token
app.post("/token", auth_1.token);
exports.default = app;
