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

  useEffect(() => {
    if (file) {
      handleonfileUpload(file);
    }
    
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
    setformdata({...formdata, [e.target.id]: e.target.value});
  }
  
  const handleSubmit = async (e) => {
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
  

  const handleShowListing=async(e)=>{
    e.preventDefault();

    try {
      const res = await fetch(`/api/user/listing/${currentUser._id}`);


        const data = await res.json();
        
        if (data.success === false) {
         return console.log(data)
        }
        
        setuserListing(data);
        
     
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteListing= async(id)=>{
      try{
        const res = await fetch(`/api/listing/delete/${id}`,{
          method:'DELETE'
        });
         const data = await res.json('listing is deleted');

         if (data.success === false) {
            console.log(data.message);
         }

         setuserListing((prev)=> prev.filter((listing)=> listing._id !== id));
         
      }catch(error){
        console.log(error);
      }

  }
  
  return (
    <div className='flex flex-col justify-center items-center text-center gap-6 pt-24 '>
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
      <input type="text" id='username'  placeholder="username" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' defaultValue={currentUser.username}  onChange={handleChange}/>
      <input type="email" id='email'  placeholder="email" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' defaultValue={currentUser.email}  onChange={handleChange}/>
        <input type="password" id='password' placeholder="password" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' defaultValue={currentUser.password} onChange={handleChange}/>
        
        <button id='submit'  disabled={loading} className='border rounded-lg p-3 w-80  focus:outline-none  bg-blue-950 uppercase text-white font-bold hover:opacity-85 sm:w-96'>{loading? "Loading..." : 'Update'}</button>
        
        <Link to={"/createListing"}className='border rounded-lg p-3 w-80  focus:outline-none bg-green-700  uppercase text-white font-bold hover:opacity-90 sm:w-96'>
       Create Listing
        </Link>

      </form>
      <div className='flex flex-col justify-center gap-4 m-auto  '>
        <span className='text-red-700 text-lg font-bold cursor-pointer' onClick={deleteUser}>Delete Account</span>
        <span className='text-red-700 text-lg font-bold cursor-pointer ' onClick={signOutUser}>Signout</span>
      </div>
      
          <p className='text-red-600'>
            {error? error.message : ''}
          </p>
          <p className='text-green-600'>
            {updateSuccess ? "User Updated successfully" : ''}
          </p>
         

        <div >
          <button onClick={handleShowListing} type='button' className='text-green-600 text-center uppercase font-bold border border-green-600 mb-10 p-2 rounded'>Show Listing </button>
        </div>

          <div className='flex flex-col gap-3 mb-16 p-4'>
            {userListing && userListing.length > 0 && 
             userListing.map((listing)=> 
            <div key={listing._id} className='flex justify-between border  border-gray-300 p-2 rounded-lg'>
              <Link to={`/listing/${currentUser._id}`} className='flex flex-row gap-2'>
                <img src={listing.imageUrl[0]} alt="" width='60' height={40} className='object-contain w-20 h-10' />
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
  )
}
