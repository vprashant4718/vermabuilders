import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdVerified } from "react-icons/md";


export default function Forgot() {
  
  const [formData, setformData] = useState({});
  const [error, setError] = useState();
  const [Loading, setLoading] = useState();
    const [validate, setvalidate] = useState(false);

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
    const res = await fetch('/api/auth/forgot', {
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
       },
       body: JSON.stringify(emailJson),

    });


   
    const data = await res.json();
   
    if(data.success === false){
      setLoading(false);
      setError(data.message);
      return;
    }
    setLoading(false); 
    setError(null);


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
    setError(error.message);
   
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
    const res = await fetch('/api/auth/validateforgototp', {
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
       },
       body: JSON.stringify(otpJson),

    });

    
    const data = await res.json();
    if(data.success === false){
      setLoading(false);
      setError(data.message);
      return;
    }
    setLoading(false); 
    setError(null);
    
    
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
    setError(error.message);
   
  }
  }

  
  
  const handleSubmit = async (e) => {
    setError(null);
     e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if(password.value != confirmPassword.value){
       setError("Password & Confirm Password Not Match");
                password.value = '';
                confirmPassword.value = '';
                return;
    };
    const newPass = password.value;
    
    const emailLower = email.toLowerCase();
    const updateNewPass = {"email":emailLower, "password":newPass}
    try {
      setLoading(true);
      
    const res = await fetch('/api/auth/resetpassword', 
    {
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
              
          },
          body: JSON.stringify(updateNewPass),
       });
        const data = await res.json();
        if(data.success === false){
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false); 
        setError(null);
        navigate('/signin');

      } catch (error) {
        setLoading(false);
        setError(error.message);
       
      }
      };
  
  
  return (
     <div  className='flex flex-col justify-center mr-auto w-auto  h-full pt-24 pb-40 sm:h-full pt-20 sm:pt-24 pb-24'>
      <h1 className='text-3xl text-center font-bold sm:py-3 px-3' >Reset Your Password</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 p-2 sm:p-3'>
           
        <div className='flex flex-row w-96 gap-3'>
        <input type="email" id='email'  placeholder="email" className='border rounded-lg p-3 w-80 lowercase focus:outline-none sm:w-72' onChange={handleOnChange} required/>
        <button type='button' id='sendOtpBtn' className='bg-red-600 text-white p-2 rounded' onClick={sendOtpBtn}> Send OTP</button>
        <MdVerified  id='verified' className='bg-white text-green-500 border-green-500 text-center p-1 text-4xl rounded hidden'/> 
        </div>
        <div className='flex flex-row w-96 gap-3'>
        <input type="text" id='otpfield' placeholder="Enter Otp" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96 hidden' onChange={handleOnChange}  />
        <button type='button' id='validateOtp' className='bg-sky-500 text-white p-2 rounded hidden' onClick={validateOtp}> validate</button>
        </div>
       
      {validate &&
        <>
        <input type="password" id='password' placeholder="New Password" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' onChange={handleOnChange} />
        <input type="password" id='confirmPassword' placeholder="Confirm Password" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' onChange={handleOnChange} />
        </>
      }
      
      {validate &&
        <button disabled = {Loading} id='signup' className='border rounded-lg p-2 bg-blue-950 text-white font-bold w-80  sm:w-96'>{Loading ? "Loading..." : "Reset Password"} </button>}

      </form> 
         <span className='items-center flex justify-center p-2 text-xl'>Remember Password ? <Link to="/signin" className='text-blue-700 hover:underline'>SignIn</Link></span>
    {error && <p className='text-red-700 text-center'> {error} </p>}
    </div>
  )
}



