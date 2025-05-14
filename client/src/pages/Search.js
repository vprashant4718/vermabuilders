import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import ListingItem from '../Components/ListingItem'; 
import { IoAddCircleOutline } from "react-icons/io5";
import LoadingBar from 'react-top-loading-bar';

export default function Search() {
  
  const navigate = useNavigate();
  const [sideBarData, setsideBarData] = useState({
    searchTerm:'',
    type:'all',
    furnished:false,
    parking:false,
    sort:'created_at',
    order:'desc'
  });
  const [listings, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setshowMore] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const searchUrlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = searchUrlParams.get('searchTerm');
    const parkingFromUrl = searchUrlParams.get('parking');
    const furnishedFromUrl = searchUrlParams.get('furnished');
    const orderFromUrl = searchUrlParams.get('order');
    const sortFromUrl = searchUrlParams.get('sort');
    const typeFromUrl = searchUrlParams.get('type');
    if(
      searchTermFromUrl ||
      furnishedFromUrl ||
      parkingFromUrl ||
      typeFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ){
      setsideBarData({
        searchTerm:searchTermFromUrl || ' ',
        furnished : furnishedFromUrl === 'true'? true:false,
        parking: parkingFromUrl === 'true'? true:false,
        type: typeFromUrl || 'all',
        sort:sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc'
      })

    }


    const fetchListing=async()=>{
      setProgress(30);
      setLoading(true);
      setshowMore(false)
      const searchQuery = searchUrlParams;

      try {
        setProgress(50);
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setProgress(70);
        if (data.success === false) { 
          setLoading(false)
      }
      if (data.length < 9) {
        setshowMore(false)
      }
      else{
        setshowMore(true)
      }
      setListing(data);
      setLoading(false);
      
    } catch (error) {
     console.log(error) 
    }
    }
    fetchListing();
    setProgress(100);
  }, [window.location.search])
  

  const handleChange=(e)=>{
  if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale' ){
    setsideBarData({...sideBarData, type:e.target.id});
  }
 
  if(e.target.id === 'parking' || e.target.id === 'furnished'){
    setsideBarData({...sideBarData, [e.target.id]: e.target.checked});
  }
 
 
  if(e.target.id === 'sort_order'){
    const sort = e.target.value.split('_')[0] || 'created_at';
    const order = e.target.value.split('_')[1] || 'desc';
    setsideBarData({...sideBarData, sort, order});
  }

  if(e.target.id === 'searchTerm'){
    setsideBarData({...sideBarData, searchTerm:e.target.value})
  }

  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    setLoading(true);
    const urlparams = new URLSearchParams();
    urlparams.set('searchTerm', sideBarData.searchTerm);
    urlparams.set('type', sideBarData.type);
    urlparams.set('order', sideBarData.order);
    urlparams.set('parking', sideBarData.parking);
    urlparams.set('furnished', sideBarData.furnished);
    urlparams.set('sort', sideBarData.sort);
    const searchQuery = urlparams;
    navigate(`/search?${searchQuery}`);
    setLoading(false)
  }


  const onShowMoreClick=async()=>{
    const searchIndex = listings.length;
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set('searchIndex', searchIndex);
    const searchQuery = urlparams.toString();

    try {
      
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length < 9) {
        setshowMore(false);
    }
    setListing([...listings,...data]);
    

  } catch (error) {
    console.log(error)
  }
  }
  return (
        <div className='flex flex-col justify-center mr-auto w-auto  h-full pb-48 sm:h-full pt-20  md:flex-row'>
    <LoadingBar
        height={5}
        color='#1F51FF' progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
          <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
              <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>
                  Search Term:
                </label>
                <input
                  type='text'
                  id='searchTerm'
                  placeholder='Search...'
                  className='border-slate-300 rounded-lg p-3 w-full' value={sideBarData.searchTerm} onChange={handleChange}
                />
              </div>
              <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='all'
                    className='w-5'
                  checked={sideBarData.type === 'all'} onChange={handleChange}/>
                  <span>Rent & Sale</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='w-5'
                    checked={sideBarData.type === 'rent'} onChange={handleChange} />
                  <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='w-5'
                    checked={sideBarData.type === 'sale'} onChange={handleChange} />
                  <span>Sale</span>
                </div>
              
              </div>
              <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Amenities:</label>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-5' 
                    checked={sideBarData.parking ===true} onChange={handleChange} />
                  <span>Parking</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-5'  
                    checked={sideBarData.furnished === true} onChange={handleChange} />
                  <span>Furnished</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <label className='font-semibold'>Sort:</label>
                <select
                  onChange={handleChange}
                  defaultValue={'created_at_desc'}
                  id='sort_order'
                  className='border-slate-300 rounded-lg p-3'
                >
                  <option value='regularPrice_desc'>Price high to low</option>
                  <option value='regularPrice_asc'>Price low to high</option>
                  <option value='createdAt_desc'>Latest</option>
                  <option value='createdAt_asc'>Oldest</option>
                </select>
              </div>
              <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>
                {loading? 'Searching....' : 'Search'}
              </button>
            </form>
          </div>
            <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
              Listing results:
           </h1>
          <div className='p-7 flex flex-wrap gap-4'>
               {!loading && listings.length === 0 && (
                <p className='text-xl text-slate-700'>No listing found!</p>
              )}
              {loading && (
                <p className='text-xl text-slate-700 text-center w-full'>
                  Loading...
                </p>
              )}
    
               {!loading &&
                listings &&
                listings.map((listing) => (      
                  <ListingItem key={listing._id} listing={listing} />
                ))} 
  
              
            </div>
            <div>
              
            {showMore && ( 
              <button
              onClick={onShowMoreClick}
              className='flex justify-center items-center text-green-700 text-center m-auto '
              >
                <IoAddCircleOutline className='text-6xl ' />

                </button>
             )} 
             </div>
          </div>
         </div>
  )
}
