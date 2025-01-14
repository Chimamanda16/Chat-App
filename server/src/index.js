import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/auth.route.js';
import messageRoutes from '../routes/message.route.js';
import { connectDB } from '../lib/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});