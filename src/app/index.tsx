import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name="school" size={64} color="#16a34a" />
      </View>

      <ActivityIndicator size="large" color="#16a34a" style={styles.spinner} />

      <Text style={styles.text}>Cargando recursos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4", // Fondo verde claro del tema
  },
  iconWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#dcfce7",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#bbf7d0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    color: "#15803d",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
