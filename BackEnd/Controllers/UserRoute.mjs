import User from "../Models/User.model.mjs";
import { errorHandler } from "../Utils/errorHandler.mjs";
import bcryptjs from 'bcryptjs';
import Listing from '../Models/listing.model.mjs';

export const userRouteHandler=(req, res) => {
    res.json({
       message:"hello Arsh!"}
    );
}

export const updateUserController = async (req,res,next)=>{
    console.log(req.user.id);
    if(req.user.id !== req.params.id) return next(errorHandler(401,"cannot update acount of other person"));
    try{
     if (req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password,11);
     }
     const updateUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar        
        }
     },{new:true})
     console.log(updateUser);
     const {password,...rest} = updateUser._doc;
     return res.status(200).json(rest);
    }
    catch(error){
      console.log(error);
    }
}
export const deleteUserController = async (req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, "cannot delete account of other person"));
    }
    try{
      await User.findByIdAndDelete(req.params.id);
     res.clearCookie('access_token').status(200).json({message:"user has been deleted"});
    }
    catch(err){
        next(errorHandler(401,"cannot delete the given user"));

    }
}
export const signout = (req,res)=>{
    try{
        res.clearCookie("access_token").status(200).json({message:"User has been loged out"})
    }catch(error){
        next(errorHandler(400, error));
    }
}
export const getUserListings = async(req,res,next)=>{
  if(req.user.id === req.params.id){
    try{
const listing = await  Listing.find({userReference: req.params.id});
      res.status(200).json(listing);
    }catch(error){
        next(error)
    }
  }else{
    return next(errorHandler(401,'Unauthorized access can Only edit/view your own listings.'));
  }
}
export const getUserInfo = async (req,res,next)=>{
    try{
 const userInfo = await User.findById(req.params.id);
 if(!userInfo){
    next(errorHandler(404,"User not found"));
 }
 const {password:thepass, ...others} = userInfo._doc;
  res.status(200).json({others});
}catch(err){
    next(errorHandler(400,err.message));
}
}