import axios from "axios";

// In development, use Vite proxy (/api) or direct backend URL
// In production, use the backend URL from environment variable with /api prefix
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api"
    : `${import.meta.env.VITE_BACKEND_URL || ""}/api`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
