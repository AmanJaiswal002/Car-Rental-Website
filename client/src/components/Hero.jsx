import React from 'react'
import { assets, cityList, destinationList, returnLocationList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const Hero = () => {

    const {
      pickupLocation, setPickupLocation,
      destination, setDestination,
      returnLocation, setReturnLocation,
      pickupDate, setPickupDate,
      returnDate, setReturnDate,
      navigate
    } = useAppContext()

    const handleSearch = (e) => {
      e.preventDefault()
      const query = new URLSearchParams({
        pickupLocation: pickupLocation || '',
        destination: destination || '',
        pickupDate: pickupDate || '',
        returnDate: returnDate || '',
        returnLocation: returnLocation || 'Same as Pickup Location'
      }).toString()
      navigate(`/cars?${query}`)
    }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='min-h-screen flex flex-col items-center justify-center gap-10 py-16 bg-light text-center px-4 md:px-8'
    >

        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='text-4xl md:text-5xl font-semibold'
        >
          Luxury cars on Rent
        </motion.h1>

        <motion.form 
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSearch} 
          className='flex flex-col xl:flex-row items-stretch xl:items-center justify-between p-5 md:p-6 rounded-3xl xl:rounded-full w-full max-w-xl xl:max-w-7xl bg-white shadow-[0px_8px_25px_rgba(0,0,0,0.08)] border border-gray-100 gap-6'
        >

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 flex-1 text-left items-center px-2'>
            
             {/* 1. Pickup Location */}
             <div className='flex flex-col items-start gap-1 pb-3 sm:pb-0 border-b sm:border-b-0 sm:border-r border-gray-200 pr-2'>
                <select value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)} className='w-full outline-none bg-transparent text-gray-800 font-semibold text-sm md:text-base cursor-pointer'>
                    <option value="">Pickup Location</option>
                    {cityList.map((city)=> <option key={city} value={city}>{city}</option>)}
                </select>
                <p className='text-xs text-gray-400 truncate max-w-[140px] px-1'>{pickupLocation ? pickupLocation : 'Please select location'}</p>
             </div>

             {/* 2. Destination */}
             <div className='flex flex-col items-start gap-1 pb-3 sm:pb-0 border-b sm:border-b-0 xl:border-r border-gray-200 pr-2'>
                <select value={destination} onChange={(e)=>setDestination(e.target.value)} className='w-full outline-none bg-transparent text-gray-800 font-semibold text-sm md:text-base cursor-pointer'>
                    <option value="">Destination</option>
                    {destinationList.map((dest)=> <option key={dest} value={dest}>{dest}</option>)}
                </select>
                <p className='text-xs text-gray-400 truncate max-w-[140px] px-1'>{destination ? destination : 'Select destination'}</p>
             </div>

             {/* 3. Pick-up Date */}
             <div className='flex flex-col items-start gap-1 pb-3 sm:pb-0 border-b sm:border-b-0 sm:border-r border-gray-200 pr-2'>
                <label htmlFor='pickup-date' className='text-sm md:text-base font-semibold text-gray-800 cursor-pointer px-1'>Pick-up Date</label>
                <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date" id="pickup-date" 
                min={new Date().toISOString().split('T')[0]} className='w-full outline-none bg-transparent text-gray-500 text-xs md:text-sm cursor-pointer px-1' required/>
             </div>

             {/* 4. Return Date */}
             <div className='flex flex-col items-start gap-1 pb-3 sm:pb-0 border-b sm:border-b-0 xl:border-r border-gray-200 pr-2'>
                <label htmlFor='return-date' className='text-sm md:text-base font-semibold text-gray-800 cursor-pointer px-1'>Return- Date</label>
                <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" id="return-date" className='w-full outline-none bg-transparent text-gray-500 text-xs md:text-sm cursor-pointer px-1' required/>
             </div>

             {/* 5. Return Location */}
             <div className='flex flex-col items-start gap-1 pr-2'>
                <select value={returnLocation} onChange={(e)=>setReturnLocation(e.target.value)} className='w-full outline-none bg-transparent text-gray-800 font-semibold text-sm md:text-base cursor-pointer'>
                    <option value="Same as Pickup Location">Return Location</option>
                    {returnLocationList.map((loc)=> <option key={loc} value={loc}>{loc}</option>)}
                </select>
                <p className='text-xs text-gray-400 truncate max-w-[150px] px-1'>{returnLocation || 'Same as Pickup Location'}</p>
             </div>
        
          </div>

          {/* Search Button */}
          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type='submit'
            className='flex items-center justify-center gap-2 px-9 py-4 bg-primary hover:bg-primary-dull text-white rounded-full font-medium transition cursor-pointer shrink-0 shadow-md w-full xl:w-auto'
          >
             <img src={assets.search_icon} alt="search" className='brightness-300 w-4 h-4'/>
             Search
          </motion.button>
        </motion.form>

        <motion.img 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          src={assets.main_car} alt="car" className='max-h-74'
        />

    </motion.div>
  )
}

export default Hero