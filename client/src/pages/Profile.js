import React from 'react'
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage'
import {ref} from 'firebase/storage'
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart,updateUserSuccess,updateUserFailure } from '../redux/user/userSlice';
import { deleteUserStart , deleteUserSuccess,deleteUserFailure } from '../redux/user/userSlice';
import { signoutUserStart , signoutUserSuccess,signoutUserFailure } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle, HiOutlineLogout } from "react-icons/hi";
import { MdLocationOn } from 'react-icons/md';



export default function Profile(next) {


  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state)=> state.user);
  const fileref = useRef(null);
  const [file, setfile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false)
  const [formdata, setformdata] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [userListing, setuserListing] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [errorFun, setErrorFun] = useState();
  const [errorFun1, setErrorFun1] = useState();

 // admin 
    const [listings, setListing] = useState([]);
    const [Loading, setLoading] = useState(false);
  

      useEffect(() => {
      const handleShowListing=async(e)=>{ 
    
        try {
          const res = await fetch(`/api/user/listing/${currentUser._id}`);
    
    
            const data = await res.json();
            
            if (data.success === false) {
             return 
            }
            
            setuserListing(data);
            
         
        } catch (error) {
          console.log(error)
        }
      }

      handleShowListing();
        }, []);



useEffect(() => {
        const fetchListing=async()=>{
    
          setLoading(true);
    
          try {
            
            const res = await fetch(`/api/listing/getadminlisting`);
            const data = await res.json();
            if (data.success === false) { 
              setLoading(false)
          }
         
          
          setListing(data);
          setLoading(false);
          
        } catch (error) {
         console.log(error) 
        }
        }
        fetchListing();
      }, []);
      
    

  useEffect(() => {
    if (file) {
      handleonfileUpload(file);
    }
   // eslint-disable-next-line 
  }, [file])

  const handleonfileUpload=(file)=>{
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef= ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    try {


    uploadTask.on(
      'state_changed', 
      (snapshot)=>{
        const progress = 
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePerc(Math.round(progress));

       },
       (error) => {
        setfileUploadError(true);
       },

       () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadUrl)=>
          setformdata({ ...formdata, avatar: downloadUrl })
      );
       });

      } catch (error) {
        next(error);
      }


  };

  const handleChange=(e)=>{
    setformdata({...formdata, [e.target.id]: (e.target.value).toLowerCase()});
  }

  const handleSubmit = async (e) => {
    setupdateSuccess(null);
    setErrorFun(null);
    setErrorFun1(null);
    
    e.preventDefault();

    try {

      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, 
        {
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',

          },
          body: JSON.stringify(formdata),
       });
        const data = await res.json();

        if(data.success === false){
          dispatch(updateUserFailure(data.message));
          setErrorFun(data.message);
         
          return;
        }
        dispatch(updateUserSuccess(data));
        setupdateSuccess(true);

      } catch (error) {
        dispatch(updateUserFailure(error.message));

      }

      };

      const deleteUser = async()=>{


        try {

          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`, 
            {
              method: 'DELETE',

           });
           const data = await res.json();

        if(data.success === false){
          dispatch(deleteUserFailure(data.message));
          setErrorFun(data.message);
          return;
        }
        dispatch(deleteUserSuccess(data))


          } catch (error) {
          dispatch(deleteUserFailure(error.message));

        }

      }

      const signOutUser= async()=>{
        try {

          dispatch(signoutUserStart());
          const res = await fetch(`/api/auth/signout`);
           const data = await res.json();

        if(data.success === false){
          dispatch(signoutUserFailure(data.message));
          return;
        }
        dispatch(signoutUserSuccess(data))


          } catch (error) {
          dispatch(signoutUserFailure(error.message));

        }

      }


  // const handleShowListing=async(e)=>{
  //   e.preventDefault();

  //   try {
  //     const res = await fetch(`/api/user/listing/${currentUser._id}`);


  //       const data = await res.json();

  //       if (data.success === false) {
  //        return setErrorFun1('You Have 0 Listing');
  //       }

  //       setuserListing(data);


  //   } catch (error) {
  //     setErrorFun1(error);
  //   }
  // }

  const handleDeleteListing= async(id)=>{
      try{
        const res = await fetch(`/api/listing/delete/${id}`,{
          method:'DELETE'
        });
         const data = await res.json('listing is deleted');

         if (data.success === false) {
           setErrorFun(data.message);
         }

         setuserListing((prev)=> prev.filter((listing)=> listing._id !== id));

      }catch(error){
        setErrorFun(error);
      }

  }

  return (
  <div className='flex flex-col border-gray-500 justify-center items-center text-center gap-6 pt-24 '>
        
         {/* profile  & User Listings */}
    <div className='flex flex-col border-gray-500 justify-center items-center text-center m-auto gap-40 sm:flex-row sm:gap-10'>
      
      {/* profile */}
      <div className='flex flex-col border-gray-500 justify-center w-auto items-center text-center gap-6'>
        <input type="file" hidden ref={fileref} accept='images/*' onChange={(e)=>setfile(e.target.files[0])}/>
      
      <div className='flex flex-col justify-center items-center'>
        <img src={formdata.avatar || currentUser.avatar} alt="profile_img" className='rounded-full h-24 w-24 cursor-pointer' 
        onClick={()=>{fileref.current.click()}}/>
      </div>
        <p>
          {fileUploadError ? 
          <span className='text-red-600'> Error in Uploading image</span>
          : filePerc > 0 && filePerc < 100 ? 
          <span className='text-slate-700'>{`${filePerc}%`}</span> 
          : filePerc === 100 ? 
          <span className='text-green-500'> Image Uploaded successfully</span>
          : "" 
          }
        </p>
      <form  className='flex flex-col justify-center items-center gap-4' onSubmit={handleSubmit}>
      <input type="text" id='username'  placeholder="username" className='border rounded-lg p-2 w-[100%]  focus:outline-none sm:w-96' defaultValue={currentUser.username}  onChange={handleChange}/>
      <input type="email" id='email'  placeholder="email" className='border rounded-lg p-2 w-[100%]  focus:outline-none sm:w-96' defaultValue={currentUser.email}  onChange={handleChange}/>
        <input type="password" id='password' placeholder="password" className='border rounded-lg p-2 w-[100%]  focus:outline-none sm:w-96' defaultValue={currentUser.password} onChange={handleChange}/>
        
        <button id='submit'  disabled={loading} className='border rounded-lg p-2 w-[100%]  focus:outline-none  bg-blue-950 uppercase text-white font-bold hover:opacity-85 sm:w-96'>{loading? "Loading..." : 'Update'}</button>
        
        <Link to={"/createListing"}className='border rounded-lg p-2 w-[100%]  focus:outline-none bg-green-700  uppercase text-white font-bold hover:opacity-90 sm:w-96'>
       Create Listing
        </Link>

      </form>
      <div className='flex flex-col justify-center gap-4 m-auto w-[100%] sm:w-96'>
        <button type='button' className='border rounded-lg p-2 w-[100%] focus:outline-none  bg-red-700 uppercase text-white font-bold hover:opacity-85 sm:w-96' onClick={() => setOpenModal(true)}>Delete Account</button>
        <button type='button' className='border rounded-lg p-2 w-[100%] focus:outline-none  bg-red-700 uppercase text-white font-bold hover:opacity-85 sm:w-96' onClick={() => setSignModal(true)}>Signout</button>
      </div>
    

      {/* modal for delete user  */}
      <Modal show={openModal} size="lg" className='m-auto bg-white w-[100%] h-auto items-center border rounded-md border-gray-400' onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody className='m-auto items-center '>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete Account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" className='p-2' onClick={() => deleteUser()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" className='p-2' onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    
    
      {/* modal for signout user  */}
      <Modal show={signModal} size="lg" className='m-auto bg-white w-[100%] h-auto items-center border rounded-md border-gray-400' onClose={() => setSignModal(false)} popup>
        <ModalHeader />
        <ModalBody className='m-auto'>
          <div className="text-center">
            <HiOutlineLogout className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure - SignOUt
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" className='p-2' onClick={() => signOutUser()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" className='p-2' onClick={() => setSignModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    
      
          <p className='text-red-600'>
            {error? error.message : ''}
          </p>
          <p className='text-green-600'>
            {updateSuccess ? "User Updated successfully" : ''}
          </p>
         </div>

          {/* listings done by user  */}
          <div className='flex flex-col gap-3 mb-16 p-4 justify-center items-center'>
            <h1 className='text-2xl font-bold'>My Listings</h1>
            {userListing && userListing.length > 0 && 
             userListing.map((listing)=> 
            <div key={listing._id} className='flex justify-between border  border-gray-300 p-2 rounded-lg'>
              <Link to={`/listing/${currentUser._id}`} className='flex flex-row gap-2'>
                <img src={listing.imageUrl[0]} alt=""  className='object-contain w-20 h-10' />
                <p>{listing.name}</p>
                </Link>
            
              
              <div className='flex  gap-3'>
                <button type='button' className='text-red-500 border border-red-500 rounded p-1 hover:text-white hover:bg-red-500' onClick={()=>handleDeleteListing(listing._id)}>DELETE</button>
                <Link to={`/updatelisting/${listing._id}`}>
                <button  className='text-green-500 border border-green-500 rounded p-1 hover:text-white hover:bg-green-500' >EDIT</button>
                </Link>

              </div>
            </div>
            )

            }
          </div>

    </div>



  {/* if User admin is true  */}

 {currentUser.isAdmin && <div className='flex flex-col justify-center m-auto w-auto  h-full pb-48 sm:h-full pt-20  md:flex-row'>
          
            <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
              Admin Area
           </h1>
          <div className='flex flex-col flex-wrap gap-4 mt-5 p-2'>
               {!Loading && listings.length === 0 && (
                <p className=' text-center text-xl text-slate-700'>No listing found!</p>
              )}
              {Loading && (
                <p className='text-center text-xl text-slate-700 w-auto'>
                  Loading...
                </p>
              )}
              
               {!Loading &&
                listings &&
                listings.map((listing) => (      
                  <Link to={`/listing/${listing._id}`} className='flex flex-col m-auto w-auto lg:w-[100%]'>
                      <div className='flex flex-col border border-slate-300 w-auto rounded-lg justify-center md:flex-row'> 
                         
                         <img src={listing.imageUrl[0]} alt="image" className='w-auto items-center m-auto rounded-md hover:scale-105 duration-500    sm:w-48'  />
                     
                     <div className='pl-6 pr-6 flex flex-col items-center justify-center md:flex-row'>
                     <div>
                         <h6 className='truncate w-auto font-semibold text-lg mb-1 my-4 mx-1 uppercase sm:w-44 lg:w-44 lg:text-base'>{listing.name}</h6>
                     </div>
                     <div className='flex flex-row mb-1 items-center md:flex-row'>
                       <MdLocationOn  className='text-green-600 ' />
                       <p className='truncate w-auto text-sm font-semibold lg:w-44'>{listing.address}..</p>
                     </div>
                     {/* <div className='flex flex-col  gap-1 text-sm font-semibold'>
                       <p className='truncate w-44  lg:w-44 '>{listing.description}</p> */}
                      
                       <p className='text-center truncate w-auto text-slate-700 font-semibold text-lg '>
                       { listing.type === 'rent'?'$': '₹'  } {listing.regularprice}{ listing.type === 'rent'?'/month': '/Lacs'  }
                       </p>
                      
                     {/* </div> */}
                         <div className='flex flex-row items-center justify-center gap-2 w-auto text-sm font-semibold p-2 md:flex-row'>
                           <p>{listing.bedrooms} beds</p>
                           <p>{listing.bathrooms} baths</p>
                         </div>

                        <div className='flex flex-row gap-2 items-center justify-center md:flex-row'>
                         <Link >
                         <button  className='text-green-500 m-auto border  border-green-500 rounded p-1 hover:text-white hover:bg-green-500' >Update</button>
                        </Link>

                        <button type='button' className='text-red-500 m-auto border border-red-500 rounded p-1 hover:text-white hover:bg-red-500' >DELETE</button>
                         </div>
                     </div>
                  </div>
                                    </Link>
                ))} 
  
              
            </div>
            <div>
              
           
             </div>
          </div>
         </div>
}



    </div>
  )
}

