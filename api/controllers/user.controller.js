import { errorHandler } from "../utils/errorhandler.js"
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from "../models/listing.model.js";


//update user from profile page
export const userUpdate = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You can only change your own account'));
  }

  try {
    // Check for duplicate username
    if (req.body.username) {
      const existingUser = await User.findOne({
        username: req.body.username,
        _id: { $ne: req.params.id }, // Exclude current user
      });
      if (existingUser) {
        return next(errorHandler(400, 'Username already exists'));
      }
    }

    // Check for duplicate email
    if (req.body.email) {
      const existingEmail = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id }, // Exclude current user
      });
      if (existingEmail) {
        return next(errorHandler(400, 'Email already exists'));
      }
    }

    // Hash password if present
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


//Update User Password
export const userPasswordUpdate =async (req,res, next)=>{
        try {
            const {email, password} = req.body;
        if(password){
           const hashedPassword = bcryptjs.hashSync(password, 10);
    
        await User.findOneAndUpdate({email},{
        $set:{
            password: hashedPassword,
        }},{new: true});
            
        res.status(201).json('user password reset Success');
        }
    } catch (error) {
        next(error)
    }
    }




//delete user permanently
export const userDelete =async (req,res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(403, 'You can only change your own account'));

    try {
        await Listing.deleteMany({ userRef: req.params.id });

        await User.findByIdAndDelete(req.params.id); 
        res.clearCookie("access_token");
        res.status(200).json('user delete successfully');

    } catch (error) {
        next(error);
    }
        
}

//listing done by an user
export const userListing= async(req,res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(403, 'You can only check your listing'));

    try {
       const listings = await Listing.find({userRef: req.params.id}); 
        res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
        
}

//Getting user Details
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
