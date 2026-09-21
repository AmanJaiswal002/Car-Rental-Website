import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const ManageBooking = () => {

  const { currency, axios, isOwner, loadingUser } = useAppContext() 
  
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const { data } = await axios.post('/api/bookings/delete-owner', { bookingId })
      if (data.success) {
        toast.success("Booking deleted successfully")
        setBookings(prev => prev.filter(b => b._id !== bookingId))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (isOwner && !loadingUser) {
      fetchOwnerBookings()
    }
  },[isOwner, loadingUser])

  return (
     <div className='px-4 pt-10 md:px-10 w-full'>
        
      <Title  title="Manage Bookings"
      subTitle="Track all customer bookings, approve or cancel request, and manage booking status."/>

      <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index)=>(
              <tr key={index} className='border-t border-borderColor text-gray-500'>
                  
               <td className='p-3 flex items-center gap-3'>
                 <img src={booking.car?.image || ''} alt="" className='h-12 w-12 aspect-square rounded-md object-cover bg-gray-100'/>
                 <p className='font-medium max-md:hidden'>{booking.car?.brand || 'Car'} {booking.car?.model || ''}</p>
               </td>

               <td className='p-3 max-md:hidden'>
                 {booking.pickupDate ? String(booking.pickupDate).split('T')[0] : 'N/A'} to {booking.returnDate ? String(booking.returnDate).split('T')[0] : 'N/A'}
               </td>
               
               <td className='p-3'>{currency}{booking.price}</td>

               <td className='p-3 max-md:hidden'>
                 <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
               </td>

               <td className='p-3'>
                <div className='flex items-center gap-4 sm:gap-5'>
                  {booking.status === 'pending' ? (
                   <select onChange={e=> changeBookingStatus(booking._id, e.target.value)} value={booking.status} 
                    className='px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none text-xs'>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="confirmed">Confirm</option>
                   </select>
                  ): (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-500'
                        : 'bg-red-100 text-red-500'}`}>
                    {booking.status}</span>
                  )}

                  <button 
                    onClick={() => handleDeleteBooking(booking._id)} 
                    title="Delete Booking"
                    className="p-1.5 px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all cursor-pointer border border-red-200 text-xs flex items-center gap-1.5 font-medium ml-2 shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
               </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default ManageBooking