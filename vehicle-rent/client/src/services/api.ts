import axios from "axios";
import { VehicleType } from "../types/Type";


const API_URL =  "http://localhost:5000/api";

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
  const response = await api.get<VehicleType[]>("/vehicles/types", { params });
  return response.data;
};

export default api;
