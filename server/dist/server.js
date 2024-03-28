"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Route Imports
const user_1 = __importDefault(require("./routes/user"));
const PORT = 3000;
const app = (0, express_1.default)();
// Routes
app.use("/api/user", user_1.default);
app.listen(PORT, () => {
    console.log('Server is running at: ' + PORT);
});
