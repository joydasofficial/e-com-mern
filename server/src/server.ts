import 'dotenv/config'
import express from 'express';

// Route Imports
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import productRoutes from './routes/products';

import { connectDB } from './util/dbconnection';
import { ErrorHandler } from './middleware/error';

const PORT = 3001;

const app = express();

app.use(express.json());

// DB Connection
connectDB();

// Route
app.get("/", (req, res)=>{
    res.send("API's are active")
});

// Auth Routes
app.use("/api/auth", authRoutes);

// User Routes
app.use("/api/user", userRoutes);

// Products Routes
app.use("/api/product", productRoutes);

// Error Handler
app.use(ErrorHandler);

app.listen(PORT, ()=>{
    console.log('Server is running at: ' + PORT);
})