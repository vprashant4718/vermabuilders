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
    <header className='bg-slate-200 shadow-md fixed z-10 w-full p-1'>

        <div className='flex  justify-between items-center mx-auto max-w-6xl'>
        <div>
          <Link to={'/'}>
            <img src={logo} className='w-20 h-10  sm:w-20 h-20'  alt="" />
          </Link> 
         
        </div>

        <form onSubmit={handleSearchListing} className='bg-slate-100 p-2  rounded-lg flex items-center lg:ml-40 sm:ml-20'>
            <input type="text" placeholder='Search...' className = 'w-16 bg-transparent focus:outline-none sm:w-32 md:w-64  ' value={searchTerm} onChange={(e)=>{setsearchTerm(e.target.value)}}/>
            <button><FaSearch className='text-slate-500'/></button>
        </form>

        <ul className='flex flex-row justify-center items-center p-1 gap-3 font-semibold text-base'>
            <Link to="/">
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
            </Link>
            <Link to="/about">
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
            </Link>
            <Link to="/contact">
            <li className='hidden sm:inline text-slate-700 hover:underline'>Contact</li>
            </Link>
            
           
            {currentUser ?( <Link to="/profile"> <img src={currentUser.avatar} width={40} height={40} className='rounded-full' alt="profile" /></Link>)
            : (<Link to="/signin"><li className='underline sm:inline text-slate-700 hover:underline'>Sign In</li></Link>)
          }
            
        </ul>
        <div>
        </div>
        </div>
    </header>
  )
}
