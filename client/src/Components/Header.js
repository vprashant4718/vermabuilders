import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import logo from './vermaBuilders.png';


 
export default function Header() {
  const {currentUser} = useSelector((state) => state.user);
  const [searchTerm, setsearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSearchListing=(e)=>{
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
   urlParams.set('searchTerm', searchTerm);
   const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const getSearchTermFromQuery = urlParams.get('searchTerm');
    if (getSearchTermFromQuery) {
      setsearchTerm(getSearchTermFromQuery);
    } 
    
  }, [window.location.search])
  
  return (
    
    
    <nav class="bg-gray-200 border-gray-200">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link to={'/'} class="flex items-center h-8 space-x-3 rtl:space-x-reverse">
      <img src={logo} className='w-16  md:w-30 md:h-20'  alt="verm builders logo" />
    </Link> 

    <form onSubmit={handleSearchListing} className='p-2  rounded-lg flex items-center lg:ml-40 sm:ml-20 sm:bg-slate-100'>
           <input type="text" placeholder='Search...' className = 'hidden w-16 bg-transparent border-none focus:outline-none sm:w-24 sm:inline md:w-48 lg:w-64' value={searchTerm} onChange={(e)=>{setsearchTerm(e.target.value)}}/> 
            <button><FaSearch className='text-slate-700 text-2xl'/></button>
        </form>
   <div className='flex flex-row gap-2'>
   <div className='md:hidden'>
  {currentUser ?( <Link to="/profile"> <img src={currentUser.avatar} width={40} height={40} className='rounded-full' alt="profile" /></Link>)
          : (<Link to="/signin" className='items-center m-auto'><li className='underline mt-2 list-none self-center  sm:inline text-slate-700 hover:underline'>Sign In</li></Link>)
        }
        </div>
    <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true"  fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
</div>
    <div class="hidden w-full sm:block md:w-auto" id="navbar-default">
      <ul class="font-medium flex flex-col gap-2 p-4 md:p-0 mt-4 border bg-blue-900 border-gray-100 rounded-lg md:bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  ">
        
       <Link to="/">
             <li className='list-none sm:inline text-white md:text-slate-700 hover:underline block py-2 px-3 bg-blue-700 rounded-sm sm:bg-transparent  md:p-0' aria-current="page">Home</li>
        </Link>
        <Link to="/about">
           <li className='list-none sm:inline text-white md:text-slate-700 hover:underline block py-2 px-3 bg-blue-700 rounded-sm sm:bg-transparent  md:p-0' aria-current="page">About</li>
        </Link>
        <Link to="/contact">
            <li className='list-none sm:inline text-white md:text-slate-700 hover:underline block py-2 px-3 bg-blue-700 rounded-sm sm:bg-transparent  md:p-0' aria-current="page">Contact</li>
         </Link>

        <div className='hidden md:inline '>
  {currentUser ?( <Link to="/profile"> <img src={currentUser.avatar} width={40} height={40} className='rounded-full' alt="profile" /></Link>)
          : (<Link to="/signin" className='items-center m-auto'><li className='underline list-none self-center  sm:inline text-slate-700 hover:underline'>Sign In</li></Link>)
        }
        </div>
       
      </ul>

    </div>
  </div>
</nav>

  )
}
