import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import vehicleRoutes from "./routes/vehicleRoute.js";
import prisma from "./db.js"; // Import Prisma client

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

// Routes
app.use("/api/vehicles", vehicleRoutes);

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
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

// Function to start the server after ensuring DB connection
const startServer = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log("Database connected successfully.");

    // Start server only if DB connection is successful
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      console.log('Database connection closed.');
      process.exit(0);
    });

  } catch (error) {
    console.error("Failed to connect to the database:", error);
    await prisma.$disconnect(); // Attempt to disconnect even if connection failed during setup
    process.exit(1); // Exit if DB connection fails
  }
};

// Start the application
startServer();
