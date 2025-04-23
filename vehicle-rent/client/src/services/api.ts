import axios from "axios";
import { Booking, Vehicle, VehicleType } from "../types/Type";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Vehicle types
export const getVehicleTypes = async (
  wheelCount?: number
): Promise<VehicleType[]> => {
  const params = wheelCount ? { wheelCount } : {};
  const response = await api.get("/vehicles/types", { params });
    console.log(response.data, "response-datea");
  return response.data;
};

export const getVehicles = async (
  vehicleTypeId?: number
): Promise<Vehicle[]> => {
  const params = vehicleTypeId ? { vehicleTypeId } : {};
  const response = await api.get("/vehicles", { params });
  return response.data;
};

export const getVehicleById = async (id: number): Promise<Vehicle> => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};
export const createBooking = async (bookingData: Booking): Promise<Booking> => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export default api;
