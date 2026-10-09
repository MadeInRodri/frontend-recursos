import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

// Interfaz para el formulario basado en la API
type FormData = {
  correo: string;
  password: string;
  rol: "Estudiante" | "Docente"; // Añadimos el rol requerido por la BD
};

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { correo: "", password: "", rol: "Estudiante" },
  });

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedRol = watch("rol"); // Observamos el rol seleccionado para la UI

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Hacemos la petición POST directamente a nuestro backend
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`,
        {
          correo: data.correo,
          password: data.password,
          rol: data.rol,
        },
      );

      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "¡Cuenta creada!",
          text2: "Tu registro fue exitoso. Inicia sesión ahora.",
        });
        router.replace("/(auth)/login");
      }
    } catch (error: any) {
      // Capturamos los errores del backend (ej. contraseña débil, correo repetido)
      const errorMessage =
        error.response?.data?.error || "Ocurrió un error en el servidor.";
      Toast.show({
        type: "error",
        text1: "Error de registro",
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
            <MaterialIcons name="school" size={32} color="#16a34a" />
          </View>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>
            Accede a los mejores recursos de aprendizaje
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Selector de Rol */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Selecciona tu rol</Text>
            <View style={styles.roleContainer}>
              <Pressable
                style={[
                  styles.roleButton,
                  selectedRol === "Estudiante" && styles.roleButtonActive,
                ]}
                onPress={() => setValue("rol", "Estudiante")}
              >
                <MaterialIcons
                  name="person"
                  size={20}
                  color={selectedRol === "Estudiante" ? "#16a34a" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.roleText,
                    selectedRol === "Estudiante" && styles.roleTextActive,
                  ]}
                >
                  Estudiante
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.roleButton,
                  selectedRol === "Docente" && styles.roleButtonActive,
                ]}
                onPress={() => setValue("rol", "Docente")}
              >
                <MaterialIcons
                  name="menu-book"
                  size={20}
                  color={selectedRol === "Docente" ? "#16a34a" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.roleText,
                    selectedRol === "Docente" && styles.roleTextActive,
                  ]}
                >
                  Docente
                </Text>
              </Pressable>
            </View>
          </View>

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
                // Validación de contraseña según el backend
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$\%^&*]).{12,}$/,
                  message:
                    "Debe tener 12+ chars, Mayus, minus, número y especial",
                },
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
              {isLoading ? "Creando..." : "Registrarse"}
            </Text>
            {!isLoading && (
              <MaterialIcons name="arrow-forward" size={18} color="white" />
            )}
          </Pressable>
        </View>

        <View style={styles.footerContainer}>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.footerText}>
                ¿Ya tienes cuenta? Inicia sesión.
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
    backgroundColor: "#f0fdf4", // Verde muy claro, matching el tema
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
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: "#f0fdf4",
    borderColor: "#16a34a",
  },
  roleText: {
    color: "#6b7280",
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#16a34a",
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
