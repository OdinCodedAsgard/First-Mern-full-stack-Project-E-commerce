import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import ListingCard from '../components/ListingCard';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Search() {
    const navigate = useNavigate();
    const [loading,setLoading]=useState(true);
    const [listings,setListings]=useState([]);
    const[results,setresult]=useState(false);
    const[hasMore,setHasMore]=useState(true);
    const [noMoreData,setNoMoreData]=useState(false);
    const[fetchLoad,setFetchLoad] = useState(false);
    const [sideBarSearch,setSideBarSearch]=useState({
        searchTerm : '',
        offer:false,
        type:'all',
        sort:'created_at',
        order:'desc',
        furnished: false,
        parking:false,
    });
   
    
  
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermUrl = urlParams.get('searchTerm');
        const  offerUrl = urlParams.get('offer');
        const typeUrl = urlParams.get('type');
        const sortUrl = urlParams.get('sort');
        const  furnishedUrl = urlParams.get('furnished');
        const orderUrl = urlParams.get('order');
        const parkingUrl = urlParams.get('parking');
        if(searchTermUrl||offerUrl||typeUrl||sortUrl||furnishedUrl||orderUrl||parkingUrl){
            setSideBarSearch({
                searchTerm:searchTermUrl|| '',
                type: typeUrl||'all',
                offer:offerUrl ==='true'? true:false,
                furnished:furnishedUrl ==='true'? true:false,
                parking:parkingUrl ==='true'? true:false,
                sort:sortUrl||'created_at',
                order:orderUrl||'desc'
            })
    }
    const fetchListing = async()=>{
        setresult(false);
        setLoading(true);
        const query = urlParams.toString();
        
        const response = await fetch(`http://localhost:3100/api/getAllListings?${query}`);
        const data = await response.json();
        if(data.success ===false){
            setresult(false);
        }

        setLoading(false);
        
        setListings(data.listings);
        if(data.length < 3){
            setShowMore(true);
            setFetchLoad(false)
            setNoMoreData(true)
        }
        setresult(true);
    }
    fetchListing();
},[location.search]);
    //console.log(sideBarSearch);
const handleSearchChange =(e)=>{
   if(e.target.id ==='all' || e.target.id ==='rent' || e.target.id ==='sale'){
    setSideBarSearch({...sideBarSearch,type:e.target.id});
   }
   if(e.target.id ==='searchTerm'){
    setSideBarSearch({...sideBarSearch,searchTerm:e.target.value});
   }
   if(e.target.id ==='parking'|| e.target.id ==='furnished'||  e.target.id==="offer"){
    setSideBarSearch({...sideBarSearch,[e.target.id]:e.target.checked|| e.target.checked ==='true'?true:false});
}
if(e.target.id ==='sort_order'){
    const sort = e.target.value.split('_')[0] || 'created_at';
    const order= e.target.value.split('_')[1] ||'desc';
    
    setSideBarSearch({...sideBarSearch,sort,order})
}
}
const handleSubmit =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm',sideBarSearch.searchTerm);
    urlParams.set('type',sideBarSearch.type);
    urlParams.set('sort',sideBarSearch.sort);
    urlParams.set('order',sideBarSearch.order);
    urlParams.set('parking',sideBarSearch.parking);
    urlParams.set('furnished',sideBarSearch.furnished);
    urlParams.set('offer', sideBarSearch.offer);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

}
const fetchData = async ()=>{
    console.log("fetchin more");
    setFetchLoad(true);
    try {
    const numberOfListings = listings.length;
   
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex',startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`http://localhost:3100/api/getAllListings?${searchQuery}`);
    const data = await res.json();
    const Dta = data.listings;
    if(Dta.length ===0){
        setHasMore(false);
        setNoMoreData(true);
        console.log("no more data")
    }
    setListings([...listings, ...Dta]);
    setFetchLoad(false);
   

}catch(error){
        console.log(error.message);
    }
}
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-8 border-b border-metal sm:border-r md:min-h-screen'>
            <form onSubmit={handleSubmit} className=' flex-col flex gap-6'>
                <div className='flex items center gap-2'>
                    <label className=' font-semibold whitespace-nowrap'>
                        Search Term: 
                    </label>
                    <input onChange={handleSearchChange} value={sideBarSearch.searchTerm} type='text' id="searchTerm" placeholder="search..." className='text-center border rounded-lg p-3 lg:w-sm'/>
                </div>
                <div>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <input onChange={handleSearchChange} value={sideBarSearch.type} checked={sideBarSearch.type ==='all'} type='checkbox' id='all' className='w-4'/><span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <input onChange={handleSearchChange} checked={sideBarSearch.type === 'rent'} type='checkbox' id='rent' className='w-4'/><span>Rent</span>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <input onChange={handleSearchChange} checked={sideBarSearch.type === 'sale'} type='checkbox' id='sale' className='w-4'/><span>Sale</span>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <input onChange={handleSearchChange} checked={sideBarSearch.offer ===true} type='checkbox' id='offer' className='w-4'/><span>Offer Available</span>
                    </div>
                </div>
                <div>
                    <label className='font-semibold'>Ameneties: </label>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <input onChange={handleSearchChange} checked={sideBarSearch.parking===true} type='checkbox' id='parking' className='w-4'/><span>Parking Available</span>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <input onChange={handleSearchChange} checked={sideBarSearch.furnished===true} type='checkbox' id='furnished' className='w-4'/><span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <label className='font-semibold'>Sort:</label>
                    <select onChange={handleSearchChange} defaultValue={'created_at_desc'} className='border p-4 border-metal rounded-lg ' id="sort_order" >
                        <option value='regularPrice_desc' >Price Range high to low</option>
                        <option value='regularPrice_asc' >Price Range Low to High</option>
                        <option value='createdAt_desc'>Latest Publications</option>
                        <option value='createdAt_asc' >Oldest Publication</option>
                    </select>
                </div>
                <button className='bg-metal text-white p-4 rounded-lg uppercase hover:shadow-xl'>Search</button>
            </form>
        </div>
        <div>
            <h1 className='text-4xl font-bold border-b p-4 mt-6 text-tahiti'>Listing Result: </h1>
            <div className='p-6 flex flex-wrap '>
                {!loading && results && listings.length ===0 && (
                    <p className='text-2xl font-semibold text-head text-center uppercase'>No listing Found</p>
                )}
                {loading && !results && (
                    <p className='p-3 text-3xl font-bold  text-oragee uppercase'>Loading ....</p>
                )}
            </div>
            <div className=' flex flex-wrap '>
            {
                results && !loading && listings && (listings.map((listing)=> <ListingCard key={listings._id} listing={listing}/>))
            }
            </div>
            <InfiniteScroll
  dataLength={listings.length} //This is important field to render the next data
  next={fetchData}
  hasMore={hasMore}
  loader={fetchLoad&&(<h4>Loading...</h4>)}
  endMessage={noMoreData &&
    (<p className=' text-head text-3xl font-bold text-center '>
     Enough Mining for the Day you have reached the Bottom.!
    </p>)
  }></InfiniteScroll>
        </div>
    </div>
  )
}
