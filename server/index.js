import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import setupSwagger from './config/swaggerConfig.js';
import userRoutes from './routes/user.js'
dotenv.config();

const app =express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT =process.env.PORT || 5000;
connectDB();

setupSwagger(app)
app.get('/',(req,res)=>{
    res.send('API is runing');
});

app.use('/api',userRoutes)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});