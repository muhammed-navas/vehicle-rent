 import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const createBookingValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("vehicleId").isInt().withMessage("Valid vehicle ID is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid ISO date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

export const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      errors: errors.mapped(),
    });
  }

  try {
    const bookingData = req.body;
    const { firstName, lastName, vehicleId, startDate, endDate } = bookingData;


    const bookingStartDate = new Date(startDate);
    const bookingEndDate = new Date(endDate);


    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }


    const overlappingBookings = await prisma.booking.findMany({
      where: {
        vehicleId,
        OR: [

          {
            startDate: { lte: bookingStartDate },
            endDate: { gte: bookingStartDate },
          },

          {
            startDate: { lte: bookingEndDate },
            endDate: { gte: bookingEndDate },
          },

          {
            startDate: { gte: bookingStartDate },
            endDate: { lte: bookingEndDate },
          },
        ],
      },
    });

    if (overlappingBookings.length > 0) {
      return res.status(409).json({
        message: "Vehicle is already booked for the selected dates",
        conflictingDates: overlappingBookings.map((booking) => ({
          startDate: booking.startDate,
          endDate: booking.endDate,
        })),
      });
    }


    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        vehicleId,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
      },
      include: {
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
