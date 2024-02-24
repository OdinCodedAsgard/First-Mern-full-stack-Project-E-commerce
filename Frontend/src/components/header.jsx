import React, { useEffect } from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function header() {
  const navigate = useNavigate()
  const [search,setSearch]=useState('');
  const {currentUser} = useSelector(state => state.user);
  const handleSearch =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',search);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const SearchTermURL = urlParams.get('searchTerm');
    if(SearchTermURL){
      setSearch(SearchTermURL);
    }
  },[location.search]);
  return (
    <header className='bg-orange shadow-2xl'>
        <div className='flex justify-between flex-wrap items-center max-w-5xl mx-auto p-2'>
        <h1 className='font-bold text-sm sm:text-xl sm:w-32 flex flex-wrap'>
    <Link to='/'>
    <span className='text-head'>Randhawa</span>
    <span className='text-slate-900'>EState</span>
    </Link>
      </h1>
      <form onSubmit={handleSearch} className='bg-slate-300 p-2 rounded-lg flex items-center'>
        <input value={search} onChange={(e)=> setSearch(e.target.value)} type="text" placeholder='Search...' className='bg-silver flex text-center rounded-lg p-2 mx-2 focus:outline-none w-40sm' />
        <button><FaSearch type='button' className='text-slate-800' /></button>
      </form>
      <ul className='flex gap-3'>
        <Link to='/home'>
        <li className='hidden sm:inline text-slate-1100 hover:underline'>Home</li>
        </Link>
        <Link to='/about'>
        <li className='hidden sm:inline text-slate-1100 hover:underline'>About</li>
        </Link>
        <Link to='/profile'>
        {currentUser ? (<img className="rounded-full h-9 w-9 object-cover"src={currentUser.avatar} alt='profile'/>) : (<li className='text-slate-1100 hover:underline'>Sign in</li>)
        }
        </Link>
      
      </ul>
      </div>
    </header>
  )
}
