import React from 'react'
import { useSelector } from 'react-redux'
import { useRef,useEffect } from 'react';
import { useState } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { updateUserInfoFail,updateUserInfoSuccess,deleteUserFail,deleteUserStart,deleteUserSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { app } from '../firebase';
import { Link } from 'react-router-dom';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [succ, setSucc]= useState(null);
  const [file, setFile] = useState(undefined);
  const[uploadpt,setuploadpt] = useState(0);
  const {loading,error} =useSelector((state)=>state.user);
  const [err, setErr] = useState(null);
  const [formData,SetFormData]= useState({});
  const[showlistErr,setshowlistErr]=useState(false);
  const[userListing,setUserListing]= useState({});
  const {currentUser } = useSelector(state=>state.user);
  const handleUpdateInfo =(e)=>{
    SetFormData({...formData,[e.target.id]: e.target.value});
  }
  const handleUpdateinfoSubmit = async (e)=>{
    e.preventDefault();
    try{
    const resultUpdate = await fetch(`http://localhost:3100/api/update/${currentUser._id}`,{
      method:"POST",
      credentials: "include",  
      headers:{
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(formData),
    })
    const  res = await resultUpdate.json();
    if(res.success ===false) {
      dispatch(updateUserInfoFail(res.message));
      return;
    }
    dispatch(updateUserInfoSuccess(res));
    setSucc(true);
    setTimeout(()=>{
      setSucc("User Updated Succesfully")
    },5000)
    console.log("success");
    }catch(error){
      dispatch(updateUserInfoFail(error.message));
    }
  }
  const deleteAccount = async ()=>{
    dispatch(deleteUserStart());
    try{
      const deleteUser = await fetch(`http://localhost:3100/api/delete/${currentUser._id}`,{
        method:'DELETE',
        credentials:"include",
        headers:{
          "Content-Type": "application/json"
        }});
        // body:JSON.stringify(user)
    const  res = await deleteUser.json();
    if(res.success ===false) {
      dispatch(deleteUserFail(res.message));
      return;
    }
    dispatch(deleteUserSuccess(res));
    setSucc("User account deleted successfully");
    setTimeout(()=>{
      setSucc(null)
    },5000)
    console.log("success");

    }
    catch(error){
     dispatch(deleteUserFail(error.message));
    }
  }

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
  const handleFileUpload =(file)=>{
    const Storage = getStorage(app);
    const FileName = new Date().getTime() + file.name;
    const storageRef = ref(Storage, FileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
      setuploadpt(Math.round(progress))
      console.log(uploadpt);
    },
    (error)=>{
     setErr(error);
     console.log(err);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {
        SetFormData({...formData,avatar: downloadURL});
    }
    )}
    );
  };
  const signOutUser = async()=>{
      const signOutUsr = await fetch('http://localhost:3100/api/signout',{
        method:'GET',
        credentials: 'include',
        headers:{
          "Content-Type":"application/json"
        },
       })
       const respon = await signOutUsr.json();
       dispatch(deleteUserSuccess(respon))
       setSucc("User Logged Out Successfully")

  }
  const handleShowListing = async()=>{
  console.log("click")
   
      try{
      const res = await fetch(`http://localhost:3100/api/listing/${currentUser._id}`,{
        method:'GET',
        credentials:"include",
      
      })  
      const  data=await res.json();
      if(data.success ===false){
        setshowlistErr(true);
        console.log(data.message);
        return;
      }
      setUserListing(data);
      }catch(err){
        setshowlistErr(true)
      }
  }
  const handleListingDeletion = async(id)=>{
    try{
      const deletion = await fetch(`http://localhost:3100/api/deleteListing/${id}`,{
        method:"DELETE",
        credentials:"include",
      })
      const responseData = await deletion.json();
      if(responseData.success ===false){
        console.log(responseData.message);
        return;
      }
      setUserListing((prev)=> prev.filter((listing)=>listing._id !==id));
    }catch(err){
      console.log(err.message)
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl font-serif text-center my-5'>Profile</h1>
      <form onSubmit={handleUpdateinfoSubmit} className='flex flex-col gap-5'>
        <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onChange={handleUpdateInfo} onClick={()=>fileRef.current.click()} className='rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer' src={formData.avatar || currentUser.avatar} alt="userProfile"/>
        {err ? (<span className='text-head text-center'> error uploading Image Try again</span>): (uploadpt> 0 && uploadpt< 100) ? (<span className='text-tahiti text-center'> {`uploading ${uploadpt}`}</span>) : (uploadpt ===100) ? (<span className='text-tahiti text-center'>Image Uploaded successfully</span>): ""}
        <input onChange={handleUpdateInfo} defaultValue={currentUser.username? currentUser.username : formData.username} type="text" id="username" placeholder='username'className='border p-3 w-108 rounded-lg'/>
        <input onChange={handleUpdateInfo} type="text" id="password" placeholder='password'className='border p-3 w-108 rounded-lg'/>
        <input onChange={handleUpdateInfo} defaultValue={currentUser.email} type="text" id="Email" placeholder='email'className='border p-3 w-108 rounded-lg'/>
        <button onClick={()=>{console.log("first")}} className='bg-cyan text-white rounded-lg p-3 uppercase hover:drop-shadow-xl disabled:opacity-80'>{loading? 'Loading...' : "UpdateInfo"}</button>
        <Link className="bg-oragee text-white p-3 rounded-lg uppercase text-center hover:drop-shadow-xl" to={"/create-listing"}>
          Create a new Listing
        </Link>
      </form>
      <div className='flex justify-between mt-10'>
        <span onClick={deleteAccount} className='text-head font-bold cursor-pointer'>Delete Account</span>
        <span onClick={signOutUser} className='text-head font-bold cursor-pointer'>Sign Out</span>
      </div>
      <p className='mt-4 font-bold text-head'>{succ? "update successfully" : ''}</p>
      <p className='mt-4 font-bold text-head'>{error? error : ''}</p>
       <p className='mt-4 font-bold text-head'>{showlistErr ? "Error showing listings" : ''}</p>
      <button onClick={handleShowListing} className='bg-green text-center p-3 rounded-lg font-extrabold text-metal w-full'>Show Listings</button>
      {userListing && userListing.length > 0 && 
      <div className='flex flex-col gap-3'>
      <h1 className='text-center text-tahiti mt-7 text-2xl font-extrabold '>Your Listings</h1>
      {userListing.map((listing)=>(
      <div key= {listing._id} className='border rounded-lg p-3 flex justify-between items-center my-1 gap-5'>
      <Link to ={`/listing/${listing._id}`}>
      <img src={listing.imageUrls[0]} alt="cover image" className='h-16 w-24 object-contain rounded-lg' />
      </Link>
      <Link className='text-oragee hover:underline truncate font-semibold' to={`/listing/${listing._id}`}>
       <p>{listing.name}</p>
      </Link>
      <div className='flex flex-col items-center gap-2 '>
      <button onClick={()=>{handleListingDeletion(listing._id)}} className='bg-head p-2 text-white rounded-lg font-semibold' >Delete </button>
      <Link to={`/update-listing/${listing._id}`}>
      <button className='bg-green p-2 text-white rounded-lg font-semibold' >Edit </button>
      </Link>
      </div>
      </div>
      ))}
      </div>}
      </div>
    )
}
