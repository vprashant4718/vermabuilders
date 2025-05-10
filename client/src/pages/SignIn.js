import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';

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
        return;
      }
    dispatch(signInSuccess(data));
  navigate('/');

} catch (error) {
  
}
};
  
  
  return (
    <div  className='flex flex-col justify-center mr-auto w-auto  h-full pb-44 sm:h-full pt-24 '>
      <h1 className='text-3xl text-center font-bold py-3 px-3'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4'>
        
        <input type="email" id='email'  placeholder="email" className='border rounded-lg p-3 w-80 lowercase focus:outline-none sm:w-96' onChange={handleOnChange} />
        <div>
        <input type="password" id='password' placeholder="password" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' onChange={handleOnChange} />
        <span className='items-center flex justify-center p-2 text-sm w-[32%] m-[0% 67%]'>  <Link to="/forgot_password" className='text-blue-700 hover:underline'>Forgot Password</Link></span>
        </div>

        <button disabled = {loading} className='border rounded-lg p-2 bg-blue-950 text-white font-bold w-80  sm:w-96'>{loading ? "loading..." : "Sign In"   } </button>

      </form>
      <OAuth/>
        <span className='items-center flex justify-center p-2 text-xl'>Do not have an account?  <Link to="/signup" className='text-blue-700 hover:underline'>SignUp</Link></span>
   
    {error && <p className='text-red-700 text-center'> {error} </p>}

    </div>
  )
}




