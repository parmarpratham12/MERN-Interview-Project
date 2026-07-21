import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import React from 'react'





function DashboardPage() {
  const navigate = userNavigate()
  const {user} = useUser()
  const [showCreatemodal,setShowCreateModal] = userState(false);
  const [roomconfig , setRoomConfig] = useState ({ problem: "", difficulty:""});
  // -1.56.51



  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage