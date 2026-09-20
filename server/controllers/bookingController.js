import Booking from "../models/Booking.js"
import Car from "../models/Car.js";

// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    
    const bookings = await Booking.find({
        car,
        status: { $ne: "cancelled" },
        pickupDate: { $lte: rDate },
        returnDate: { $gte: pDate },
    })
    return bookings.length === 0;
} 

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityofCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location
        const cars = await Car.find({location, isAvailable: true})

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car)=>{
          const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
          return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises)
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const carData = await Car.findById(car)
        if (!carData) {
            return res.json({ success: false, message: "Car not found" })
        }

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"})
        }

        // calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const diffTime = Math.abs(returned - picked);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const noOfDays = Math.max(1, diffDays);
        const price = carData.pricePerDay * noOfDays;

        const ownerId = carData.owner || _id;

        await Booking.create({
            car,
            owner: ownerId,
            user: _id,
            pickupDate,
            returnDate,
            price,
            status: "pending"
        })

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

// API to List User Booking
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 })
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

// API to get Owner Bookings
export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const cars = await Car.find({ owner: req.user._id });
        const carIds = cars.map(c => c._id);

        const bookings = await Booking.find({
            $or: [{ owner: req.user._id }, { car: { $in: carIds } }]
        }).populate('car user').select("-user.password").sort({ createdAt: -1 });

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" })
        }

        const car = await Car.findById(booking.car);
        const isOwner = (booking.owner && booking.owner.toString() === _id.toString()) || 
                        (car && car.owner && car.owner.toString() === _id.toString());

        if(!isOwner){
            return res.json({ success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

// API to Cancel/Delete User Booking
export const cancelUserBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId} = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        await Booking.findByIdAndDelete(bookingId);
        res.json({ success: true, message: "Booking Cancelled" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


