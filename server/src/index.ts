import express from 'express';
// Fix for missing type declarations for 'cors'
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/mongoose';
import './auth/passport';
import  {env} from './config/env';
import healthRouter from './routes/health';
// import propertiesRouter from './routes/properties';
import  authRouter from './routes/auth';
import propertyRouter from './routes/properties';
import userRouter from './routes/users';
import uploadRouter from './routes/uploads';
// import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(helmet());

app.use(passport.initialize());

const allowedOrigins = [
    env.CLIENT_URL,
    "https://digital-housingv2.vercel.app",
    "https://digital-housing-v2-phrq8a2p0-yared27s-projects.vercel.app",
    "https://digital-housing-v2-luz3zwq4x-yared27s-projects.vercel.app/"
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

app.get('/', (_, res) => res.redirect('/api/health'));
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/properties', propertyRouter);
// app.use('/api/properties', propertiesRouter);
app.use('/api/users', userRouter);

app.use('/api/uploads', uploadRouter);
const start = async () => {
    await connectDB(env.MONGODB_URI);
    app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`);
    });
}
start().catch((err) => {
    console.error('Failed to start the server:', err);
    process.exit(1);
});