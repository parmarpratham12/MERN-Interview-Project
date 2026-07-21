import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import React from 'react'





function DashboardPage() {
  const navigate = useNavigate()
  const {user} = useUser()
  const [showCreatemodal,setShowCreateModal] = useState(false);
  const [roomconfig , setRoomConfig] = useState ({ problem: "", difficulty:""});
  // -1.56.51



  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage