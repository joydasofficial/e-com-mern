import 'dotenv/config'
import express from 'express';

// Route Imports
import authRoute from './routes/auth';
import userRoute from './routes/user';
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
app.use("/api/auth", authRoute);

// User Routes
app.use("/api/user", userRoute);

// Error Handler
app.use(ErrorHandler);

app.listen(PORT, ()=>{
    console.log('Server is running at: ' + PORT);
})