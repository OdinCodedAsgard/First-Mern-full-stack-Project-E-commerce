import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {app} from '../firebase';
import { useDispatch } from 'react-redux';
import { SignInSuccess } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router';

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClickGoogle = async()=>{
    try{
     const provider  = new GoogleAuthProvider();
     const auth = getAuth(app);
     const result = await signInWithPopup(auth,provider)
  
    const gDAta = await fetch('http://localhost:3100/api/auth/google',{
      method:'POST',
      credentials: 'include',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
    })
    const data = await gDAta.json()
    dispatch(SignInSuccess(data))
    navigate('/home')
    }catch(error){
      console.log(error);
    }

  }
  return (
    <div type='button' onClick={handleClickGoogle} className='p-3 max-w-lg mx-auto flex flex-col gap-4'>
        <button className='bg-head text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Continue With GOOGLE</button>
    </div>
  )
}
