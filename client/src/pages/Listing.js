import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair, 
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../Components/Contact';


export default function Listing() {
    SwiperCore.use([Navigation]);
    
    const [listing, setlisting] = useState(null);
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(false);
    const [copied, setCopied] = useState(false); 
    const [contact, setcontact] = useState(false); 
    const { currentUser } = useSelector((state) => state.user);

    const params = useParams();
    useEffect(() => {
      
        const fetchListing= async()=>{

          try {
            
            setloading(true);
            const res = await fetch(`/api/listing/getsinglelisting/${params.listingId}`);
            const data = await res.json();
            
            if (data.success === false) {
              seterror(true)
              setloading(false);
              
            }
            setlisting(data);
            seterror(false)
            setloading(false);
          } catch (error) {
            seterror(true)
            setloading(false);
            
          }
        }
    fetchListing();
    },[params.listingId])
    
  return (
    <div>
      {loading && <p className='text-center text-2xl'>Loading...</p>}
      {error &&  <p className='text-center text-2xl'>Something Went Wrong</p>} 
        {listing && !loading && !error &&
       (
           <div>
             <Swiper navigation>
            {listing && listing.imageUrl.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
        <FaShare
          className='text-slate-500'
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>
      {copied && (
        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
          Link copied!
        </p>
      )}
      <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
        <p className='text-2xl font-semibold'>
          {listing.name} -
          {listing.type === 'sale' ? `₹ ${listing.regularprice} 'lac'`: `$ ${listing.regularprice}` }
          {listing.type === 'rent' && ' / month'}
         
        </p>
        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
          <FaMapMarkerAlt className='text-green-700' />
          {listing.address}
        </p>
        <div className='flex gap-4'>
          <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
          {listing.offer && (
            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              ${+listing.regularPrice - +listing.discountPrice} OFF
            </p>
          )}
        </div>
        <p className='text-slate-800'>
          <span className='font-semibold text-black'>Description - </span>
          {listing.description}
        </p>
        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaBed className='text-lg' />
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Beds `
              : `${listing.bedrooms} Beds `}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaBath className='text-lg' />
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths `
              : `${listing.bathrooms} bath `}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaParking className='text-lg' />
            {listing.parking ? 'Parking spot' : 'No Parking'}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaChair className='text-lg' />
            {listing.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>

    {!currentUser && 
        <>
        <p className='bg-red-700 text-white rounded-lg uppercase hover:opacity-95 p-2 text-center mt-3'>
          Please <Link to={'/signin'} className='text-white underline px-2'>Login</Link> to contact the owner
          </p></>}

        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setcontact(true)}
            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
          >
            Contact Owner
          </button>
        )}
      {contact && <Contact listing={listing} />}
      </div>
    </div>
     
    )}
    </div>
)}
        
