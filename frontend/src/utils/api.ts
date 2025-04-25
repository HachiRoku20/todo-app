import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { clearUser } = useAuthStore.getState();
      clearUser();

      Cookies.remove("token");
      Cookies.remove("user");

      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
