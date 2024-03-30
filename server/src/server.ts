import 'dotenv/config'
import express from 'express';

// Route Imports
import userRoute from './routes/user';
import { connectDB } from './util/dbconnection';

const PORT = 3001;

const app = express();

app.use(express.json());

// DB Connection
connectDB();

// Route
app.get("/", (req, res)=>{
    res.send("API's are active")
});

// User Routes
app.use("/api/user", userRoute);

app.listen(PORT, ()=>{
    console.log('Server is running at: ' + PORT);
})