import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion } from 'motion/react'

const Cars = () => {

  // getting search params from url
  const [searchParams, setSearchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation') || ''
  const pickupDate = searchParams.get('pickupDate') || ''
  const returnDate = searchParams.get('returnDate') || ''

  const { cars, axios } = useAppContext()

  const [input, setInput] = useState('')
  const [searchFilteredCars, setSearchFilteredCars] = useState(null)
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(false)

  const isSearchActive = Boolean(pickupLocation || pickupDate || returnDate)

  // Search car availability whenever URL search params change
  useEffect(() => {
    const searchCarAvailability = async () => {
      setLoading(true)
      try {
        const { data } = await axios.post('/api/bookings/check-availability', {
          location: pickupLocation,
          pickupDate,
          returnDate
        })
        if (data.success) {
          setSearchFilteredCars(data.availableCars)
          if (data.availableCars.length === 0) {
            toast('No cars available for the selected criteria', { icon: 'ℹ️' })
          }
        } else {
          toast.error(data.message || 'Error checking car availability')
        }
      } catch (error) {
        console.error("Availability check error:", error)
        toast.error('Failed to search cars')
      } finally {
        setLoading(false)
      }
    }

    if (isSearchActive) {
      searchCarAvailability()
    } else {
      setSearchFilteredCars(null)
    }
  }, [pickupLocation, pickupDate, returnDate])

  // Combine availability results (or all cars) with keyword input filter
  useEffect(() => {
    const baseList = isSearchActive ? (searchFilteredCars || []) : cars

    if (!input.trim()) {
      setFilteredCars(baseList)
      return
    }

    const keyword = input.toLowerCase().trim()
    const filtered = baseList.filter((car) => {
      return (
        car.brand?.toLowerCase().includes(keyword) ||
        car.model?.toLowerCase().includes(keyword) ||
        car.category?.toLowerCase().includes(keyword) ||
        car.transmission?.toLowerCase().includes(keyword) ||
        car.location?.toLowerCase().includes(keyword)
      )
    })
    setFilteredCars(filtered)
  }, [input, searchFilteredCars, cars, isSearchActive])

  const clearFilters = () => {
    setSearchParams({})
    setInput('')
  }

  return (
    <div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut'}}

        className='flex flex-col items-center py-20 bg-light max-md:px-4'>
          <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}

          className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
            <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

            <input onChange={(e)=> setInput(e.target.value)} value={input} type="text"
            placeholder='Search by make, model, category, or location'
            className='w-full h-full outline-none text-gray-500'/>

            {input && (
              <button onClick={() => setInput('')} className='text-xs text-gray-400 hover:text-gray-600 mr-2 cursor-pointer'>
                Clear
              </button>
            )}

            <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}

        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10 mb-20'>
          
          <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>

          {loading ? (
            <div className='flex justify-center items-center py-20'>
              <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
              {filteredCars.map((car, index)=> (
                <motion.div key={car._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                >
                  <CarCard car={car}/>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-center py-16 px-4 bg-gray-50 rounded-2xl max-w-2xl mx-auto mt-6 border border-gray-100'>
              <p className='text-gray-600 text-lg font-medium mb-2'>No cars found</p>
              <p className='text-gray-400 text-sm mb-6'>
                {isSearchActive 
                  ? `There are no available cars in "${pickupLocation || 'selected area'}" for the chosen date range.`
                  : 'No cars match your search filter.'}
              </p>
              <button 
                onClick={clearFilters}
                className='px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full shadow hover:bg-primary-dull transition cursor-pointer'
              >
                View All Cars
              </button>
            </div>
          )}
        </motion.div>

    </div>
  )
}

export default Cars