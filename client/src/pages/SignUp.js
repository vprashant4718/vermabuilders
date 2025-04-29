import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../Components/OAuth';

export default function SignUp(next) {
  
  const [formData, setformData] = useState({});
  const [error, setError] = useState();
  const [Loading, setLoading] = useState();
  const navigate = useNavigate();
   const handleOnChange = (e)=>{
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
    const res = await fetch('/api/auth/signup', 
    {
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
              
          },
          body: JSON.stringify(formData),
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
    <div  className='flex flex-col justify-center mr-auto w-auto  h-full pb-40 sm:h-full pt-20 sm:pb-24'>
      <h1 className='text-3xl text-center font-bold sm:py-3 px-3' >SignUp</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 p-2 sm:p-3'>
        <input type="text" id='username' placeholder="Username" className='border rounded-lg p-3 w-80 lowercase focus:outline-none sm:w-96' onChange={handleOnChange} />
        <input type="email" id='email'  placeholder="email" className='border rounded-lg p-3 w-80 lowercase focus:outline-none sm:w-96' onChange={handleOnChange} />
        <input type="password" id='password' placeholder="password" className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' onChange={handleOnChange} />
        <button disabled = {Loading}  className='border rounded-lg p-2 bg-blue-950 text-white font-bold w-80  sm:w-96'>{Loading ? "Loading..." : "Sign Up"} </button>

      </form>
      <OAuth />
         <span className='items-center flex justify-center p-2 text-xl'>Have an account?  <Link to="/signin" className='text-blue-700 hover:underline'>SignIn</Link></span>
    {error && <p className='text-red-700 text-center'> {error} </p>}

    </div>
  )
}




