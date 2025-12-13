import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../Components/OAuth';
import { MdVerified } from "react-icons/md";
import {toast } from 'react-toastify';


export default function SignUp() {
  
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

    
    const res = await fetch(`${backendUrl}/api/auth/email`, {
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
       },
       body: JSON.stringify(emailJson),
       credentials: "include",

    });


   
    const data = await res.json();
   
    if(data.success === false){
      setLoading(false);
      toast.error(data.message);
      return;
    }
    setLoading(false); 
    setError(null);

    toast.success('otp sent to your email'); 
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
    const otptoNumber = parseInt(otpfield.value)
    const otpJson = {"email":email, "hash":`${otptoNumber}`}
    const validateOtp = document.getElementById('validateOtp');


    const res = await fetch(`${backendUrl}/api/auth/validateotp`, {
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
       },
       body: JSON.stringify(otpJson),
       credentials: "include",

    });

    
    const data = await res.json();
    if(data.success === false){
      setLoading(false);
      toast.error(data.message);
      return;
    }
    setLoading(false); 
    setError(null);
    
    toast.success('otp verified');
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
      setLoading(true);
      
    const res = await fetch(`${backendUrl}/api/auth/signup`, 
    {
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
            },
          body: JSON.stringify(formData),
          credentials: "include",
       });
        const data = await res.json();
        if(data.success === false){
          setLoading(false);
          toast.error(data.message);
          return;
        }
        setLoading(false); 
        setError(null);
      toast.success("Account Created");
        navigate('/signin');

      } catch (error) {
        setLoading(false);
        toast.error(error.message);
       
      }
      };
  
  
  return (
    <div  className='flex flex-col justify-center mr-auto w-auto  h-full pt-24 pb-40 sm:h-full pt-20 sm:pt-24 pb-24'>
      <h1 className='text-3xl text-center font-bold sm:py-3 px-3' >SignUp</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center w-auto gap-4 p-2 sm:p-3'>
        <input type="text" id='username' placeholder="Username" className='border rounded-lg p-3 items-center lowercase focus:outline-none sm:w-96' onChange={handleOnChange} />
        
        <div className='flex flex-col w-auto gap-3 '>
        <input type="email" id='email'  placeholder="email" className='border rounded-lg p-3  lowercase focus:outline-none sm:w-96' onChange={handleOnChange} required/>
        <button type='button' id='sendOtpBtn' className='bg-red-600 text-white p-2 rounded w-24 self-end' onClick={sendOtpBtn}> Send OTP</button>
        <MdVerified  id='verified' className='bg-white text-green-500 border-green-500 m-auto self-center p-1 text-center text-4xl rounded hidden'/> 
        </div>
        <div className='flex flex-col gap-3'>
        <input type="text" id='otpfield' placeholder="Enter Otp" className='border rounded-lg p-3 lowercase focus:outline-none hidden sm:w-96' onChange={handleOnChange}  />
        <button type='button' id='validateOtp' className='bg-sky-500  text-white p-2 rounded w-20 self-end hidden' onClick={validateOtp}> validate</button>
        </div>
       
      {validate &&
        <input type="password" id='password' placeholder="create password" className='border rounded-lg p-3 focus:outline-none sm:w-96' onChange={handleOnChange} />
      }
      
      {validate &&
        <button disabled = {Loading} id='signup' className='border rounded-lg p-2 bg-blue-950 text-white font-bold sm:w-96'>{Loading ? "Loading..." : "Sign Up"} </button>}

      </form>
       <div className='flex flex-col  w-auto items-center gap-1 p-1 sm:'>
            <OAuth/>
              <span className='items-start m-auto text-sm sm:text-base '>Have an account?  <Link to="/signin" className='text-blue-700 hover:underline sm:w-96'>SignIn</Link></span>
         </div>
    {error && <p className='text-red-700 text-center'> {error} </p>}
    </div>
  )
}


