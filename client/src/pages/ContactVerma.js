import { FiPhoneCall } from "react-icons/fi";
import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { TbClockHour9Filled } from "react-icons/tb";


export default function ContactVerma() {
  return ( 
      <>      <h1 className='text-3xl text-center font-bold py-3 px-3 mb-3 pt-40'>Contact Us</h1>
      <div className="  flex flex-row gap-5  flex-wrap justify-center items-center m-auto  mb-5 sm:w-[32rem]"> 


      <div className="p-3 flex flex-col items-center justify-center m-auto h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
            <FiPhoneCall  className='text-4xl'/>
            <h5 className="text-xl font-bold">Phone Number </h5>
            <p className=" font-semibold text-lg w-52 text-center" > +91 9828811112</p>
      </div>
      <div className="p-3 flex flex-col items-center justify-center m-auto h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
      <IoLocation className='text-4xl'/>
            <h5 className="text-xl font-bold">Location </h5>
            <p className=" font-semibold text-lg w-52 text-center" > Near Rawal Hospital, Samurai Palace, Bhankrota, Ajmer Road, Jaipur Rajasthan, pincode 302026. </p>
      </div>
      <div className="p-3 flex flex-col items-center justify-center m-auto h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
      <MdEmail  className='text-4xl'/>
            <h5 className="text-xl font-bold">Email </h5>
            <p className=" font-semibold text-lg w-52 text-wrap text-center" > vermabuilders07  @gmail.com
            </p>
      </div>
      <div className="p-3 flex flex-col items-center justify-center m-auto h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
      <TbClockHour9Filled className='text-4xl'/>
            <h5 className="text-xl font-bold">Working Hours </h5>
            <p className=" font-semibold text-lg w-52 text-center" > Daily </p>
            <p className=" font-semibold text-lg w-52 text-center" > 9:00 am  To 8:00 pm</p>
      </div>
      

      </div>
</>
  )
}
