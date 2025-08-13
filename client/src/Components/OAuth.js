import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {app} from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BASE_URL || "";
    
    const handleGoogleClick = async ()=>{

        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app);
            
            const results = await signInWithPopup(auth, provider);
            const res = await fetch(`${backendUrl}/api/auth/google`,{
            method: 'POST',
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: results.user.displayName, email: results.user.email, photo: results.user.photoURL}),

           });

           const data = await res.json();
           dispatch(signInSuccess(data));
            toast.success('Sign In Success');
           navigate('/');

        } catch (error) {
           toast.error(error);
        }
    }
        return (

         <button onClick={handleGoogleClick} type='button' id='google'  className='border rounded-lg p-2 bg-red-700 text-white font-bold w-52  sm:w-96'>Continue With Google </button>
  )
}
