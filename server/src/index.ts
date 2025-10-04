import express from 'express';
import type { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.js';
const app = express()

const PORT = process.env.PORT || 5000

app.use(session({
    secret: "secret", resave: false, saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.get("/",(req: Request, res: Response) => {
    res.send("API is running...")
})
    
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    
})