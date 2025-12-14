import React from 'react'
import logo from '../Components/vermaBuilders.png'
import owner from '../Components/owner1.png'

export default function About() {
  return ( 
< div className=' items-center m-auto pt-40 mb-3 w-auto p-3 md:w-[60%]'>
  <div className=" flex flex-col justify-center items-center mb-3 gap-16 sm:flex-row lg:gap-32"> 
    <img src={logo}   className='w-52 h-48 bg-white ' alt='logo'/>
      <div className="p-3 flex flex-col w-auto">
            <h1 className="text-3xl font-bold">About Us </h1>
            
            <p className="text-slate-600  font-semibold text-lg w-auto" > 
            Our primary expertise lies in property sale, purchase, and resale services, along with delivering high-quality construction (builder) projects. Whether you're looking to buy, sell, invest, or build, Verma Properties provides complete, transparent, and reliable solutions to meet all your property needs.
            </p>
      </div>

      </div>

<br/>
<hr className='w-auto  m-auto'/>
  <div className="pt-12 flex flex-col justify-center items-center w-auto gap-16 sm:flex-row lg:gap-16"> 
      <div className="p-3 flex flex-col w-auto">
            <h1 className="text-3xl font-bold">Owner</h1>
            
            <p className="text-slate-600  font-semibold text-lg w-auto" > 
            At Verma Properties, we don't just build structures — we build trust, dreams, and futures.
            Founded by <span className='text-bold text-xl'>Chandra Prakash Verma</span>, a visionary leader with a passion for excellence, we have earned a reputation for delivering superior quality in residential, commercial, and infrastructure projects.
              
            </p>
      </div> 
    <img src={owner}   className='w-auto h-60 bg-white ' alt='owner'/>


      </div> 

<hr className='w-auto  m-auto'/>

  </div>
  )
}

