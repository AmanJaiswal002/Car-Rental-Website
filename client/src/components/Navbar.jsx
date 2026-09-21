import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'

const Navbar = () => {

    const {setShowLogin, user, logout, isOwner, openAdminLogin, setLoginMode, token} = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const isLoggedIn = Boolean(user || token || localStorage.getItem('token'))

    return (
        <motion.div 
        initial={{y: -20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5}}
        className={`flex items-center justify-between px-6 
        md:px-16 lg:px-24 xl:px-32 py-4 text-gray-700 border-b 
        border-borderColor relative transition-all ${location.pathname === "/" ? "bg-light" : "bg-white"}`}>
            
            {/* Logo */}
            <Link to='/' className="flex items-center gap-2">
                <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt="CarRental Logo" className="h-8" />
            </Link>

            {/* Navigation Links */}
            <div className={`max-sm:fixed max-sm:top-[65px] max-sm:h-[calc(100vh-65px)]
                max-sm:w-full max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
                items-start sm:items-center gap-4 sm:gap-8 max-sm:p-6 transition-all duration-300 z-50 
                ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
                {menuLinks.map((link, index) => (
                    <Link 
                        key={index} 
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`text-base font-medium hover:text-primary transition-colors ${location.pathname === link.path ? "text-primary font-semibold" : "text-gray-600"}`}
                    >
                        {link.name}
                    </Link>
                ))}

                <div className='hidden lg:flex items-center text-sm gap-2 border
                border-borderColor px-3 rounded-full max-w-56'>
                    <input type="text" className="py-1.5 w-full bg-transparent
                    outline-none placeholder-gray-500" placeholder="Search products"/>
                    <img src={assets.search_icon} alt="search" />
                </div>

                <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                    {isOwner ? (
                        <button onClick={()=> { setOpen(false); navigate('/owner'); }} 
                        className="cursor-pointer text-red-600 font-semibold border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all">
                            Admin Dashboard
                        </button>
                    ) : (
                        <button onClick={()=> { setOpen(false); openAdminLogin(); }} 
                        className="cursor-pointer text-gray-600 hover:text-red-600 text-sm font-medium transition-all">
                            Admin Login
                        </button>
                    )}

                    <button onClick={()=> { setOpen(false); if (isLoggedIn) { logout(); } else { setLoginMode('login'); setShowLogin(true); } }} className="cursor-pointer px-8 py-2 bg-primary
                    hover:bg-primary-dull transition-all text-white rounded-lg">{isLoggedIn ? 'Logout' : 'Login'}</button>
                </div>
            </div>

            {/* Mobile Menu Icon */}
            <button  className='sm:hidden cursor-pointer' aria-label="Menu"
                onClick={() => setOpen(!open)}>

               <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>
        </motion.div>
    )
}

export default Navbar
