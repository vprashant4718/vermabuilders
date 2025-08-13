import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdVerified } from "react-icons/md";
import {toast } from 'react-toastify';


export default function Forgot() {
  
  const [formData, setformData] = useState({});
  const [error, setError] = useState();
  const [Loading, setLoading] = useState();
  const [validate, setvalidate] = useState(false);
  const backendUrl = process.env.REACT_APP_BASE_URL || "";

  const navigate = useNavigate();
   const handleOnChange = (e)=>{
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


const sendOtpBtn = async(e)=>{
  setError(null);
    try{
      e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = document.getElementById('email').value;
    const emailLower = email.toLowerCase();
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const emailJson = {"email":emailLower}
    const otpfield = document.getElementById('otpfield');
    const validateOtp = document.getElementById('validateOtp');
    const res = await fetch(`${backendUrl}/api/auth/forgot`, {
      method:'POST',
      credentials: 'include',
      headers:{
        'Content-Type' : 'application/json'
       },
       body: JSON.stringify(emailJson),

    });


   
    const data = await res.json();
   
    if(data.success === false){
      setLoading(false);
      toast.error(data.message);
      return;
    }
    setLoading(false); 
    setError(null);

    toast.success('OTP sent to your email');
    console.log(emailLower);
    emailInput.disabled = true
    sendOtpBtn.disabled  = true  
    sendOtpBtn.style.cursor = "not-allowed";
    sendOtpBtn.style.background = '#32CD32';
    sendOtpBtn.innerHTML = "Otp Sent";
    otpfield.classList.remove('hidden');
    validateOtp.style.display = 'block';
  } catch (error) {
    setLoading(false);
    toast.error(error.message);
   
  }
  }


  const validateOtp = async(e)=>{
    setError(null);
    try{
      e.preventDefault();
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verified = document.getElementById('verified');
    const email = document.getElementById('email').value;
    const otpfield = document.getElementById('otpfield');
    const otptoNumber = otpfield.value;
    const otpJson = {"email":email, "hash":otptoNumber}
    const validateOtp = document.getElementById('validateOtp');
    const res = await fetch(`${backendUrl}/api/auth/validateforgototp`, {
      method:'POST',
      credentials: 'include',
      headers:{
        'Content-Type' : 'application/json'
       },
       body: JSON.stringify(otpJson),

    });

    
    const data = await res.json();
    if(data.success === false){
      setLoading(false);
      toast.error(data.message);
      return;
    }
    setLoading(false); 
    setError(null);
    
    toast.success('OTP verified');
    
    setvalidate(true)
    validateOtp.style.background = "#32CD32";
    validateOtp.disabled = true;
    validateOtp.style.cursor = "not-allowed";
    sendOtpBtn.style.display = "none";
    otpfield.style.display = "none";
    validateOtp.style.display = "none";
    verified.style.display = "block";
      
  } catch (error) {
    setLoading(false);
    toast.error(error.message);
   
  }
  }

  
  
  const handleSubmit = async (e) => {
    setError(null);
     e.preventDefault();
   try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if(password.value != confirmPassword.value){
       toast.error("Password & Confirm Password Not Match");
                password.value = '';
                confirmPassword.value = '';
                return;
    };
    const newPass = password.value;
    
    const emailLower = email.toLowerCase();
    const updateNewPass = {"email":emailLower, "password":newPass}
    
      setLoading(true);
      
    const res = await fetch(`${backendUrl}/api/user/resetpassword`, 
    {
          method: 'POST',
          credentials: 'include',
          headers:{
            'Content-Type' : 'application/json',
              
          },
          body: JSON.stringify(updateNewPass),
       });
        const data = await res.json();
        if(data.success === false){
          setLoading(false);
          toast.error(data.message);
          return;
        }
        setLoading(false); 
        setError(null);
       toast.success('Password Updated Please Sign In');
        navigate('/signin');

      } catch (error) {
        setLoading(false);
        toast.error(error.message);
       }
      };
  
  
  return (
     <div  className='flex flex-col justify-center mr-auto w-auto  h-full pt-24 pb-44 sm:h-full  sm:pt-24 sm:pb-44'>
      <h1 className='text-3xl text-center font-bold sm:py-3 px-3' >Reset Your Password</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center w-auto gap-4 p-2 sm:p-3'>
           
        <div className='flex flex-col w-auto gap-3'>
        <input type="email" id='email'  placeholder="email" className='border rounded-lg p-3 lowercase focus:outline-none sm:w-96' onChange={handleOnChange} required/>
        <button type='button' id='sendOtpBtn' className='bg-red-600 text-white p-2 rounded w-24 self-end' onClick={sendOtpBtn}> Send OTP</button>
        <MdVerified  id='verified' className='bg-white text-green-500 border-green-500 text-center p-1 text-4xl rounded hidden'/> 
        </div>
        <div className='flex flex-col w-auto gap-3'>
        <input type="text" id='otpfield' placeholder="Enter Otp" className='border rounded-lg p-3  focus:outline-none sm:w-96 hidden' onChange={handleOnChange}  />
        <button type='button' id='validateOtp' className='bg-sky-500  text-white p-2 rounded w-20 self-end hidden' onClick={validateOtp}> validate</button>
        </div>
       
      {validate &&
        <>
        <input type="password" id='password' placeholder="New Password" className='border rounded-lg p-3 focus:outline-none sm:w-96' onChange={handleOnChange} />
        <input type="password" id='confirmPassword' placeholder="Confirm Password" className='border rounded-lg p-3 focus:outline-none sm:w-96' onChange={handleOnChange} />
        </>
      }
      
      {validate &&
        <button disabled = {Loading} id='signup' className='border rounded-lg p-3 bg-blue-950 text-white font-bold w-52  sm:w-96'>{Loading ? "Loading..." : "Reset Password"} </button>}

      </form> 
         <span className='items-center flex justify-center p-2 text-sm sm:text-base'>Remember Password ? <Link to="/signin" className='text-blue-700 hover:underline'>SignIn</Link></span>
    {error && <p className='text-red-700 text-center'> {error} </p>}
    </div>
  )
}










