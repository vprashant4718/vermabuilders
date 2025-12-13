import React, { useState } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import {toast } from 'react-toastify';

export default function CreateListing() {
    const navigate = useNavigate();
    const {currentUser}= useSelector(state => state.user)
    const [files, setfiles] = useState([]);
    const [formdata, setformdata] = useState({
            imageUrl: [],
            name:"",
            description: "",
            address : "",
            type:"rent",
            regularprice:50,
            bathrooms:1,
            bedrooms:1,
            furnished:false,
            parking:false,
                });

    const [ImageUploadError, setImageUploadError] = useState(false);
    const [upload, setImageUploading] = useState(false);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const backendUrl = process.env.REACT_APP_BASE_URL || "";
    

    const handleImageSubmit=(e)=>{
        if(files.length > 0 && files.length + formdata.imageUrl.length < 7){
            setImageUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));  
            }

         Promise.all(promises).then((urls)=>{
            setformdata({
                ...formdata, imageUrl: formdata.imageUrl.concat(urls)
            });
            setImageUploadError(false)
            setImageUploading(false);
        }).catch((error)=>{
            toast.error('Image upload faile max size 2mb');
            setImageUploading(false);
        });
        
        
        
    }
    else{
       toast.error('You can upload max 6 images');
        setImageUploading(false);
        }
    }

    const storeImage = async(file)=>{
        return new Promise((resolve, reject)=>{
            const storage = getStorage(app);
            const filename = new Date().getTime() + file.name;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                    toast.success(`uploading image ${progress}%`)
                }
                , 
                (error)=>{
                    reject(toast.error(error));
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                        resolve(downloadUrl); 
                    })
                }

            )
       
        })
    }


    const handleRemoveImage =(index)=>{
        setformdata({
            ...formdata,
            imageUrl:formdata.imageUrl.filter((_, i)=> i!== index),
        });
    }


    const handleOnChange =(e)=>{

        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setformdata({
                ...formdata,
                type:e.target.id
                
            }); 
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setformdata({
                ...formdata,
                [e.target.id]:e.target.checked
                
            }); 
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setformdata({
                ...formdata,
                [e.target.id]:e.target.value
                
            }); 
        }

       
    }
    
const handleSubmit=async(e)=>{
    e.preventDefault();
    try {

       if(formdata.name === ''){
            return toast.error('Please enter a title of listing');
        }
        
          if(formdata.description === ''){
            return toast.error('Please enter description');
        }

        if(formdata.address === ''){
            return toast.error('Please enter location ');
        }
        
      
        if(formdata.imageUrl.length < 1) return toast.error('You have to upload minimum 1 image')
        if(formdata.imageUrl.length > 6) return toast.error('You can upload max 6 image')
        setloading(true);
        seterror(false);

        setProgress(30);
        const res = await fetch(`${backendUrl}/api/listing/create`,{
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            ...formdata,
            userRef: currentUser._id
        }),
        credentials: "include",
    })
    setProgress(70);
    const data = await res.json();
    setloading(false);
    if(data.success === false){
        toast.error(data.message);
    }
        setProgress(100);
        toast.success('Your Listing is Live');
navigate(`/listing/${data._id}`);

} catch (error) {
    toast.error(error.message)
}
}
  return (
    <div className='flex flex-col justify-center items-center text-center gap-6 pt-24 '>
      <LoadingBar
        height={5}
        color='#1F51FF'
        className='' progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
        <h1 className='text-center text-3xl font-bold mb-8'>Create Listing</h1>
    <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 sm:flex-row' >
    <div className='flex flex-col justify-center items-center flex-1'>

        <div className='flex flex-col gap-5 mb-5'>
            <input type="text" placeholder='Name' id='name' minLength="8" maxLength="50"  className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96' onChange={handleOnChange} value={formdata.name}/>
            <input type="text" placeholder='Description' id='description' minLength="8" maxLength="100"   className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96'  onChange={handleOnChange} value={formdata.description}/>
            <input type="text" placeholder='Location' id='address' minLength="8" maxLength="100"  className='border rounded-lg p-3 w-80  focus:outline-none sm:w-96'  onChange={handleOnChange} value={formdata.address}/>
        </div>
        <div className='flex flex-wrap   p-3 w-80  focus:outline-none sm:w-96'>
            <div className='flex gap-2  p-2'>
            <input type="checkbox" id='sale' className='w-10 h-10' onChange={handleOnChange} checked={formdata.type === 'sale'}/>
            <span>Sale</span>
            </div>
            <div className='flex gap-2 p-2'>
            <input type="checkbox" id='rent' className='w-10 h-10'  onChange={handleOnChange} checked={formdata.type=== 'rent'}/>
            <span>Rent</span>

            </div>
            <div className='flex gap-2 p-2'>
            <input type="checkbox" id='parking' className='w-10 h-10' onChange={handleOnChange} checked={formdata.parking} />
            <span>Parking</span>

            </div>
            <div className='flex gap-2 p-2'>
            <input type="checkbox" id='furnished' className='w-10 h-10' onChange={handleOnChange} checked={formdata.furnished}/>
            <span>Furnished</span>
            </div>

        </div>

        <div className='flex flex-row my-4 gap-3 flex-wrap p-3 w-80  focus:outline-none sm:w-96'>
            <div className='flex items-center gap-2'>
                <input type="number" id='bedrooms' min={1} max={10} required className='p-3 border border-gray-300 rounded-lg'  onChange={handleOnChange} value={formdata.bedrooms}/>
                <span>Beds</span>
            </div>
            <div className='flex items-center gap-2'>
                <input type="number" id='bathrooms' min={1} max={10} required className='p-3 border border-gray-300 rounded-lg' onChange={handleOnChange} value={formdata.bathrooms}/>
                <span>Baths</span>
            </div>


        <div className='flex gap-2'>
            <input type="number" id='regularprice' min={50}  required className='p-3 border border-gray-300 rounded-lg w-28' onChange={handleOnChange} value={formdata.regularprice}/>

            <div className='flex flex-col items-center'>
                <p>Price</p>
                <span className='text-xs'>(Rupees../lacs)</span>
            </div>
        </div>
        
        </div>
    </div>
    <div className='flex flex-col  flex-1 gap-4  p-3 w-80  focus:outline-none sm:w-96'>
        <p className='font-semibold'>Images:
        <span className='ml-2'>The first image will be the cover max(6)</span>
        </p>

        <div className='flex flex-row items-center flex-1 gap-4'>
            <input type="file" className='rounded w-full p-3 border border-gray-300' onChange={(e)=>setfiles(e.target.files)} accept='images/*' multiple='multiple'/>

            <button type='button' disabled={upload} onClick={handleImageSubmit} className='uppercase text-green-600 border  border-green-600 p-3 rounded font-semibold'>{upload ? 'uploading' : 'upload'}</button>
        </div>
        
            {
            formdata.imageUrl.length > 0 && formdata.imageUrl.map((url, index)=>(
                <div key={index} className="flex justify-between  border border-red-400 p-3 items-center rounded sm:gap-32">
                <img src={url} width={50} height={40}  className='rounded object-contain'/>
                <button type='button' onClick={()=>{handleRemoveImage(index)}} className='text-red-500 border border-red-500 p-2 rounded-lg font-semibold'>DELETE</button>
                </div>
            ))
            }
    <button disabled={loading} className='p-3 uppercase rounded-lg bg-blue-950 text-white hover: opacity-95  disabled:opacity-80'>{loading ? 'Loading' : 'Create Listing'}</button>
   <p className='text-red-600'>{error}</p>
    </div>
    </form>
    </div>
  )
}
