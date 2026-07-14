import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton , SignOutButton, UserButton } from '@clerk/clerk-react'
import { Routes,Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
import { useUser } from '@clerk/clerk-react';
import {Toaster} from 'react-hot-toast'
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  const {issignedIn, isLoaded} = useUser()

  // this will get rid of the flickering effect
  if(!isLoaded) return null;

  return (

    <>
    <Routes>
    

    <Route path = "/" element = {!issignedIn ? <HomePage/> : <Navigate to = {"/dashboard"}/>}/>
    <Route path = "/dashboard" element = {issignedIn ? <DashboardPage/> : <Navigate to = {"/"}/>}/>
    <Route path = "/problems" element = {issignedIn ? <ProblemsPage/> : <Navigate to = {"/"}/>}/>

      
    </Routes>
    <Toaster  toastOptions={{duration:3000}}/>
      </>
    
  );
}

export default App;


