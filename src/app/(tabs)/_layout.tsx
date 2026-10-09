import { useAuthStore } from "@/store/useAuthStore"; // Asegúrate de ajustar la ruta si es necesario
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function TabsLayout() {
  // Extraemos la acción de logout y los datos del usuario del store
  const { logout, user } = useAuthStore();

  // Función para capitalizar la primera letra del nombre
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const nombreUsuario = user?.nombre
    ? capitalizeFirstLetter(user.nombre)
    : "Estudiante";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#16a34a", // Verde activo
        tabBarInactiveTintColor: "#9ca3af", // Gris inactivo
        headerStyle: { backgroundColor: "#16a34a" }, // Header verde
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
        // Botón de salir global para ambas pantallas
        headerRight: () => (
          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
          >
            <Text style={styles.logoutText}>Salir</Text>
            <MaterialIcons name="logout" size={16} color="white" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="recursos"
        options={{
          title: "Recursos",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: `Favoritos de ${nombreUsuario}`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="star" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Estilos CSS puros para reemplazar NativeWind
const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999, // Pill shape
  },
  logoutButtonPressed: {
    opacity: 0.7,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginRight: 4,
    fontSize: 14,
  },
});
