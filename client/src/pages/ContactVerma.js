import React from 'react'
import logo from '../Components/vermaBuilders.png'
import { FiPhoneCall } from "react-icons/fi";
import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { TbClockHour9Filled } from "react-icons/tb";


export default function ContactVerma() {
  return ( 
      <div className="pt-40  flex flex-row gap-5 w-[32rem] flex-wrap justify-center items-center m-auto  mb-5"> 


      <div className="p-3 flex flex-col items-center justify-center m-auto  w-60 h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
            <FiPhoneCall  className='text-4xl'/>
            <h5 className="text-xl font-bold">Phone Number </h5>
            <p className=" font-semibold text-lg w-52 text-center" > +91 9828811112</p>
      </div>
      <div className="p-3 flex flex-col items-center justify-center m-auto  w-60 h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
      <IoLocation className='text-4xl'/>
            <h5 className="text-xl font-bold">Location </h5>
            <p className=" font-semibold text-lg w-52 text-center" > Near Rawal Hospital, Ajmer Road, pincode 302026, Jaipur Rajasthan. </p>
      </div>
      <div className="p-3 flex flex-col items-center justify-center m-auto  w-60 h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
      <MdEmail  className='text-4xl'/>
            <h5 className="text-xl font-bold">Email </h5>
            <p className=" font-semibold text-lg w-52 text-wrap text-center" > vermabuilders07  @gmail.com
            </p>
      </div>
      <div className="p-3 flex flex-col items-center justify-center m-auto  w-60 h-60 border-2 rounded hover:bg-black hover:text-white ease-in-out transition">
      <TbClockHour9Filled className='text-4xl'/>
            <h5 className="text-xl font-bold">Working Hours </h5>
            <p className=" font-semibold text-lg w-52 text-center" > Daily </p>
            <p className=" font-semibold text-lg w-52 text-center" > 9:00 am  To 8:00 pm</p>
      </div>
      

      </div>

  )
}
