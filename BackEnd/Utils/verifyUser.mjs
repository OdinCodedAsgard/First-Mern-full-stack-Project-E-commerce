import { errorHandler } from "./errorHandler.mjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req,res,next)=>{

    const token = req.cookies.access_token;
  
    if(!token){
        return next(errorHandler(401, "No token provided"));
    }
    jwt.verify(token,process.env.YOUR_STRING,(err,user)=>{
        if(err){
            next(errorHandler(403,err.message));
            return;  
        }
       req.user = user;
       next();
    });
}