 
import { useEffect, useState } from 'react';


export default function Contact({listing}) {
  const [owner, setowner] = useState(null);
  const [formdata, setFormdata] = useState({});

  useEffect(() => {

    try {
      
      const fetchUser = async()=>{
        const res = await fetch(`/api/user/${listing.userRef}`);
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
    }, [listing.userRef]);
  
  console.log(owner)

const handleOnChange=(e)=>{
   setFormdata({...formdata, [e.target.name]: e.target.value}); 
}


const sendContactDetails = async()=>{
  try {
    const res = await fetch(`/api/listing/sendcontact/${listing.userRef}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    });
    const data = await res.json();
    if (data.success === false) {
      return console.log(data.message);
    }
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}


console.log(formdata);
  return (
   
    <div className='flex flex-col gap-3'>
      <p>Contact <span className='italic font-semibold'> {owner && owner.username} </span>for <span className='italic font-semibold'>{ listing.name}</span> </p>
      <input type="text" name="phone" id="phone" placeholder='Enter Your Phone' onChange={handleOnChange} className='mr-auto w-96 h-10 p-2 border border-slate-300 focus:outline-none mb-3 rounded-lg ' required/>
      <textarea name="message" id="message" placeholder='Enter Your Message...' onChange={handleOnChange} className='mr-auto w-96 h-24 p-2 border border-slate-300 focus:outline-none mb-3 rounded-lg ' ></textarea>
      <button type='button' onClick={sendContactDetails} className='uppercase bg-slate-700 rounded text-lg text-white text-center w-96 p-2'>Send Message</button> 
        </div> 
    
  )
}
