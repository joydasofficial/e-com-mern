import express from 'express';

// Route Imports
import userRoute from './routes/user';

const PORT = 3000;

const app = express();

// Routes
app.use("/api/user", userRoute);

app.listen(PORT, ()=>{
    console.log('Server is running at: ' + PORT);
})