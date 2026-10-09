import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// Creamos la instancia apuntando a la URL del .env
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use(
  (config) => {
    // Obtenemos el estado actual de Zustand directamente
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
