import express from 'express';
import type { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth';
// import "./auth/google.js";
import cors from 'cors';
import { prisma } from './lib/prisma';

try {
const app = express()
app.use(express.json());

const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

prisma.$connect().then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.error("Error connecting to the database", err);
});
 

app.use(session({
    secret: "secret", resave: false, saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.get("/", (req: Request, res: Response) => {
    res.send("API is running");
})
    
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    
})
} catch (error) {
    console.error("Error starting the server", error);
}