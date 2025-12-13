import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../Components/OAuth';
import {toast } from 'react-toastify';
import {BadgeCheck, Loader2Icon} from 'lucide-react'

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

console.log(formData);

const sendOtpBtn = async(e)=>{
  setLoading(true);
  setError(null);
  if(!formData.email){
    toast.error('Please Enter Your Email');
    setLoading(false);
    return;
  }
  const emailLower = formData?.email;
  const emailJson = {"email":emailLower}
    try{
      e.preventDefault();
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
    
    setformData({
      ...formData,
      otpSent: true
    });
    toast.success('OTP sent to your email');
  } catch (error) {
    setLoading(false);
    toast.error(error.message);
  } 
}


  const validateOtp = async(e)=>{
    setLoading(true)
    setError(null);

    try{
      e.preventDefault();
    const otptoNumber = parseInt(formData.otpfield);
    const otpJson = {"email":formData.email, "hash":`${otptoNumber}`}

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
    
    toast.success('OTP verified');
    setvalidate(true)
          
  } catch (error) {
    setLoading(false);
    toast.error(error.message);
   
  }
  }

  
  
  const handleSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    if(!formData.username){
      toast.error('Please enter your username');
      return
    }

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
    <div  className='flex flex-col justify-center items-center m-auto w-auto  h-screen pt-24 pb-40 sm:h-full sm:pt-24'>

      <h1 className='text-3xl text-center font-bold sm:py-3 px-3' >SignUp</h1>

      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center max-w-[40rem] gap-4 p-2 sm:p-3 '>

        <input type="text" id='username' placeholder="Username" className='border rounded-lg p-3 items-center w-96 lowercase focus:outline-none ' onChange={handleOnChange} />
        
          <input type="email" disabled={formData.otpSent} id='email'  placeholder="email" className={`border rounded-lg p-3 lowercase focus:outline-none  sm:w-96`} onChange={handleOnChange} required/>

          {/* send otp */}
         {!validate && <button type='button' disabled={Loading} id='sendOtpBtn' className={`${formData?.otpSent ? 'bg-rose-600' : 'bg-red-600'}  text-white text-sm p-2 rounded w-30 self-end`} onClick={sendOtpBtn}>
             {Loading ? <Loader2Icon size={12} className='animate-spin m-auto' /> : formData?.otpSent ? "New OTP" : "Send OTP" }  
          </button>}

          {validate && <BadgeCheck size={30} id='verified' className='absolute bg-white text-green-500 border-green-500 -mt-14 ml-80 rounded-full self-center p-1 text-center text-4xl  '/> }
        

       {!validate && <div className='flex flex-col gap-3'>
        <input type="text" id='otpfield' placeholder="Enter Otp" className='border rounded-lg p-3 lowercase focus:outline-none  sm:w-96' maxLength={6} onChange={handleOnChange}  />
        <button type='button' id='validateOtp' className='bg-sky-500  text-white text-sm p-2 rounded w-30 self-end' onClick={validateOtp}>
           {Loading ? <Loader2Icon size={24} className='animate-spin m-auto' /> : "Validate"  } 
            </button>
        </div>}
       
      {validate &&
        <input type="password" id='password' placeholder="create password" className='border rounded-lg p-3 focus:outline-none sm:w-96' onChange={handleOnChange} />
      }
      
      {validate &&
        <button disabled = {Loading} id='signup' className='border rounded-lg p-2 bg-blue-950 text-white font-bold sm:w-96'> {Loading ? <Loader2Icon size={24} className='animate-spin m-auto' /> : "Sign Up"} </button>}

      </form>
      {error && <p className='text-red-700 text-center pt-2'> {error} </p>}

      <h2 className='text-black text-lg pb-2'>OR </h2>
       <div className='flex flex-col  w-auto items-center gap-1 p-1 sm:'>
            <OAuth/>
              <span className='items-start m-auto text-sm sm:text-base '>Have an account?  <Link to="/signin" className='text-blue-700 hover:underline sm:w-96'>SignIn</Link></span>
         </div>
    </div>
  )
}


