import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
    
    const [formdata, setformdata] = useState(null);
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
            const res = await fetch(`/api/listing/getlisting/${params.listingId}`);
            const data = await res.json();
            
            if (data.success === false) {
              seterror(true)
              setloading(false);
              
            }
            setformdata(data);
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
        {formdata && !loading && !error &&
       (
           <div>
             <Swiper navigation>
            {formdata && formdata.imageUrl.map((url) => (
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
          {formdata.name} -
          {formdata.type === 'sale' ? `₹ ${formdata.regularprice} 'lac'`: `$ ${formdata.regularprice}` }
          {formdata.type === 'rent' && ' / month'}
         
        </p>
        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
          <FaMapMarkerAlt className='text-green-700' />
          {formdata.address}
        </p>
        <div className='flex gap-4'>
          <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
            {formdata.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
          {formdata.offer && (
            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              ${+formdata.regularPrice - +formdata.discountPrice} OFF
            </p>
          )}
        </div>
        <p className='text-slate-800'>
          <span className='font-semibold text-black'>Description - </span>
          {formdata.description}
        </p>
        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaBed className='text-lg' />
            {formdata.bedrooms > 1
              ? `${formdata.bedrooms} Beds `
              : `${formdata.bedrooms} Beds `}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaBath className='text-lg' />
            {formdata.bathrooms > 1
              ? `${formdata.bathrooms} baths `
              : `${formdata.bathrooms} bath `}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaParking className='text-lg' />
            {formdata.parking ? 'Parking spot' : 'No Parking'}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaChair className='text-lg' />
            {formdata.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>
        {currentUser && formdata.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setcontact(true)}
            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
          >
            Contact landlord
          </button>
        )}
      {contact && <Contact formdata={formdata} />}
      </div>
    </div>
     
    )}
    </div>
)}
        
     
        
     

