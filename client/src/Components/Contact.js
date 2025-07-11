 
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
export default function Contact({ listing }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [owner, setOwner] = useState(null);

  const [formdata, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    email2: '', // owner.email will be set later
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }

        setOwner(data);
       console.log(data);
       console.log(owner);
        setFormData((prev) => ({ ...prev, email2: data.email }));
       
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [listing.userRef]);
  console.log(formdata);

const handleOnChange=(e)=>{
   setFormData({...formdata, [e.target.name]: e.target.value}); 
}



const sendContactDetails = async()=>{
  const sendMessage = document.getElementById('sendMessage');
  const messageSent = document.getElementById('messagesend');
  if (!formdata.phone || !formdata.message) {
    return toast.error('Please fill in all fields');
  }
  
 
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
      return toast.error(data.message);
    }

    toast.success('Message sent successfully');
    sendMessage.style.display = 'none';
    messageSent.style.display = 'block';

  } catch (error) {
    toast.error(error);
  }
}

  return (
   <>
       
       <div className='flex flex-col gap-3' id='sendMessage'>
      <p>Contact <span className='italic font-semibold'> {owner && owner.username} </span>for <span className='italic font-semibold'>{ listing.name}</span> </p>
      <input type="text" name="phone" id="phone" placeholder='Enter Your Phone' onChange={handleOnChange} className='mr-auto w-96 h-10 p-2 border border-slate-300 focus:outline-none mb-3 rounded-lg ' required/>
      <textarea name="message" id="message" placeholder='Enter Your Message...' onChange={handleOnChange} className='mr-auto w-96 h-24 p-2 border border-slate-300 focus:outline-none mb-3 rounded-lg ' ></textarea>
      <button type='button' onClick={sendContactDetails} className='uppercase bg-slate-700 rounded text-lg text-white text-center w-96 p-2 hover:opacity-85'>Send Message</button> 
        </div> 


        <div className='flex flex-col gap-3 hidden' id='messagesend'>
      <span className='uppercase bg-red-700 rounded text-lg text-white text-center w-96 p-2 mt-3 hover:opacity-85'>Message Send Successfully</span> 
        </div> 
    </>

    
  )
}
