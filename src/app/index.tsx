import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

export default function IndexScreen() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
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

  if (!hasHydrated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  const initialRoute = !token
    ? "/(auth)/login"
    : user?.rol.trim().toLowerCase() === "docente"
      ? "/(docente)/crear"
      : "/(tabs)/recursos";

  return <Redirect href={initialRoute} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
  },
});
