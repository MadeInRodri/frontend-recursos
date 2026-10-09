import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

const COLORS = {
  background: "#f0fdf4", // Verde muy claro (fondo)
  border: "#bbf7d0", // Borde sutil
  textPrimary: "#166534", // Texto principal oscuro
  textSecondary: "#15803d", // Texto secundario
  success: "#16a34a", // Verde éxito
  error: "#dc2626", // Rojo error
  info: "#2563eb", // Azul info
};

export const customToastConfig: ToastConfig = {
  success: ({ text1, text2, onPress }) => (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.success,
        borderRadius: 12,
        width: "90%",
        padding: 16,
        elevation: 2, // Sombra ligera en Android
        shadowColor: "#000", // Sombra en iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <MaterialIcons name="check-circle" size={24} color={COLORS.success} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text
          style={{ color: COLORS.textPrimary, fontWeight: "700", fontSize: 14 }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 2 }}
          >
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  ),

  error: ({ text1, text2, onPress }) => (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fef2f2", // Fondo rojizo suave
        borderWidth: 1,
        borderColor: "#fecaca",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.error,
        borderRadius: 12,
        width: "90%",
        padding: 16,
        elevation: 2,
      }}
    >
      <MaterialIcons name="error-outline" size={24} color={COLORS.error} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ color: "#991b1b", fontWeight: "700", fontSize: 14 }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ color: "#b91c1c", fontSize: 12, marginTop: 2 }}>
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  ),

  info: ({ text1, text2, onPress }) => (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eff6ff", // Fondo azulado suave
        borderWidth: 1,
        borderColor: "#bfdbfe",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.info,
        borderRadius: 12,
        width: "90%",
        padding: 16,
        elevation: 2,
      }}
    >
      <MaterialIcons name="info-outline" size={24} color={COLORS.info} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ color: "#1e40af", fontWeight: "700", fontSize: 14 }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ color: "#1d4ed8", fontSize: 12, marginTop: 2 }}>
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  ),
};
