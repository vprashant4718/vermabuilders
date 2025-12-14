 
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Loader2Icon } from 'lucide-react';

export default function Contact({ listing }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [owner, setOwner] = useState(null);
  const [messageSended, setMessageSended] = useState(false);
  const backendUrl = process.env.REACT_APP_BASE_URL;
  const [loading, setLoading] = useState(false);

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
        const res = await fetch(`${backendUrl}/api/user/${listing.userRef}`, {
          method:'GET',
          credentials:'include'
        });
        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }

        setOwner(data);
        setFormData((prev) => ({ ...prev, email2: data.email }));
       
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [listing.userRef]);

const handleOnChange=(e)=>{
   setFormData({...formdata, [e.target.name]: e.target.value}); 
}



const sendContactDetails = async()=>{
  setLoading(true);
  if (!formdata.phone || !formdata.message) {
    setLoading(false);
    toast.error('Please fill in all fields');
    return; 
  }
  
 
  try {
    const res = await fetch(`${backendUrl}/api/listing/sendcontact/${listing.userRef}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
      credentials: "include",
    });
    const data = await res.json();
    if (data.success === false) {
      setLoading(false);
      return toast.error(data.message);
    }
    setLoading(false)
    setMessageSended(true);
    toast.success('Message sent successfully');

  } catch (error) {
    setLoading(false);
    toast.error(error);
  }
}

  return (
   <>
       
   {messageSended === false && <div className='flex flex-col gap-3' id='sendMessage'>

      <p>
        Contact 
        <span className='italic font-semibold'> {owner && owner.username} </span>
        for 
        <span className='italic font-semibold'>
          { listing.name}
        </span> 
      </p>
      <input type="text" name="phone" id="phone" placeholder='Enter Your Phone' onChange={handleOnChange} className='mr-auto w-96 h-10 p-2 border border-slate-300 focus:outline-none mb-3 rounded-lg ' required/>
      <textarea name="message" id="message" placeholder='Enter Your Message...' onChange={handleOnChange} className='mr-auto w-96 h-24 p-2 border border-slate-300 focus:outline-none mb-3 rounded-lg ' ></textarea>
      <button type='button' onClick={sendContactDetails} className='uppercase bg-slate-700 rounded text-lg text-white text-center flex justify-center items-center w-96 p-2 hover:opacity-85'>{loading? <Loader2Icon size={24}  className='animate-spin'/> : 'Send Message'}</button> 
    </div>} 


    {messageSended === true && <div className='flex flex-col gap-3 ' id='messagesend'>
      <span className='bg-green-700 rounded text-sm text-white text-center w-96 p-2 mt-3 hover:opacity-85'>Message Send Successfully</span> 
    </div> }
    </>

    
  )
}
