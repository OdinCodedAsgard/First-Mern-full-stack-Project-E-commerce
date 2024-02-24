// import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Header from './components/header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

function App() {

  return (
    <>
    <BrowserRouter>
    <Header/> 
    <Routes>
      <Route path = "/home" element= {<Home />}/>
      <Route path = "/about" element= {<About/>}/>
      <Route element={<PrivateRoute/>}>
      <Route path = "/profile" element= {<Profile />}/>
      <Route path = '/create-listing' element={<CreateListing />} />
      <Route path='/update-listing/:listingid' element={<UpdateListing />} />
      </Route>
      <Route path='/listings/:listingspecificid' element={<Listing />} />
      <Route path = "/sign-in" element= {<Signin/>}/>
     <Route path = "/sign-up" element={<SignUp/>}/>
     <Route path="/search" element={<Search />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
