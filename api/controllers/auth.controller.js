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
    const emailLower = email.replace(/\s+/g, '').toLowerCase();
    console.log(emailLower);
    const validEmail  = validator.isEmail(emailLower);
    if(!validEmail){ return  next(errorHandler(400, 'Enter a Valid Email !')); }

    //const hashOTP = bcryptjs.hashSync(Verification, 10);
    const isEmailExist = await User.findOne({emailLower});
    
    if(isEmailExist){ return next(errorHandler(409, 'User Already Exist with same Email !')); }

    else{
       const random4Digit = Math.floor(1000 + Math.random() * 9000);
       const random4Digit2 = Math.floor(1000 + Math.random() * 9000);
      OtpMail(emailLower);
      res.cookie('hash',`${random4Digit}`+ Verification+`${random4Digit2}`, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });// 15 minutes 
      res.json({ success: true, message: "OTP sent!" });
         }
     
        
    } catch (error) {
      next(error);
    }
};

export const validateOtp = async (req, res, next)=>{
  try {
    const {email,otp} = req.body;
    const hashedOtp = req.cookies.hash;
    // const validOtp = bcryptjs.compareSync(otp, hashedOtp);
    const firstSixDigits = parseInt(hashedOtp.toString().slice(4, 10));
if(otp != firstSixDigits){return next(errorHandler(401, 'Wrong Otp !')); }
    
  if(otp === firstSixDigits){ res.status(200).json('otp is correct') }
        
    } catch (error) {
      next(error);
    }
};


export const signup = async (req, res, next)=>{
    const { username, email, password } = req.body;
    const isEmailExist = await User.findOne({email});
  
  if(username === ""){
      return next(errorHandler(401, 'Enter Your Username'));
  }
    
    if(isEmailExist){ return next(errorHandler(409, 'User Already Exist with same Email !')); }
  
    if(password === ""){
      return next(errorHandler(401, 'Create a new password !'));
    }
    if(password.length < 5){
      return next(errorHandler(401, 'Password should be manimum length is 5 !'));
    }
    const hashedpassword = bcryptjs.hashSync(password, 10);
  
    const newUser = new User({username, email, password:hashedpassword});
    
    try {
     
        await newUser.save(); 
        res.status(201).json('user created successfully'); 
        
    } catch (error) {
      next(error);
    }
};


// sign in functionality 
export const signin = async(req, res, next)=>{
  const { email, password } = req.body;
  try {
    
    const validUser = await User.findOne({email});
    if(!validUser){ next(errorHandler(404, 'User not found !')); }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword){ next(errorHandler(401, 'Wrong Email or Password !')); }
    
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
     
    

   res.cookie('access_token', token,{httpOnly : true})
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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
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
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
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
