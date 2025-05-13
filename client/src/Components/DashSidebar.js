import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {HiOutlineArrowSmRight, HiUser} from 'react-icons/hi';
import { BsFilePost } from "react-icons/bs";
import { useSelector } from 'react-redux';
// import { FaCommentDots } from "react-icons/fa";
// import {signOutStart, signOutSuccess, signOutFailure} from "../redux/slice/createSlice";
// import { useDispatch } from 'react-redux'; 

export default function DashSidebar() {
const { currentUser, error:errormessage } = useSelector((state) => state.user);

// const dispatch = useDispatch()    
const location = useLocation();
const [tab, settab] = useState(null);

useEffect(() => {
const urlParams = new URLSearchParams(location.search);
const tabUrl = urlParams.get('tab');
if (tabUrl) {
  settab(tabUrl);
}

}, [location.search]);

const signOutUser =async(e)=>{
  e.preventDefault();
//   dispatch(signOutStart());
  try {
    const res = await fetch(` https://localhost:5000/api/user/signout`,{
      method:'POST'
    });
    const data = await res.json();
    if(res.ok){
        console.log(data);
    //  dispatch(signOutSuccess(data));
   }
  } catch (error) {
    //   dispatch(signOutFailure(error.message));
  }
}
  return ( 
    <Sidebar className='w-auto rounded-none md:min-h-full md:w-60'>
        <SidebarItems>
        <SidebarItemGroup>
      
           <div className='flex flex-col gap-2  pt-8 ' ><Link to={'/dashboard?tab=profile'}>
                <SidebarItem active={tab==='/dashboard?tab=profile'} icon={HiUser} label={currentUser.isAdmin?'admin': 'user'} labelColor={'dark'} as='div'>
                    Profile
                </SidebarItem>
            </Link>
            <Link to={'/dashboard?tab=posts'}>
                <SidebarItem active={tab==='/dashboard?tab=posts'} icon={BsFilePost} labelColor={'dark'} as='div'>
                    Admin Area
                </SidebarItem>
            </Link>
    
                <SidebarItem active={tab==='/dashboard?tab=signout'} icon={HiOutlineArrowSmRight} labelColor={'dark'} className='cursor-pointer'>
                   <div onClick={signOutUser}>SignOut</div> 
                </SidebarItem></div> 
                
               
        </SidebarItemGroup>

            
        </SidebarItems>
    </Sidebar>
  )
}
