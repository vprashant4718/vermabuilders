import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../Components/DashSidebar'
import DashProfile from '../Components/DashProfile'
import DashPosts from '../Components/DashPosts';
import DashListings from  '../Components/DashListings';


export default function DashBoard() {

const location = useLocation();
const [tab, settab] = useState(null);

useEffect(() => {
const urlParams = new URLSearchParams(location.search);
const tabUrl = urlParams.get('tab');
if (tabUrl) {
  settab(tabUrl);
}

}, [location.search])
  return (
    <div className='flex flex-col pt-20 light gap-5 md:flex-row '>
        <div>
          <DashSidebar />
        </div>
        {tab === 'profile' &&<div className='flex flex-col justify-center m-auto'>
           {tab === 'profile' && <DashProfile />}   
       </div>}
       {tab === 'posts' && <div className='flex '>
           {tab === 'posts' && <DashPosts />} 
       </div>}
       {tab === 'listing' && <div className='flex '>
           {tab === 'listing' && <DashListings />} 
       </div>}
    </div>
  )
}
