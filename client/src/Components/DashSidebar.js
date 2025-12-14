import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {HiOutlineArrowSmRight, HiUser} from 'react-icons/hi';
import { BsFilePost } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { signoutUserStart , signoutUserSuccess,signoutUserFailure } from '../redux/user/userSlice';
import {toast } from 'react-toastify';

// import { FaCommentDots } from "react-icons/fa";
import { useDispatch } from 'react-redux'; 

export default function DashSidebar() {
const { currentUser, error:errormessage } = useSelector((state) => state.user);
const backendUrl = process.env.REACT_APP_BASE_URL || "";
  
const dispatch = useDispatch()    
const location = useLocation();
const [tab, settab] = useState(null);

useEffect(() => {
const urlParams = new URLSearchParams(location.search);
const tabUrl = urlParams.get('tab');
if (tabUrl) {
  settab(tabUrl);
}

}, [location.search]);

const signOutUser= async()=>{
        try {
          dispatch(signoutUserStart());
          const res = await fetch(`${backendUrl}/api/auth/signout`);
           const data = await res.json();

        if(data.success === false){
          dispatch(signoutUserFailure(data.message));
          return;
        }
        toast.success('Signout Success');
        dispatch(signoutUserSuccess(data));
        } catch (error) {
          dispatch(signoutUserFailure(error.message));
          } }
  return ( 
    <Sidebar className='w-auto rounded-none md:min-h-full md:w-60'>
        <SidebarItems>
        <SidebarItemGroup>
      
           <div className='flex flex-col gap-2  pt-8 ' ><Link to={'/dashboard?tab=profile'}>
                <SidebarItem active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin?'admin': 'user'} labelColor={'dark'} as='div' className='hover:text-black'>
                    Profile
                </SidebarItem>
            </Link>
           {currentUser.isAdmin ? <><Link to={'/dashboard?tab=posts'}>
                <SidebarItem active={tab==='posts'} icon={RiAdminFill} labelColor={'dark'} as='div' className='hover:text-black'>
                    Admin Area
                </SidebarItem>
            </Link><Link to={'/dashboard?tab=mypost'}>
                <SidebarItem active={tab==='mypost'} icon={BsFilePost} labelColor={'dark'} as='div' className='hover:text-black'>
                    My Listings
                </SidebarItem>
            </Link></> :<Link to={'/dashboard?tab=mypost'}>
                <SidebarItem active={tab==='mypost'} icon={BsFilePost} labelColor={'dark'} as='div' className='hover:text-black'>
                    My Listings
                </SidebarItem>
            </Link>}
    
                <SidebarItem active={tab==='signout'} onClick={signOutUser}  icon={HiOutlineArrowSmRight} labelColor={'dark'} className='cursor-pointer hover:text-black' >
                   <div>SignOut</div> 
                </SidebarItem></div> 
                 </SidebarItemGroup>
           </SidebarItems>
    </Sidebar>
  )
}

