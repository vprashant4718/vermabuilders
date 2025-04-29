import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../Components/ListingItem";
import LoadingBar from 'react-top-loading-bar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


export default function Home() {
  // SwiperCore.use([Navigation]);

  const [saleListing, setsaleListing] = useState([]);
  const [rentListing, setrentListing] = useState([]);
  const [progress, setProgress] = useState([]);


  useEffect(() => {
    const fetchSaleListing = async () => {
      try {
        setProgress(30);
        
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setProgress(50);
        setsaleListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListing = async () => {
      try {
        setProgress(75);
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setProgress(100);
        setrentListing(data);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchSaleListing();
  }, []);

  return (
    <div className="pt-24"> 
     <LoadingBar
        height={5}
        color='#1F51FF' progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="p-3">
        <h1 className="text-3xl font-bold">
          Find Your
          <span className="text-slate-500"> Dream Home</span>
          <br />
          with Verma Builders
        </h1>
        <br />
        <p className="text-slate-600 font-semibold text-sm lg:w-[70vw]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, et.
          Velit omnis distinctio iste soluta similique ducimus facere dolor
          odit, id aspernatur, perspiciatis repudiandae doloribus voluptates
          reprehenderit eos qui nam. d.
        </p>

        <Link to={`/search`} className="text-lg font-semibold text-blue-900">
          Let's start now...
        </Link>
      </div>

      {/* <div>
        <Swiper navigation>
          {rentListing &&
            rentListing.length > 0 &&
            rentListing.map((url) => (
              <SwiperSlide className="flex flex-row justify-center items-center m-auto  w-auto" >
                <img src={url.imageUrl[0]} key={url} className="object-contain m-auto w-auto max-h-[70vh]" />
              </SwiperSlide>
            ))}
        </Swiper>
      </div> */}


<div>
  <Swiper
    key={rentListing.length} // ✅ Force re-render when listings load
    modules={[Navigation, Autoplay]}
    navigation
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    loop={true}
  >
    {rentListing &&
      rentListing.length > 0 &&
      rentListing.map((url) => (
        <SwiperSlide
          key={url._id || url.imageUrl[0]}
          className="flex flex-row justify-center items-center m-auto w-auto"
        >
          <img
            src={url.imageUrl[0]}
            alt="Property"
            className="object-contain m-auto w-auto max-h-[70vh]"
          />
        </SwiperSlide>
      ))}
  </Swiper>
</div>


      {/* Listings on homepage after swiper  */}
       <div className="flex flex-col gap-12 mb-12 mt-10">
        <div className="flex flex-col pr-5 pl-5 gap-3 lg:flex-row  items-center"> 
          <div className="flex flex-col gap-1 bg-slate-800 p-4" style={{border: 'solid',color: 'white',
    borderRadius: '0px 70px 70px 0px'}}>
            <h1 className="text-3xl font-bold text-white sm:text-2xl">Properties For Sale</h1>
            <Link to={`/search?type=sale`} >
              <span className="text-sm font-semibold   text-white">
                See More Sale Properties...
              </span>
            </Link>
          </div>
          <div className="flex flex-row gap-3 justify-center items-center flex-wrap">
            {saleListing &&
              saleListing.map((listing) => <ListingItem listing={listing} />)}
          </div>
        </div>
        <hr />
        <div className="flex flex-col pr-5 pl-5  gap-3 lg:flex-row  items-center">
          <div className="flex flex-col gap-1 bg-slate-800 p-4" style={{border: 'solid',color: 'white',
    borderRadius: '0px 70px 70px 0px'}}>
            <h1 className="text-3xl font-bold sm:text-2xl ">Properties For Rent</h1>
            <Link to={`/search?type=rent`}>
              <span className="text-sm font-semibold text-white">
                See More Rent Properties...
              </span>
            </Link>
          </div>
          <div className="flex flex-row gap-3 justify-center items-center flex-wrap">
            {rentListing &&
              rentListing.map((listing) => <ListingItem listing={listing} />)}
          </div>
        </div>
      </div> 
    </div>
  );
}
