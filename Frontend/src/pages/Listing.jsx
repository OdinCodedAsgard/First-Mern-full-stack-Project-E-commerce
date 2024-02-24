import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { FaBed,FaAddressCard, FaBath, FaParking, FaChair } from 'react-icons/fa';

export default function Listing() {
    SwiperCore.use([Navigation]); // install modules (if necessary)
    const[listing,setListing] = useState(null);
    const[error,setError]=useState(false);
    const {currentUser}= useSelector((state)=> state.user)
    const[loading,setLoading]=useState(false)
    const[contact,setContact]=useState(false);
    const params = useParams();
    useEffect(()=>{
    const fetchlistingspecific = async ()=>{
        setError(false)
        try{
            setLoading(true);
            const listingId = params.listingspecificid;
        const res = await fetch(`http://localhost:3100/api/getListing/${listingId}`);
        const data = await res.json();
        if(data.success ===false){
            setError(true);
            console.log(data.message);
            setLoading(false)
            return;
        }
        setListing(data.listing);
      
        setLoading(false);
        setError(false);
        
    }catch(err){
        setLoading(false);
        setError(true);
    }
    }
    fetchlistingspecific();
    },[params.id])
  return (
    <main>
        {loading && <h1 className='text-center uppercase font-semibold text-tahiti'>loading...</h1>}
        {error && <h1 className='text-center uppercase font-semibold text-tahiti'>Error Occured...</h1>}
        {listing && !loading && !error && (
            (
                <div className='gap-2 justify-center'>
                <Swiper navigation={true}>
                    {listing.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        <div className='h-[400px]' style={{ background: `url(${url}) center no-repeat`,}}></div>
                    </SwiperSlide>))}
                </Swiper>
              <h1 className='text-head text-center font-bold'>{listing.name} -for {listing.type} </h1>
             <div className='flex justify-center items-center gap-2'>
             <div className=' text-head flex items-center gap-2 '> 
              <FaAddressCard className='text-lg' />
              <h1 className='text-head text-center font-bold'>{listing.address}</h1>
              </div>
              </div>
              <p className='font-semibold text-center text-slate-700' >{listing.description}</p>
             <div className='flex justify-center gap-5'>
              <button className='bg-green text-white text-center font-mono p-3 rounded-lg'>
               Regular Price  ${listing.regularPrice}
              </button>
              {listing.discountPrice && (<button className='bg-oragee text-white text-center font-mono p-3 rounded-lg'>
               discount price  ${listing.discountPrice}
               </button>)}
              </div>
              <div>
                {listing.description && 
                <p className='mt-4 font-semibold text-purple text-center'>Description - {listing.description}</p>
                }
                <ul className='flex items-center justify-center  gap-4 flex-wrap'>
                    <li className='flex text-green font-semibold text-sm items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-lg'/> {listing.bedrooms > 1 ?  `${listing.bedrooms} Bedrooms` : `Single BedRoom`}{" "}
                </li>
                <li className='flex text-green font-semibold text-sm items-center gap-1 whitespace-nowrap'>
                <FaBath className='text-lg'/> {listing.bathrooms > 1 ?  `${listing.bathrooms} bathrooms` : `Single bathroom`}{" "}
                </li>
                <li className='flex text-green font-semibold text-sm items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-lg'/> {listing.parking ===true ?  "Parking spot" : "No parking "}{" "}
                </li>
                <li className='flex text-green font-semibold text-sm items-center gap-1 whitespace-nowrap'>
                <FaChair className='text-lg'/> {listing.furnished ===true ?  "Fully Furnished" : "Not Furnished "}{" "}
                </li>
                </ul>
                {currentUser && !contact &&(<div className='flex mt-4 justify-center'>
                <button onClick={()=>setContact(true)} className=' bg-metal p-4 gap-3 text-white rounded-lg uppercase hover:shadow-xl'>Contact Landlord</button>
              </div>)}
              {contact &&(<Contact listing={listing} />)}
              </div>
                </div>
            )
        )}
    </main>
  )
}


// listing.userReference !== currentUser._id add later on