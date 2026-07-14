import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton , SignOutButton, UserButton } from '@clerk/clerk-react'
import { Routes,Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
import { useUser } from '@clerk/clerk-react';
import {Toaster} from 'react-hot-toast'

function App() {
  const {issignedIn} = useUser()

  return (

    <>
    <Routes>
    

    <Route path = "/" element = {<HomePage/>}/>
    <Route path = "/problems" element = {issignedIn ? <ProblemsPage/> : <Navigate to = {"/"}/>}/>

      
    </Routes>
    <Toaster  toastOptions={{duration:3000}}/>
      </>
    
  );
}

export default App;

// tw ,daisyui, react-router, react-hot-toast 
// todo : react query aka tanstack query , axios
