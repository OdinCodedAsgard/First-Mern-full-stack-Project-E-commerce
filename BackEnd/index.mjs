import express from 'express';
import mongoose from 'mongoose';
import UserRouter from './Routes/user.routes.mjs';
import authRouter from './Routes/auth.route.mjs';
import listRouter from './Routes/listing.route.mjs';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import User from './Models/User.model.mjs';
import path from 'path'
const PORT = 3100;
const myApp= express();
dotenv.config();
myApp.use(cookieParser());
myApp.use(express.json());
myApp.use(cors({ origin: true, credentials: true }));
console.log(process.env.MONGO_STRING);

mongoose.connect(process.env.MONGO_STRING)
 .then(()=>{
    console.log("connected to db");

 })
 .catch((err)=>{
    console.log(err);
 });

 const __dirname = path.resolve();
myApp.get('/get/:id',(req,res)=>{
  const user = User.findById(req.params.id);
  res.send(user);
  });
myApp.use(UserRouter);
myApp.use(authRouter);
myApp.use(listRouter);

myApp.use(express.static(path.join(__dirname,'/Frontend/dist')));

myApp.get("*",(req,res)=>{
   res.sendFile(path.join(__dirname,"Frontend", "dist", "index.html"));
})
myApp.get('/',(req,res)=>{
   res.json({message:"r"});
})
myApp.use((err,req,res,next)=>{
   const errorCode = err.statusCode || 500;
   const errorMessage = err.message || "Internal Server Error";
   res.status(errorCode).json({
      success: false,
      errorCode,
      message: errorMessage
   })
});

myApp.listen(PORT,()=>{
    console.log("server is runnin catch it");
})