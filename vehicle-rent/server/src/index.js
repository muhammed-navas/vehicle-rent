import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import vehicleRoutes from "./routes/vehicleRoute.js";
import prisma from "./db.js"; 
import bookingRoutes from "./routes/bookingRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors())


app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);


app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use(
  (
    err,
    _req,
    res,
    _next
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);


const startServer = async () => {
  try {

    await prisma.$connect();
    console.log("Database connected successfully.");


    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });


    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      console.log('Database connection closed.');
      process.exit(0);
    });

  } catch (error) {
    console.error("Failed to connect to the database:", error);
    await prisma.$disconnect(); 
    process.exit(1); ils
  }
};


startServer();
