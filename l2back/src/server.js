import express from 'express';

import cors from 'cors';
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import workLogRoutes from "./routes/workLogRoutes.js";

import dotenv from 'dotenv';
dotenv.config();

const app=express();

// app.use(cors({
//     origin:"http://localhost:5173"
// }))

app.use(cors({
    origin:"https://baalcut.com"
}))

app.use(express.json());

app.use("/", authRoutes);
app.use("/", employeeRoutes);
app.use("/", attendanceRoutes);
app.use("/", workLogRoutes);

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
}); 