import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const NavbarOwner = () => {

   const { user } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 text-gray-500
    border-b border-borderColor relative transition-all py-3'>
       <Link to='/'>
         <img src={assets.logo} alt="Logo" className="h-7"/>
       </Link>
       <div className='flex items-center gap-3'>
         <p className='font-semibold text-primary text-sm sm:text-base bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 shadow-xs'>
           Welcome to the Admin Dashboard!
         </p>
         {user?.name && (
           <span className='text-xs font-medium text-gray-500 hidden md:inline-block'>
             ({user.name})
           </span>
         )}
       </div>
    </div>
  )
}

export default NavbarOwner