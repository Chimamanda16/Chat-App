import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from "path";
import cookieParser from 'cookie-parser';

import authRoutes from '../routes/auth.route.js';
import messageRoutes from '../routes/message.route.js';
import { connectDB } from '../lib/db.js';
import { app, server } from "../lib/socket.js";

dotenv.config();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    });
}

server.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});