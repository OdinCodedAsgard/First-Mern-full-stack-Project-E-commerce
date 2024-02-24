import React from 'react'
import {useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router';


export default function PrivateRoute() {
    const {currentUser}=useSelector(state=>state.user)
  return (
   currentUser? <Outlet/> :<Navigate to='/sign-in'/>
  )
}
