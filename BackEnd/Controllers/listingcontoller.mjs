import { errorHandler } from "../Utils/errorHandler.mjs"
import Listing from "../Models/listing.model.mjs"

export const createlisting = async (req,res,next)=>{
    try{
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    }catch(error){
        next(errorHandler(400,error.message))
    }
}

export const deleteListing = async(req,res,next)=>{
    const lisiting = await  Listing.findById(req.params.id);
    if(!lisiting ){
        return next(errorHandler(400,"No such listings exists"));
    }
    if(req.user.id !== lisiting.userReference) {
        return next(errorHandler(403,'You are not authorized to perform this action'));
    }
    try{
        await Listing.findByIdAndDelete(req.params.id)
        res.json({status:"deleted successfully"});
        return;
    }catch(err){
        console.log(err.message);
        next(errorHandler(404,err.message))
    }
}
export const updateListing = async (req,res,next)=> {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,"Listing not found"));
    }
    if(req.user.id !== listing.userReference){
        return next(errorHandler(401,"Cannot edit the  listing as you did not create it"));
    }
    try{
    const  updatedListing=await Listing.findByIdAndUpdate(req.params.id, req.body ,{new:true});
    res.status(200).json({updatedListing});
    }catch(err){
        next(errorHandler(400,err.message));
    }
}

export const getListing = async (req,res,next)=>{
    try{
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return next(errorHandler(404,"No Such Listing Exists"));
        }
        res.status(200).json({listing});
    } catch(err){
        console.log(err.message);
        next(errorHandler(500, err.message));
    }
}
export const getAllListings =async(req,res,next)=>{
    try{
        const limit = parseInt(req.query.limit) || 3;
        const startIndex = parseInt(req.query.startIndex) ||0;
        let offer = req.query.offer;
        if(offer === undefined|| offer === false){
            offer = {$in : [false,true]};
        }
        let parking = req.query.parking;
        if(parking === undefined|| parking === false){
            parking = {$in : [false,true]};
        }
        let furnished = req.query.furnished;
        if(furnished === undefined|| furnished === false){
            furnished = {$in : [false,true]};
        }
        let type = req.query.type;
        if(type === undefined|| type === 'all'){
            type = {$in : ['rent','sale']};
        }
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order ||'desc';
        const listings = await Listing.find({
            name:{$regex : searchTerm, $options:  "i" },
            offer,
            furnished,
            parking,
            type,  
        }).sort({[sort]:order}).skip(startIndex).limit(limit);
        return res.status(200).json({listings});
    }catch(error){
        next(errorHandler(500, error.message));
    }
}