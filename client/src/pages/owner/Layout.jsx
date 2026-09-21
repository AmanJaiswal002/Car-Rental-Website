import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loader from '../../components/Loader'
import { toast } from 'react-hot-toast'

const Layout = () => {
  const { isOwner, loadingUser, navigate, openAdminLogin } = useAppContext()

  useEffect(() => {
    if (!loadingUser && !isOwner) {
      toast.error("Access Denied! Admin credentials required to view the Dashboard.")
      navigate('/')
      openAdminLogin()
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