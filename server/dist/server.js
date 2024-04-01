"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
// Route Imports
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const dbconnection_1 = require("./util/dbconnection");
const PORT = 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// DB Connection
(0, dbconnection_1.connectDB)();
// Route
app.get("/", (req, res) => {
    res.send("API's are active");
});
// Auth Routes
app.use("/api/auth", auth_1.default);
// User Routes
app.use("/api/user", user_1.default);
app.listen(PORT, () => {
    console.log('Server is running at: ' + PORT);
});
