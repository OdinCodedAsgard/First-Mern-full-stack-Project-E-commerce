import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md';
export default function ListingCard({listing}) {
  
  return (
    <div className='bg-white border h-[377px] mt-5 w-[320px] mx-3 border-orange shadow-md hover:shadow-lg transition-shadow overflow-y-hidden'>
      <Link to={`/listing/${listing._id}`}>
          <img src={listing.imageUrls[0]} alt ='listing cover' className='h-[240px] w-[300px] object-cover mx-2 mt-2 rounded-sm hover:scale-105 transition-scale duration-400'/>
         <div className='p-3 flex-col gap-2'>
          <p className='text-purple text-xl truncate font-semibold '>{listing.name}</p>
          <div className='flex items-center gap-2'>
            <MdLocationOn className='h-4 w-4 text-green' />
            <p className='text-green text-sm font-semibold truncate'>{listing.address}</p>
          </div>
          <p className='line-clamp-2 text-sm text-tahiti font-semibold'>{listing.description}</p>
         <p className='font-semibold mt-2 flex items-center '> $
          {listing.offer?listing.discountPrice.toLocaleString('en-US'): listing.regularPrice.toLocaleString('en-US')}
          {listing.type ==='rent'? '/month':''}
         </p>
         <div className='flex text-sm items-center gap-3 text-oragee'>
          <div>
            {listing.bedrooms >1 ? `${listing.bedrooms} beds`:`${listing.bedrooms} bed` }
          </div>
          <div>
            {listing.bathrooms>1 ? `${listing.bathrooms} baths`:`, ${listing.bathrooms} bath` }
          </div>
         </div>
         </div>
      </Link>
    </div>
  )
}
