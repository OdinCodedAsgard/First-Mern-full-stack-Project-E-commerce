import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import {Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import ListingCard from '../components/ListingCard';
export default function Home() {
  const [ offer,setOffer]=useState([]);
  const[sale,setSale]=useState([]);
  const [rent,setRent]=useState([]);
  SwiperCore.use([Navigation]);
  useEffect(()=>{
 const fetchOffer = async()=>{
 try{
  const offer = await fetch('http://localhost:3100/api/getAllListings?offer=true&limit=4')
  const offerData = await offer.json();
  setOffer(offerData.listings);
 fetchRent();
 }catch(error){
  console.log(error.message);
 }
 }
 const fetchRent = async() =>{
  try{
 const rent = await fetch('http://localhost:3100/api/getAllListings?type=rent&limit=4')
 const rentData = await rent.json();
 setRent(rentData.listings);
 fetchSale();
  }catch(err){
    console.log(err.message);
  }
}
const fetchSale = async()=>{
  try{
  const sale = await fetch('http://localhost:3100/api/getAllListings?type=sale&limit=4')
  const saleData = await sale.json();
  setSale(saleData.listings);
  }catch(err){
    console.log(err.message);
  }
}
  fetchOffer();
  },[])
  return (
    <div>
      <div className='flex flex-col gap-5 p-30 px-3 max-w-6xl '>
        <h1 className='text-orange text-4xl font-bold'>Looking For a <span className='text-metal'>new House</span> </h1><br />
      <p className='text-orange text-xl font-semibold lg:text-lg sm:text-sm'>Created and powered by Mern Stack Development presenting To You RandhawaEState</p>
      
      <Link to={"/search"} className='text-purple font-bold hover:underline'>
      Try  Searching for a Listing!;
      </Link>
      </div>
      <Swiper navigation>
      {offer&& offer.length > 1 && offer.map((listing)=>(
        <SwiperSlide>
          <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:"cover"}} className='h-[450px]' key={listing._id} >

          </div>
        </SwiperSlide>
        )) }
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-7 my-10'> 
{offer  && (
  <div className=' mt-7'>
    <h2 className='text-2xl font-semibold text-orange text-ellipsis'>Recent Offers</h2>
    <Link className= 'text-tahiti text-left text-xl font-sans hover:underline' to={'/search?offer=true'} >See More offer</Link>
    </div>
)}
<div className='flex flex-wrap justify-center gap-5'>
{(offer.map((listing)=>(<ListingCard  listing={listing} key={listing._id}/>)))}
</div>
{sale  && (
  <div className=' mt-7'>
    <h2 className='text-2xl font-semibold text-orange text-ellipsis'>Some featured properties on Sale</h2>
    <Link className= 'text-tahiti text-left text-xl font-sans hover:underline' to={'/search?type=sale'} >See More Properties on Sale</Link>
    </div>
)}
<div className='flex flex-wrap justify-center gap-5'>
{(sale.map((listing)=>(<ListingCard  listing={listing} key={listing._id}/>)))}
</div>
{rent  && (
  <div className=' mt-7'>
    <h2 className='text-2xl font-semibold text-orange text-ellipsis'>Rental Properties </h2>
    <Link className= 'text-tahiti text-left text-xl font-sans hover:underline' to={'/search?type=rent'} >See More Rental properties </Link>
    </div>
)}
<div className='flex flex-wrap justify-center gap-5'>
{(rent.map((listing)=>(<ListingCard  listing={listing} key={listing._id}/>)))}
</div>
      </div>

    </div>
  )
}
