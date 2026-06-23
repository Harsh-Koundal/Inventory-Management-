import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { flattenError, success } from "zod";

import connectionDB from "./config/dbConnection.js";
import { createDefaultAdmin } from "./controllers/createDefaultAdmin.js";
import authRoutes from "./routes/authRoute.js";


dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,

    })
);

app.use(morgan("dev"));

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Inventory Management API Running",
    });
});

// routes 
app.use("/api/auth",authRoutes);

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route Not Found",
    });
});

app.use((err,req,res,next)=>{
    console.error(err);

    res.status(err.statusCode || 500).json({
        success:false,
        message:err.message || "Internal Server Error",
    });
});

// Data base connection 
await connectionDB();
// create default admin
await createDefaultAdmin();

app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
})


