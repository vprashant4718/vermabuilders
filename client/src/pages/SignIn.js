import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';
import {toast } from 'react-toastify';

export default function SignIn() {
  
  const [formData, setformData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch  = useDispatch();
   const handleOnChange = (e)=>{
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
try {
  
  
  dispatch(signInStart());
    const res = await fetch('/api/auth/signin', 
    { 
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
              
          },
          body: JSON.stringify(formData),
       });
        const data = await res.json();
        if(data.success === false){
          dispatch(signInFailure(data.message));
          toast.error(data.message);
        return;
      }
    dispatch(signInSuccess(data));
    toast.success("Sign In Success");
  navigate('/');

} catch (error) {
   toast.error(error);
}
};
  
  
  return (
   <div  className='flex flex-col justify-center m-auto w-auto  h-full pb-44 sm:w-44    pt-24 '>
      <h1 className='text-3xl text-center font-bold py-3 px-3 mb-3'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4'>
        
        <input type="email" id='email'  placeholder="email" className='border rounded-lg p-3 w-auto lowercase focus:outline-none sm:w-96' onChange={handleOnChange} />
        <div>
        <input type="password" id='password' placeholder="password" className='border rounded-lg p-3 w-auto  focus:outline-none sm:w-96' onChange={handleOnChange} />
        <span className='items-end flex justify-end p-2 text-xs w-auto sm:text-sm'>  <Link to="/forgot_password" className='text-blue-700 hover:underline'>Forgot Password</Link></span>
        </div>

        <button disabled = {loading} className='border rounded-lg p-2 bg-blue-950 text-white font-bold w-52  sm:w-96'>{loading ? "loading..." : "Sign In"   } </button>

      </form>
      <div className='flex flex-col  w-auto items-center gap-1 p-1 sm:'>
      <OAuth/>
        <span className='self-end m-auto text-sm sm:text-base sm:w-72'>Don't have an account?  <Link to="/signup" className='text-blue-700 hover:underline sm:'>SignUp</Link></span>
   </div>
    {error && <p className='text-red-700 text-center'> {error} </p>}

    </div>
  )
}



