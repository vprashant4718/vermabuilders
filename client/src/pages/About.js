import React from 'react'
import logo from '../Components/vermaBuilders.png'
import owner from '../Components/owner.png'

export default function About() {
  return ( 
   < div className='pt-40 mb-3'>
  <div className=" flex flex-row justify-center items-center mb-3 gap-32"> 
    <img src={logo}   className='w-100 h-100 bg-white ' alt='logo'/>
      <div className="p-3 flex flex-col w-50">
            <h1 className="text-3xl font-bold">About Us </h1>
            
            <p className="text-slate-600  font-semibold text-lg w-96" > 
            Our primary expertise lies in property sale, purchase, and resale services, along with delivering high-quality construction (builder) projects. Whether you're looking to buy, sell, invest, or build, Verma Builders provides complete, transparent, and reliable solutions to meet all your property needs.
            </p>
      </div>

      </div>

<br/>
<hr className='w-[50rem]  m-auto'/>
  <div className="pt-12 flex flex-row justify-center items-center w-50 gap-32  mb-5"> 
      <div className="p-3 flex flex-col w-50">
            <h1 className="text-3xl font-bold">Owner</h1>
            
            <p className="text-slate-600  font-semibold text-lg w-96" > 
            At Verma Builders, we don't just build structures — we build trust, dreams, and futures.
            Founded by Chandra Prakash Verma, a visionary leader with a passion for excellence, we have earned a reputation for delivering superior quality in residential, commercial, and infrastructure projects.
              
            </p>
      </div> 
    <img src={owner}   className='w-60 h-60 bg-white ' alt='owner'/>


      </div> 

<hr className='w-[50rem]  m-auto'/>

  </div>
  )
}
