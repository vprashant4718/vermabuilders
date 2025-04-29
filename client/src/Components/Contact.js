 
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({formdata}) {
  const [owner, setowner] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {

    try {
      
      const fetchUser = async()=>{
        const res = await fetch(`/api/user/${formdata.userRef}`);
        const data =  await res.json();
        if (data.success === false) {
          return console.log(data.message); 
        }
        
        setowner(data);
      }
      
      fetchUser();
    } catch (error) {
      console.log(error)
    }
    }, [formdata.userRef]);
  
  console.log(owner)

const handleOnChange=(e)=>{
  setMessage( e.target.value);
}

  return (
   
    <div className='flex flex-col gap-3'>
      <p>Contact <span className='italic font-semibold'> {owner && owner.username} </span>for <span className='italic font-semibold'>{ formdata.name}</span> </p>
      <textarea name="message" id="message" placeholder='Enter Your Message...' onChange={handleOnChange} className='mr-auto w-96 h-24 p-2 border border-slate-300 focus:outline-none mb-3 rounded-lg '></textarea>
      <Link to={`mailto:${ owner && owner.email}?subject=Regarding ${formdata.name}&body=${message}`} className='uppercase bg-slate-700 rounded text-lg text-white text-center w-96 p-2'>Send Message</Link> 
        </div> 
    
  )
}
