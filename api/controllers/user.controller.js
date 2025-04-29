import { errorHandler } from "../utils/errorhandler.js"
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from "../models/listing.model.js";

export const userUpdate =async (req,res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(403, 'You can only change your own account'));

    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar : req.body.avatar
        }},{new: true});
        
        const {password, ...rest} = updateUser._doc;
        
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
    }




export const userDelete =async (req,res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(403, 'You can only change your own account'));

    try {
        await User.findByIdAndDelete(req.params.id); 
        res.clearCookie("access_token");
        res.status(200).json('user delete successfully');

    } catch (error) {
        next(error);
    }
        
}


export const userListing= async(req,res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(403, 'You can only check your listing'));

    try {
       const listings = await Listing.find({userRef: req.params.id}); 
        res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
        
}


export const getUser =async(req, res, next)=>{
    try {
        
     const user = await User.findById(req.params.id);

     if (!user) {
        return res.status(404).json('User Not Found');
    }
    
    const {password: pass, ...rest} = user._doc;
    res.status(200).json(rest);

    } catch (error) {
     next(error)   
    }
}
