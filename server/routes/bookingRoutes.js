import express from "express";
import { cancelUserBooking, changeBookingStatus, checkAvailabilityofCar, createBooking, deleteBookingByOwner, getOwnerBookings,
getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityofCar)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)
bookingRouter.post('/cancel', protect, cancelUserBooking)
bookingRouter.post('/delete-owner', protect, deleteBookingByOwner)

export default bookingRouter;