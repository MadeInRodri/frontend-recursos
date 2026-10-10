import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { customToastConfig } from "../config/toastConfig";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const segments = useSegments();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const markHydrated = () => setHasHydrated(true);
    const unsubscribe =
      useAuthStore.persist.onFinishHydration(markHydrated);

    if (useAuthStore.persist.hasHydrated()) {
      markHydrated();
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasHydrated || segments.length === 0) return;

    // Verificamos si estamos en el grupo de rutas de autenticación
    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      const initialRoute =
        user?.rol.trim().toLowerCase() === "docente"
          ? "/(docente)/crear"
          : "/(tabs)/recursos";
      router.replace(initialRoute);
    }
  }, [hasHydrated, token, user, segments, router]);

  return (
    <View style={{ flex: 1 }}>
      {/* Slot renderiza las pantallas hijas de la ruta actual */}
      <Slot />

      {/* Toast se coloca al final para que aparezca por encima de todo */}
      <Toast config={customToastConfig} />
    </View>
  );
}
