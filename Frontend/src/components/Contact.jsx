import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord,setLandlord]=useState(null);
    const[textareaval,setTextareaval]=useState('');
const ontextChange =(e)=>{
    setTextareaval(e.target.value)
}
    useEffect(()=>{
        const fetchLandlord = async()=>{
            try{
                const  response=await fetch(`http://localhost:3100/${listing.userReference}`,{ 
                    method:"GET",
                    credentials:"include"
                });
                const data = await response.json();
                setLandlord(data);
             

            }catch(err){
                console.log(err.message)
            }
        }
        fetchLandlord();
    },[listing.userReference])
  return (
    <div>
        {landlord && (
            <div className='flex flex-col gap-2 mt-3 items-center justify-center'>
                <p>Contact <span className='font-bold'>{landlord.others.username}</span>for <span className='font-bold'>{listing.name}</span></p>
                <textarea name='message' placeholder='enter your message here' className='w-[500px] rounded-lg border p-2' onChange={ontextChange} value={textareaval} id="textMessage" rows={2} cols={90} ></textarea>
                <Link className='text-white bg-midnight text-center font-semibold p-3 uppercase rounded-lg hover:opacity-90' to={`mailto:${landlord.others.email}?subject=Regarding${listing.name}&body=${textareaval}`}>
                 Send Message
                </Link>
            </div>
        )}
    </div>
  )
}
