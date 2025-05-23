import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { ContactMail } from "../routes/email.js";
import { errorHandler } from "../utils/errorhandler.js";

export const createListing = async(req,res,next)=>{
    try {
        
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
        
}


// delete listing by user
export const deleteListing = async(req,res,next)=>{
    try {
        
       const listing =  await Listing.findById(req.params.id);
       if (!listing) {
        return  next(errorHandler(400, 'listing not found'));
       }

       if(req.user.id !== listing.userRef){
        return next(errorHandler(400, 'You can delete only your listings'));
       }

        await Listing.findByIdAndDelete(req.params.id);
        return res.status(201).json('listing deleted success');
    } catch (error) {
        next(error)
    }
        
}



// delete listing by admin
export const deletePostAdmin = async(req,res,next)=>{
    try {
        
       const listing =  await Listing.findById(req.params.postId);
       if (!listing) {
        return  next(errorHandler(400, 'listing not found'));
       }

      if(req.user.admin){
           await Listing.findByIdAndDelete(req.params.postId);
           return res.status(200).json('listing deleted success');
      }
       if(req.user.id !== listing.userRef){
        return next(errorHandler(400, 'You can delete only your listings'));
       }
        else{
             await Listing.findByIdAndDelete(req.params.postId);
           return res.status(200).json('listing deleted success');
        }
    } catch (error) {
        next(error)
    }
        
}



export const UpdateListing = async(req,res,next)=>{
    try {
        
       const listing =  await Listing.findById(req.params.id);
       if (!listing) {
            return res.status(404).json('listing not found');
       }

    //    if(req.user.id !== listing.userRef){
    //     return  res.status(401).json('You can update only your listings')
    //    }

       const updatelisting = await Listing.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json(updatelisting);
    } catch (error) {
        next(error)
    }
        
}


export const getListing=async(req,res, next)=>{
    try{
    const listing = await Listing.find(({userRef: req.params.id}));
    if (!listing) {
      return  next(errorHandler(404, 'No Listing Found'));
        }
    res.status(201).json(listing);
            } catch (error) {
        next(error)
    }
}


export const getSingleListing=async(req,res, next)=>{
    try{
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return  next(errorHandler(404, 'No Listing Found'));
        }
    res.status(201).json(listing);
        } catch (error) {
        next(error)
    }
}



export const getadminlisting= async(req,res,next)=>{
    const limit = parseInt(req.query.limit) || 9;
    const searchIndex = parseInt(req.query.searchIndex) || 0;

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false'){
        parking = {$in: [true, false]}
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false'){
        furnished = {$in: [true, false]}
    }

    let type = req.query.type;
    if(type === undefined || type === 'all'){
        type = {$in: ['sale', 'rent']}
    }

  try {
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';



        
        const listing = await Listing.find({
            name:{$regex: searchTerm, $options:'i'},
            type,
            furnished,
            parking,
            
        } ).sort( {[sort]:order} ).limit(limit).skip(searchIndex);
        
        return res.status(200).json(listing);

    } catch (error) {
       next(error) 
    }
}
export const getSearchListings= async(req,res,next)=>{
    const limit = parseInt(req.query.limit) || 9;
    const searchIndex = parseInt(req.query.searchIndex) || 0;

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false'){
        parking = {$in: [true, false]}
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false'){
        furnished = {$in: [true, false]}
    }

    let type = req.query.type;
    if(type === undefined || type === 'all'){
        type = {$in: ['sale', 'rent']}
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';


    try {
        
        const listing = await Listing.find({
            name:{$regex: searchTerm, $options:'i'},
            type,
            furnished,
            parking,
            
        } ).sort( {[sort]:order} ).limit(limit).skip(searchIndex);
        
        return res.status(200).json(listing);

    } catch (error) {
       next(error) 
    }
}


// sending contact details to seller or buyer 
export const sendContactDetails = async(req,res,next)=>{
    try {
        const {email, username, phone, message} = req.body;
        if( !phone || !message){
            return next(errorHandler(400, 'Please fill all the fields'));
        }

        ContactMail(email.toUpperCase(), username.toUpperCase(), phone.toUpperCase(), message.toUpperCase());
        res.status(200).json('Message Sent Successfully');
    } catch (error) {
        next(error)
    }
        
}
