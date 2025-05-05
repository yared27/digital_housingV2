import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();

const app =express();
connectDB();
app.use(express.json());

const PORT =process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('API is runing');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});