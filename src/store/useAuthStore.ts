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

function getRoleFromToken(token: string): string | undefined {
  const encodedPayload = token.split(".")[1];
  if (!encodedPayload) return undefined;

  try {
    const base64Payload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const decodedPayload = globalThis.atob(base64Payload);
    const jsonPayload = decodeURIComponent(
      Array.from(decodedPayload, (character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`,
      ).join(""),
    );
    const claims = JSON.parse(jsonPayload) as {
      rol?: unknown;
      role?: unknown;
    };
    const role = claims.rol ?? claims.role;

    return typeof role === "string" ? role : undefined;
  } catch (error) {
    console.warn(
      "No se pudo leer el rol del JWT; se usará el rol de la respuesta de login.",
      error,
    );
    return undefined;
  }
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
        const rol = getRoleFromToken(token) ?? userData.rol;

        set({
          token,
          user: {
            ...userData,
            rol,
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
