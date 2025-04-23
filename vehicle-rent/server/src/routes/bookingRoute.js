import { Router } from 'express';
import { createBooking, createBookingValidation, getBookings } from '../controllers/bookingController.js';


const bookingRoutes = Router();


bookingRoutes.get("/", getBookings);
bookingRoutes.post("/", createBookingValidation, createBooking);

export default bookingRoutes;
