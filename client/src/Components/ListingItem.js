import React from 'react';
import {MdLocationOn} from 'react-icons/md'
import { Link } from 'react-router-dom';

export default function ListingItem({ listing}) {
  return (
    <Link to={`/listing/${listing._id}`}>
    <div className='flex flex-col border border-slate-300 rounded-lg justify-center w-60 lg:w-60'> 
       
            <img src={listing.imageUrl[0]} alt="image" className='w-[100%] max-h-[25vh] rounded-md hover:scale-105 duration-500  sm:max-h-[22vh]  lg:max-h-[16vh]  '  />
        
        <div className='pl-6 pr-6'>
        <div>
            <h6 className='truncate w-44 font-semibold text-lg mb-1 my-4 mx-1 uppercase sm:w-44 lg:w-44 lg:text-base'>{listing.name}</h6>
        </div>
        <div className='flex flex-row mb-1 items-center gap-1'>
          <MdLocationOn  className='text-green-600 ' />
          <p className='truncate w-44 text-sm font-semibold lg:w-44'>{listing.address}..</p>
        </div>
        <div className='flex flex-col  gap-1 text-sm font-semibold'>
          <p className='truncate w-44  lg:w-44 '>{listing.description}</p>
         
          <p className='truncate w-44 text-slate-700 font-semibold text-lg '>
         {listing.type==='rent'? '₹ '+(listing.regularprice)+'K month': '₹ '+(listing.regularprice)+' Lacs'}
          </p>
         
        </div>
             <div className='flex flex-row gap-2 w-44 text-sm font-semibold items-center mb-1'>
              <p>{listing.bedrooms} beds</p>
              <p>{listing.bathrooms} baths</p>
            </div>
            <p className='truncate w-44 text-slate-700 mb-3 font-semibold text-sm '>
           Date: {new Date(listing.createdAt).toLocaleDateString()}
          </p>
        </div>
    </div>
                  </Link>
  )
}
