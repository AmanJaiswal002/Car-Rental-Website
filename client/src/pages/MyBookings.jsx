import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import Loader from '../components/Loader'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency, token, setShowLogin, navigate } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyBookings = async ()=>{
    try {
      const currentToken = token || localStorage.getItem('token')
      const { data } = await axios.get('/api/bookings/user', {
        headers: { Authorization: currentToken }
      })
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      const currentToken = token || localStorage.getItem('token')
      const { data } = await axios.post('/api/bookings/cancel', { bookingId }, {
        headers: { Authorization: currentToken }
      })
      if (data.success) {
        toast.success(data.message)
        setBookings(prev => prev.filter(b => b._id !== bookingId))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (user || token || localStorage.getItem('token')) {
      fetchMyBookings()
    } else {
      setLoading(false)
    }
  },[user, token])

  if (loading) return <Loader />

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}

    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl min-h-[60vh]'>

      <Title title='My Bookings'
      subTitle='View and manage your all car bookings'
      align="left"/>

      {!user && !localStorage.getItem('token') ? (
        <div className='text-center my-16 p-8 border border-borderColor rounded-xl bg-light/30 max-w-md mx-auto'>
          <p className='text-lg font-medium text-gray-700 mb-2'>Please Login to View Your Bookings</p>
          <p className='text-gray-500 mb-6'>Log in to your account to view current and past car reservations.</p>
          <button 
            onClick={() => setShowLogin(true)}
            className='bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dull transition-all font-medium cursor-pointer'>
            Login / Sign Up
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className='text-center my-16 p-8 border border-borderColor rounded-xl bg-light/30 max-w-md mx-auto'>
          <p className='text-lg font-medium text-gray-700 mb-2'>No Bookings Found</p>
          <p className='text-gray-500 mb-6'>You have not booked any cars yet.</p>
          <button 
            onClick={() => navigate('/cars')}
            className='bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dull transition-all font-medium cursor-pointer'>
            Browse Available Cars
          </button>
        </div>
      ) : (
        <div>
          {bookings.map((booking, index)=>(
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}

            key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6
             p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
              {/* Car Image + Info */}

              <div className='md:col-span-1'>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img src={booking.car?.image || assets.car_icon} alt="" className='w-full h-auto aspect-video object-cover bg-gray-100'/>
                </div>
                <p className='text-lg font-medium mt-2'>{booking.car?.brand || 'Car'} {booking.car?.model || ''}</p>

                <p className='text-gray-500'>{booking.car?.year} . {booking.car?.category} . {booking.car?.location}</p>
              </div>

              {/* Booking Info */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2'>
                  <p className='px-3 py-1.5 bg-light rounded font-medium'>Booking #{index+1}</p>
                  <p className={`px-3 py-1 text-xs rounded-full capitalize ${booking.status === 'confirmed' ? 
                   'bg-green-400/15 text-green-600' : booking.status === 'cancelled' ? 'bg-red-400/15 text-red-600' : 'bg-yellow-400/15 text-yellow-600'}`}>{booking.status}</p>
                </div>

                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                  <div>
                    <p className='text-gray-500'>Rental Period</p>
                    <p>{booking.pickupDate ? String(booking.pickupDate).split('T')[0] : 'N/A'} To {booking.returnDate ? String(booking.returnDate).split('T')[0] : 'N/A'}</p>
                  </div>
                </div>

                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                  <div>
                    <p className='text-gray-500'>Pick-up Location</p>
                    <p>{booking.car?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className='md:col-span-1 flex flex-col justify-between gap-4'>
                <div className='text-sm text-gray-500 md:text-right'>
                  <p>Total Price</p>
                  <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
                  <p>Booked on {booking.createdAt ? String(booking.createdAt).split('T')[0] : 'N/A'}</p>
                </div>

                <div className='flex md:justify-end'>
                  <button 
                    onClick={() => handleCancelBooking(booking._id)}
                    className='px-4 py-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-all cursor-pointer font-medium'>
                    Cancel Booking
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
  
    </motion.div>
  )
}

export default MyBookings
