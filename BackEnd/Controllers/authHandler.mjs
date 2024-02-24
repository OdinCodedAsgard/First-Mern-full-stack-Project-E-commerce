import User from "../Models/User.model.mjs";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../Utils/errorHandler.mjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const authHandler = async (req,res,next) => {
    const {username,password,email} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,password:hashedPassword,email});
    try{
    await newUser.save();
    const token = jwt.sign({id: newUser._id},process.env.YOUR_STRING); 
     res.status(201).cookie("access_token",token).json({token:token,newUser});
     req.user = User;
    }
    catch(err){
        next(errorHandler(440,err.message));      
}
};
export const signIn = async(req,res,next)=>{
    const {email ,password}=req.body;
    try{
    const validateEmail = await User.findOne({email});
    if(!validateEmail) return next(errorHandler(404,'Invalid email'));
    const comparePassword =bcryptjs.compareSync(password,validateEmail.password);
    if (!comparePassword) return next(errorHandler(404,'Invalid credentials'));
    const token = jwt.sign({id:validateEmail._id},process.env.YOUR_STRING,{
        expiresIn:'10d'
    });
    const {password:pass, ...otherData}= validateEmail._doc
    res.cookie("access_token",token,{sameSite : 'none', secure: false}).json({auth:"succesfully logged in",otherData}).end()
    }
     catch(error){
        next(error);
    }
}
export const GoogleSignIn =async (req,res,next)=>{
try{
const finduser = await User.findOne({email:req.body.email});
if(finduser){
    const token=jwt.sign({id:finduser._id},process.env.YOUR_STRING);
    const {password:pass,...rest}=finduser._doc;
    res.cookie('access_token',token,{sameSite : 'none', secure: true}).status(200).send(rest);
}else{
 const generatePassword = Math.random().toString(36).slice(-8)
 const HAshPword = bcryptjs.hashSync(generatePassword,10);
 const newGuser= new User({username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-3),password:HAshPword,email:req.body.email,avatar:req.body.photoURL});
 await newGuser.save();
 const token = jwt.sign({id:newGuser._id},process.env.YOUR_STRING);
 const { password: pass, ...others } = newGuser._doc;
 res.cookie("access_token", token, { httpOnly: true }).status(200).json({others}).end();
}
}

catch(error){
next(error)
}
}