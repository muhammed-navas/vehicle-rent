import { Router } from 'express';
import { createBooking, createBookingValidation, getBookings } from '../controllers/bookingController.js';


const bookingRoutes = Router();

// Get all bookings
bookingRoutes.get("/", getBookings);

// Create a new booking
bookingRoutes.post("/", createBookingValidation, createBooking);

export default bookingRoutes;
