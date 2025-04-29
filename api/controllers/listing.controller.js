import Listing from "../models/listing.model.js"

export const createListing = async(req,res,next)=>{
    try {
        
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
        
}


export const deleteListing = async(req,res,next)=>{
    try {
        
       const listing =  await Listing.findById(req.params.id);
       if (!listing) {
            return res.status(404).json('listing not found');
       }

       if(req.user.id !== listing.userRef){
        return  res.status(401).json('You can delete only your listings')
       }

        await Listing.findByIdAndDelete(req.params.id);
        return res.status(201).json('listing deleted success');
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


export const getListing=async(req,res)=>{
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return res.status(404).json('listing not found');
        
    }
    
    res.status(201).json(listing);
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