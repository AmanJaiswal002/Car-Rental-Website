import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loader from '../../components/Loader'

const Layout = () => {
  const { isOwner, loadingUser, navigate } = useAppContext()

  useEffect(() => {
    if (!loadingUser && !isOwner) {
      navigate('/')
    }
  }, [isOwner, loadingUser])

  if (loadingUser) {
    return <Loader />
  }

  return isOwner ? (
    <div className='flex flex-col'>
       <NavbarOwner />
       <div className='flex'>
         <Sidebar />
         <Outlet />
       </div>
    </div>
  ) : null
}

export default Layout