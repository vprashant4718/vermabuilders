import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { updateUserStart,updateUserSuccess,updateUserFailure } from '../redux/user/userSlice';
import { deleteUserStart , deleteUserSuccess,deleteUserFailure } from '../redux/user/userSlice';
import { signoutUserStart , signoutUserSuccess,signoutUserFailure } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle, HiOutlineLogout } from "react-icons/hi";
import {toast } from 'react-toastify';


export default function DashProfile(next) {
 
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state)=> state.user);
  const fileref = useRef(null);
  const [file, setfile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false)
  const [formdata, setformdata] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
// eslint-disable-next-line
  const [errorFun, setErrorFun] = useState();
  // eslint-disable-next-line
  const [errorFun1, setErrorFun1] = useState();
  const backendUrl = process.env.REACT_APP_BASE_URL || "";

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
            toast.error(error);
           },
    
           () => {
            getDownloadURL(uploadTask.snapshot.ref).then
            ((downloadUrl)=>
              setformdata({ ...formdata, avatar: downloadUrl })
          );
           });
    
          } catch (error) {
            next(toast.error(error));
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
          const res = await fetch(`${backendUrl}/api/user/update/${currentUser._id}`, 
            {
              method: 'POST',
              headers:{
                'Content-Type' : 'application/json',
    
              },
              body: JSON.stringify(formdata),
              credentials: "include",
           });
            const data = await res.json();
    
            if(data.success === false){
              dispatch(updateUserFailure(data.message));
              toast.error(data.message);
              return;
            }
            dispatch(updateUserSuccess(data));
            toast.success('user updated successfully');
    
          } catch (error) {
            dispatch(updateUserFailure(error.message));
            toast.error(error);
          }
    
          };
    
          const deleteUser = async()=>{
            try {
    
              dispatch(deleteUserStart());
              const res = await fetch(`${backendUrl}/api/user/delete/${currentUser._id}`, 
                {
                  method: 'DELETE',
                  credentials: 'include'
    
               });
               const data = await res.json();
    
            if(data.success === false){
              dispatch(deleteUserFailure(data.message));
              toast.error(data.message);
              return;
            }
            dispatch(deleteUserSuccess(data))
            toast.info('User Deleted Successfully');
    
              } catch (error) {
              dispatch(deleteUserFailure(error.message));
             toast.error(error);
    
            }
    
          }
   
    
    
  
  return (
      <div className='flex flex-col border-gray-500 justify-center w-auto items-center text-center pt-8 gap-6 mb-5 pb-4'>
        <input type="file" hidden ref={fileref} accept='images/*' onChange={(e)=>setfile(e.target.files[0])}/>
      
      <div className='flex flex-col justify-center items-center'>
        <img src={formdata.avatar || currentUser.avatar} alt="profile_img" className='rounded-full h-24 w-24 cursor-pointer' 
        onClick={()=>{fileref.current.click()}}/>
      </div>
        <p>
          {fileUploadError ? 
          <span className='text-red-600'>Error in uploading image</span>
          : filePerc > 0 && filePerc < 100 ? 
          <span className='text-slate-700'>{`${filePerc}%`}</span> 
          : filePerc === 100 ? 
          <span className='text-green-500'>Image Uploaded successfully</span>
          : "" 
          }
        </p>
      <form  className='flex flex-col justify-center items-center gap-4' onSubmit={handleSubmit}>
      <input type="text" id='username'  placeholder="username" className='border-slate-300 rounded-lg p-2 w-[100%]  focus:outline-none outline-none sm:w-96' defaultValue={currentUser.username}  onChange={handleChange}/>
      <input type="email" id='email'  placeholder="email" className='border-slate-300 rounded-lg p-2 w-[100%]  focus:outline-none sm:w-96' defaultValue={currentUser.email}  onChange={handleChange}/>
        <input type="password" id='password' placeholder="password" className='border-slate-300 rounded-lg p-2 w-[100%]  focus:outline-none sm:w-96' defaultValue={currentUser.password} onChange={handleChange}/>
        
        <button id='submit'  disabled={loading} className='border rounded-lg p-2 w-[100%]  focus:outline-none  bg-blue-950 uppercase text-white font-bold hover:opacity-85 sm:w-96'>{loading? "Loading..." : 'Update'}</button>
        
        <Link to={"/createListing"}className='border rounded-lg p-2 w-[100%]  focus:outline-none bg-green-700  uppercase text-white font-bold hover:opacity-90 sm:w-96'>
       Create Listing
        </Link>

      </form>
      <div className='flex flex-col justify-center gap-4 m-auto w-[100%] sm:w-96'>
        <button type='button' className='border rounded-lg p-2 w-[100%] focus:outline-none  bg-red-700 uppercase text-white font-bold hover:opacity-85 sm:w-96' onClick={() => setOpenModal(true)}>Delete Account</button>
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
    
    
         </div>
         
        )}

