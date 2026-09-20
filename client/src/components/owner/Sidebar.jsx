import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {

    const { user, axios, fetchUser } = useAppContext();
    const location = useLocation()
    const [profileImage, setProfileImage] = useState(() => {
        return localStorage.getItem('ownerProfileImage') || user?.image || assets.user_profile;
    });
    const [image, setImage] = useState(null)

    const updateImage = () => {
        if (!image) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e.target.result;
            localStorage.setItem('ownerProfileImage', base64Image);
            setProfileImage(base64Image);
            setImage(null);
        };
        reader.readAsDataURL(image);
    }

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13
    md:max-w-60 w-full border-r border-borderColor text-sm'>

        <div className='group relative'>
            <label htmlFor='image' className='cursor-pointer block relative'>
               <img 
                 src={image ? URL.createObjectURL(image) : (user?.image || profileImage)} 
                 alt="Owner Profile"
                 className='w-32 h-32 rounded-full object-cover shadow-sm'
               />
               <input type="file" id='image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])}/>

               <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/20 rounded-full group-hover:flex
               items-center justify-center cursor-pointer'>
                   <img src={assets.edit_icon} alt="edit" className='w-6 h-6' />
               </div>
            </label>
        </div>
        {image && (
            <button 
                onClick={updateImage} 
                className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer'>
                Save <img src={assets.check_icon} width={13} alt="" />
            </button>
        )}
        <p className='mt-2 text-base font-medium text-center'>{user?.name || "Aman Jaiswal"}</p>

        <div className='w-full mt-4'>
           {ownerMenuLinks.map((link, index)=>(
                <NavLink key={index} to={link.path} end={link.path === '/owner'} className={({ isActive }) => `relative flex items-center gap-2 w-full py-3 pl-4
                 first:mt-6 ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600'}`}>
                    {({ isActive }) => (
                      <>
                        <img src={isActive ? link.coloredIcon : link.icon} alt="icon"/>
                        <span className='max-md:hidden'>{link.name}</span>
                        <div className={`${isActive ? 'bg-primary' : ''} w-1.5 h-8 rounded-l right-0 absolute`}></div>
                      </>
                    )}
                </NavLink>
           ))}
        </div>
    </div>
  )
}

export default Sidebar