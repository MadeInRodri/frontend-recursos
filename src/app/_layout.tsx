import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { customToastConfig } from "../config/toastConfig";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const { token, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Verificamos si estamos en el grupo de rutas de autenticación
    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      // Si NO hay token y no está en la pantalla de login/registro, lo enviamos al login
      // El setTimeout ayuda a evitar errores de enrutamiento durante el renderizado inicial
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 0);
    } else if (token && inAuthGroup) {
      // Si HAY token y está intentando acceder al login, lo enviamos adentro de la app
      setTimeout(() => {
        router.replace("/(tabs)/recursos");
      }, 0);
    }
  }, [token, segments]);

  return (
    <View style={{ flex: 1 }}>
      {/* Slot renderiza las pantallas hijas de la ruta actual */}
      <Slot />

      {/* Toast se coloca al final para que aparezca por encima de todo */}
      <Toast config={customToastConfig} />
    </View>
  );
}
