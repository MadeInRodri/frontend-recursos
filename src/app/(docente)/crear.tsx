import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  crearRecurso,
  getRecursos,
  Recurso,
  RecursoInput,
} from "../../services/recursos";
import { useAuthStore } from "../../store/useAuthStore";

type FormData = {
  titulo: string;
  descripcion: string;
  tipo: string;
  enlace: string;
};

export default function DocenteDashboardScreen() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { logout, user } = useAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { titulo: "", descripcion: "", tipo: "", enlace: "" },
  });

  const cargarRecursos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRecursos();
      setRecursos(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar los recursos.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargarRecursos();
    }, [cargarRecursos]),
  );

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Agregamos la imagen placeholder automáticamente como solicitaste
      const nuevoRecurso: RecursoInput = {
        ...data,
        imagen:
          "https://via.placeholder.com/400x200.png?text=Recurso+Educativo",
      };

      const response = await crearRecurso(nuevoRecurso);

      Toast.show({
        type: "success",
        text1: "¡Éxito!",
        text2: response.mensaje || "Recurso creado exitosamente.",
      });

      reset(); // Limpiamos el formulario
      setIsModalVisible(false); // Cerramos el popup
      cargarRecursos(); // Recargamos la lista para ver el nuevo recurso
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error al crear el recurso.";
      Toast.show({ type: "error", text1: "Error", text2: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && recursos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Cargando panel del docente...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Personalizado para el Docente */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel Docente</Text>
          <Text style={styles.headerSubtitle}>
            Hola, {user?.nombre || "Profesor"}
          </Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
          <MaterialIcons name="logout" size={16} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Botón para abrir el Modal de Creación */}
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.createButtonPressed,
          ]}
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialIcons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.createButtonText}>Agregar Nuevo Material</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Tus Materiales Publicados</Text>

        <View style={styles.gridContainer}>
          {recursos.map((recurso) => (
            <View key={recurso.id} style={styles.card}>
              <Image
                source={{
                  uri:
                    recurso.imagen ||
                    "https://via.placeholder.com/400x200.png?text=Sin+Imagen",
                }}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.cardBody}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {recurso.titulo}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{recurso.tipo}</Text>
                  </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {recurso.descripcion}
                </Text>

                <Pressable
                  onPress={() =>
                    Linking.openURL(recurso.enlace).catch(() =>
                      Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Enlace inválido.",
                      }),
                    )
                  }
                  style={({ pressed }) => [
                    styles.accessButton,
                    pressed && styles.accessButtonPressed,
                  ]}
                >
                  <Text style={styles.accessButtonText}>Ver enlace</Text>
                  <MaterialIcons name="link" size={16} color="#16a34a" />
                </Pressable>

                {/* Fila Inferior Modificada: Solo botón de Editar */}
                <View style={styles.footerRow}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/(docente)/editar",
                        params: { id: String(recurso.id) },
                      })
                    }
                    style={({ pressed }) => [
                      styles.editButton,
                      pressed && styles.editButtonPressed,
                    ]}
                  >
                    <MaterialIcons name="edit" size={20} color="white" />
                    <Text style={styles.editButtonText}>Editar Recurso</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal / Popup para Crear Recurso */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Material</Text>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Título</Text>
                <Controller
                  control={control}
                  name="titulo"
                  rules={{ required: "El título es obligatorio" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Ej. Curso de React Native"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.titulo && (
                  <Text style={styles.errorText}>{errors.titulo.message}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Recurso</Text>
                <Controller
                  control={control}
                  name="tipo"
                  rules={{ required: "El tipo es obligatorio" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Ej. Video, Libro, Artículo"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.tipo && (
                  <Text style={styles.errorText}>{errors.tipo.message}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Enlace (URL)</Text>
                <Controller
                  control={control}
                  name="enlace"
                  rules={{ required: "El enlace es obligatorio" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="https://..."
                      value={value}
                      onChangeText={onChange}
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.enlace && (
                  <Text style={styles.errorText}>{errors.enlace.message}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción</Text>
                <Controller
                  control={control}
                  name="descripcion"
                  rules={{ required: "La descripción es obligatoria" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Breve descripción del material..."
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  )}
                />
                {errors.descripcion && (
                  <Text style={styles.errorText}>
                    {errors.descripcion.message}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={handleSubmit(onSubmit)}
                style={({ pressed }) => [
                  styles.submitButton,
                  (pressed || isSubmitting) && styles.submitButtonPressed,
                ]}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Guardando..." : "Publicar Recurso"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  loadingText: { marginTop: 12, color: "#15803d", fontWeight: "bold" },

  // Header Docente
  header: {
    backgroundColor: "#16a34a",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "900" },
  headerSubtitle: { color: "#dcfce7", fontSize: 14 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 4,
    fontSize: 14,
  },

  scrollContent: { padding: 16, paddingBottom: 40 },

  // Botón Crear
  createButton: {
    backgroundColor: "#15803d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonPressed: { opacity: 0.8 },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },

  // Grid y Cards
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dcfce7",
    elevation: 2,
    overflow: "hidden",
  },
  image: { width: "100%", height: 100, backgroundColor: "#f3f4f6" },
  cardBody: { padding: 12 },
  titleRow: { flexDirection: "column", marginBottom: 4 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: "#15803d",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  description: { fontSize: 12, color: "#6b7280", marginBottom: 12, height: 32 },

  accessButton: {
    backgroundColor: "#f0fdf4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  accessButtonPressed: { backgroundColor: "#dcfce7" },
  accessButtonText: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },

  footerRow: { flexDirection: "row", justifyContent: "center" },
  editButton: {
    backgroundColor: "#eab308",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  editButtonPressed: { backgroundColor: "#ca8a04" },
  editButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },

  // Modal (Popup)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  formContainer: { gap: 16 },
  inputGroup: { marginBottom: 12 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1f2937",
    fontSize: 14,
  },
  textArea: { height: 80 },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },

  submitButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonPressed: { backgroundColor: "#15803d" },
  submitButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
