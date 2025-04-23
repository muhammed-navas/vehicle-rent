import express from "express";
import { getVehicleById, getVehicles, getVehicleTypes } from "../controllers/vehicleController.js";

const vehicleRoutes = express.Router();

vehicleRoutes.get('/', getVehicles);
vehicleRoutes.get("/types", getVehicleTypes);
vehicleRoutes.get('/:id', getVehicleById);

export default vehicleRoutes;
