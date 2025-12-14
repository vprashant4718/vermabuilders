import { Button, Modal, ModalBody, ModalHeader,} from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';
import { PiWarningBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import {toast } from 'react-toastify';
import { Link } from 'react-router-dom';


export default function DashListings() {
  const {currentUser} = useSelector((state)=> state.user);
  // const [userPost, setUserPost]= useState([]);
  // const [showMore, setShowMore] = useState(true); 
  const [showmodal, setshowmodal] = useState(false);
  const [postIdtoDelete, setPostIdtoDelete] = useState(null);
  const [DeleteMessage, setDeleteMessage] = useState(null);
  const [errorMessage,setErrorMessage] = useState(null);

      const [listings, setListing] = useState([]);
      const [Loading, setLoading] = useState(false);
      const [searchTerm, setSearchTerm] = useState("");


  const backendUrl = process.env.REACT_APP_BASE_URL || "";
  
    const filteredData = listings.filter((listing) =>
      listing.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


  useEffect(() => {
          const fetchListing=async()=>{
            setLoading(true);
       try {
              const res = await fetch(`${backendUrl}/api/listing/getlisting/${currentUser._id}`);
              const data = await res.json();
              if (data.success === false) { 
                setLoading(false);
            }
           
            setListing(data);
            setLoading(false);
           } catch (error) {
           console.log(error) 
          }}
          if(currentUser){
          fetchListing();
        }
        }, []);
        
  

  // const handleShowMore = async()=>{
  //   const startIndex = userPost.length;
  //   try {
  //     const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
  //     const data = await res.json();
  //     if(res.ok){
  //       setUserPost((prev)=> [...prev, ...data.posts]);
  //       if(data.posts.length < 1){
  //         setShowMore(false);
  //       }
  //     }
  //     else{
        
  //     }
  //   } catch (error) {
      
  //   }
  // }


  const handleDeletePost= async()=>{
      try {
          const res = await fetch(`${backendUrl}/api/listing/delete/${postIdtoDelete}`,{
            method: 'DELETE',
            credentials: 'include',
          });

          const data = await res.json();
          if(res.ok){
            setListing((prev)=> prev.filter((listing)=> listing._id !== postIdtoDelete));
            toast.success('Listing Deleted');
            setDeleteMessage('Listing has been deleted');

          }
          else{
            toast.error('Listing not deleted');
            setDeleteMessage('Listing not deleted');
            setErrorMessage(data.message);
          }
          
      } catch (error) {
       toast.error(error);
      }

      setshowmodal(false);
  }
  return (
  <div className=' md:flex'>
        <div className="bg-[#1f2937] block  z-10 w-auto  p-2  mt-1 md:fixed md:w-[100%]">
           
               <input type="text" id="table-search" value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for items" className="block pt-2  text-sm text-gray-900 border border-gray-300 rounded-lg w-auto bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " />
        </div>
<div className="relative pt-4 w-[100vw] overflow-x-auto h-[67vh] shadow-md sm:rounded-lg md:w-[82vw]">
    
       
    
    <table className="w-full p-5 text-sm text-left rtl:text-right text-gray-500 mt-12">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>


                <th scope="col" className="px-6 py-3">
                   Date
                </th>
                <th scope="col" className="px-6 py-3">
                   Image
                </th>
                <th scope="col" className="px-6 py-3">
                   Title
                </th>
                <th scope="col" className="px-6 py-3">
                   Location
                </th>
                <th scope="col" className="px-6 py-3">
                    Category
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Update
                </th>
                <th scope="col" className="px-6 py-3">
                    Delete
                </th>
            </tr>
        </thead>
 
       {filteredData.length > 0 ? <tbody>
            {filteredData.map((listing)=><tr className="bg-white border-b text-gray-900 border-gray-200 hover:bg-gray-50 ">

                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                   {new Date(listing.createdAt).toLocaleDateString()}
                </th>
                <td className="px-6 py-4 ">
                   <img src={listing.imageUrl[0]} alt="" width={30} height={20} />
                </td>
                <td className="px-6 py-4">
                    {listing.name}
                </td>
                <td className="px-6 py-4 flex flex-row gap-1 items-center">
                 <MdLocationOn  className='text-green-600 ' />
                    {listing.address}
                </td>
                <td className="px-6 py-4">
                    {listing.type}
                </td>
                <td className="px-6 py-4 uppercase">
                    {listing.type==='rent'? '₹ '+(listing.regularprice)+'K month': '₹ '+(listing.regularprice)+' Lacs'}
                </td>
                <td className="px-6 py-4">
                    <Link to={`/updatelisting/${listing._id}`}>
                    <button type='button' className='bg-blue-950 p-2 rounded text-white'>Update </button>
                </Link>
                </td>
                <td className="px-6 py-4">
                   <button className='bg-red-700 p-2 rounded text-white' onClick={()=>{setshowmodal(true); setPostIdtoDelete(listing._id)}}>Delete</button>
                </td>
            </tr>)}
            
            
            </tbody> : <h2 className='text-2xl text-center pt-10'>You have no listings</h2>}
         
            </table>

   

     
      <Modal show={showmodal} onClose={()=>{setshowmodal(false)}} popup size={'md'} className='pt-52 sm:px-10 md:px-32 '>
              <ModalHeader />
              <ModalBody className='w-[40%] m-auto '>
                <div className="flex flex-col">
                  <PiWarningBold className="w-12 h-12 m-auto text-white"/>
                  <div className="m-auto mb-3 text-white">Are you sure you want to delete Listing</div>
                </div>
                <div className="flex flex-col m-auto justify-center gap-2 sm:flex-row">
                <Button color={'red'} className="bg-red-600 text-white hover:text-black" onClick={()=>handleDeletePost()}>Yes i'm sure {<AiOutlineDelete className="text-xl text-white "/> }</Button>
                <Button color={'red'} onClick={()=>{setshowmodal(false)}}>Cancel</Button>
                </div>
              </ModalBody>
            </Modal>

      </div>
      </div>
  )

}

