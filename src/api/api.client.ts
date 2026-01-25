import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/api/api.constants";

/**
 * Axios instance configured with automatic access token injection
 * and base URL configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to automatically add access token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for centralized error handling
 * You can add logic here to handle token expiration, refresh tokens, etc.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (e.g., expired token)
    if (error.response?.status === 401) {
      // You can add logic here to refresh the token or redirect to login
      // For now, just clear the token
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
