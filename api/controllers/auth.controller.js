import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {errorHandler} from '../utils/errorhandler.js';
import OtpMail, { Verification } from "../routes/email.js";
import validator from 'validator';

dotenv.config();


export const email = async (req, res, next)=>{
  try {
    const {email} = req.body;;
    console.log(email);
    const validEmail  = validator.isEmail(email);
    if(!validEmail){ return  next(errorHandler(400, 'Enter a Valid Email !')); }

    const hashOTP = bcryptjs.hashSync(Verification, 10);
    const isEmailExist = await User.findOne({email});
    
    if(isEmailExist){ return next(errorHandler(409, `User Already Exist ${email}`)); }



    else{
      OtpMail(email);
      res.cookie('hash', hashOTP, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });// 15 minutes 
      res.json({ success: true, message: "OTP sent!" });
         }
     
        
    } catch (error) {
      next(error);
    }
};




export const validateOtp = async (req, res, next)=>{
  try {
    const {email,hash} = req.body;
    const hashedOtp = req.cookies.hash;
    const validOtp = bcryptjs.compareSync(hash, hashedOtp);
    if(!validOtp){ next(errorHandler(401, 'Wrong Otp !')); }
  else{
    res.status(200).json('otp is correct');
  }

    } catch (error) {
      next(error);
    }
};



//forgot password reset 
export const Forgot = async (req, res, next)=>{
  try {
    const {email} = req.body;;
    console.log(email);
    const validEmail  = validator.isEmail(email);
    if(!validEmail){ return  next(errorHandler(400, 'Enter a Valid Email !')); }

    const hashOTP = bcryptjs.hashSync(Verification, 10);
    const isEmailExist = await User.findOne({email});
    
    if(!isEmailExist){ return next(errorHandler(409, `No User Found `)); }



    else{
      OtpMail(email);
      res.cookie('hashed', hashOTP, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });// 15 minutes 
      res.json({ success: true, message: "OTP sent!" });
         }
     
        
    } catch (error) {
      next(error);
    }
};




export const validateForgotOtp = async (req, res, next)=>{
  try {
    const {email,hash} = req.body;
    const hashedOtp = req.cookies.hashed;
    const validOtp = bcryptjs.compareSync(hash, hashedOtp);
    if(!validOtp){ next(errorHandler(401, 'Wrong Otp !')); }
  else{
    res.status(200).json('otp is correct');
  }

    } catch (error) {
      next(error);
    }
};


export const signup = async (req, res, next)=>{
  try {
    const { username, email, password } = req.body;
    const isUserExist = await User.findOne({username});
    const isEmailExist = await User.findOne({email});
  
  if(username === ""){
      return next(errorHandler(401, 'Enter Your Username'));
  }
    
    if(isUserExist){ return next(errorHandler(409, 'Username Already taken !')); }
    if(isEmailExist){ return next(errorHandler(409, 'User Already Exist with same Email !')); }
  
    if(password === ""){
      return next(errorHandler(401, 'Create a new password !'));
    }
    if(password.length < 5){
      return next(errorHandler(401, 'Password should be manimum length is 5 !'));
    }
    const hashedpassword = bcryptjs.hashSync(password, 10);
  
    const newUser = new User({username, email, password:hashedpassword});

    

        await newUser.save(); 
        res.status(201).json('user created successfully'); 

    } catch (error) {
      next(error);
    }
};


// sign in functionality 
export const signin = async(req, res, next)=>{
 try {
    const { email, password } = req.body;
    const validUser = await User.findOne({email});
    if(!validUser){ next(errorHandler(404, 'User not found !')); }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword){ next(errorHandler(401, 'Wrong Email or Password !')); }

    const token = jwt.sign({ id: validUser._id, admin:validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res.cookie('access_token', token,{httpOnly : true, 
          secure: true,         // required for SameSite=None
          sameSite: "none",     // allow cross-site cookies
          maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json(rest);
} catch (error) {
  next(error);
}
};


export const google = async(req, res, next)=>{
    try {
      const user = await User.findOne({email: req.body.email});

      if(user){
        const token = jwt.sign({ id: user._id, admin:user.isAdmin }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;

        res.cookie('access_token', token,{httpOnly : false})

        .status(200)
        .json(rest);
      }
      else{
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const hashedpassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({username: req.body.name, email:req.body.email, password:hashedpassword, avatar:req.body.photo});
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, admin:newUser.isAdmin }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res.cookie('access_token', token,{httpOnly : false})

        .status(200)
        .json(rest);

      }
    } catch (error) {
      next(error)
    }


}

export const signOut =async (req,res, next)=>{
  try {
   res.clearCookie("access_token");
   res.status(200).json('user sign out successfully');

} catch (error) {
   next(error);
}

}
