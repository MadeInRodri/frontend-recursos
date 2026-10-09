import { useAuthStore } from "@/store/useAuthStore"; // Asegúrate de la ruta correcta
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

type FormData = {
  correo: string;
  password: string;
};

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { correo: "", password: "" },
  });

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extraemos la acción de login de nuestro store
  const { login } = useAuthStore();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Hacemos la petición POST al endpoint de login
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`,
        {
          correo: data.correo,
          password: data.password,
        },
      );

      if (response.status === 200) {
        // La API devuelve el token y los datos del usuario
        const { token, usuario } = response.data;

        // Guardamos los datos en Zustand y AsyncStorage
        login(token, {
          id: usuario.id,
          correo: usuario.correo,
          rol: usuario.rol,
        });

        Toast.show({
          type: "success",
          text1: "¡Bienvenido de nuevo!",
          text2: `Has iniciado sesión como ${usuario.rol}`,
        });

        // El redireccionamiento se maneja automáticamente por el _layout.tsx
        // al detectar que ya hay un token en el store.
      }
    } catch (error: any) {
      // Capturamos el error si las credenciales son inválidas[cite: 2]
      const errorMessage =
        error.response?.data?.error || "Error de conexión con el servidor.";
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="local-library" size={32} color="#16a34a" />
          </View>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Continuemos aprendiendo juntos</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Input de Correo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <Controller
              control={control}
              name="correo"
              rules={{
                required: "Requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Correo inválido",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === "correo" && styles.inputFocused,
                    errors.correo && styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name="mail-outline"
                    size={20}
                    color={errors.correo ? "#ef4444" : "#9ca3af"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedInput("correo")}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              )}
            />
            {errors.correo && (
              <Text style={styles.errorText}>{errors.correo.message}</Text>
            )}
          </View>

          {/* Input de Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Requerida",
              }}
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === "password" && styles.inputFocused,
                    errors.password && styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={errors.password ? "#ef4444" : "#9ca3af"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••••••"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isLoading && styles.submitButtonDisabled,
            ]}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Verificando..." : "Entrar"}
            </Text>
            {!isLoading && (
              <MaterialIcons name="login" size={18} color="white" />
            )}
          </Pressable>
        </View>

        <View style={styles.footerContainer}>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.footerText}>
                ¿No tienes cuenta? Regístrate aquí.
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 384,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#dcfce7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: "#dcfce7",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6b7280",
    textAlign: "center",
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 6,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: "#16a34a",
    backgroundColor: "#ffffff",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#1f2937",
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    width: "100%",
    marginTop: 8,
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonPressed: {
    backgroundColor: "#15803d",
  },
  submitButtonDisabled: {
    backgroundColor: "#86efac",
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  footerContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    color: "#16a34a",
    fontWeight: "bold",
  },
});
