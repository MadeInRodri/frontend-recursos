import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Definimos la estructura del usuario basada en lo que devuelve la API
interface User {
  id: number;
  correo: string;
  rol: string;
  nombre: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (
    token: string,
    userData: { id: number; correo: string; rol: string },
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      // Función para iniciar sesión y guardar los datos
      login: (token, userData) => {
        // Extraemos el nombre cortando el string por la arroba
        const nombreExtraido = userData.correo.split("@")[0];

        set({
          token,
          user: {
            ...userData,
            nombre: nombreExtraido,
          },
        });
      },

      // Función para cerrar sesión (limpia el estado y el storage)
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // Nombre de la clave en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Usamos AsyncStorage para React Native
    },
  ),
);
