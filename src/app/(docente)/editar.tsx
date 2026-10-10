import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  actualizarRecurso,
  eliminarRecurso,
  getRecursos,
  RecursoInput,
} from "../../services/recursos";

type FormData = {
  titulo: string;
  descripcion: string;
  tipo: string;
  enlace: string;
};

export default function EditarRecursoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagenExistente, setImagenExistente] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { titulo: "", descripcion: "", tipo: "", enlace: "" },
  });

  useEffect(() => {
    cargarRecurso();
  }, [id]);

  const cargarRecurso = async () => {
    setIsLoading(true);
    try {
      // Utilizamos la búsqueda por ID que configuramos en la API
      const data = await getRecursos(id);

      if (data && data.length > 0) {
        const recurso = data[0];
        setImagenExistente(recurso.imagen ?? null);
        // Precargamos los datos en el formulario
        reset({
          titulo: recurso.titulo,
          descripcion: recurso.descripcion,
          tipo: recurso.tipo,
          enlace: recurso.enlace,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Recurso no encontrado.",
        });
        router.back();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar el recurso.",
      });
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const recursoActualizado: RecursoInput = {
        ...data,
        imagen: imagenExistente?.trim()
          ? imagenExistente
          : "https://via.placeholder.com/400x200.png?text=Recurso+Educativo",
      };

      // Consumimos el endpoint PUT /api/recursos/:id
      await actualizarRecurso(Number(id), recursoActualizado);

      Toast.show({
        type: "success",
        text1: "¡Actualizado!",
        text2: "El recurso se modificó exitosamente.",
      });

      router.back();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error al actualizar el recurso.";
      Toast.show({ type: "error", text1: "Error", text2: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar Recurso",
      "¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: handleEliminar },
      ],
    );
  };

  const handleEliminar = async () => {
    setIsDeleting(true);
    try {
      // Consumimos el endpoint DELETE /api/recursos/:id
      await eliminarRecurso(Number(id));

      Toast.show({
        type: "success",
        text1: "Eliminado",
        text2: "El recurso ha sido eliminado del sistema.",
      });

      router.back();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error al eliminar el recurso.";
      Toast.show({ type: "error", text1: "Error", text2: errorMessage });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>
          Cargando información del recurso...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Editar Material</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Modificar Datos</Text>

          <View style={styles.formContainer}>
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
                    numberOfLines={4}
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

            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleSubmit(onSubmit)}
                style={({ pressed }) => [
                  styles.submitButton,
                  (pressed || isSubmitting) && styles.submitButtonPressed,
                ]}
                disabled={isSubmitting || isDeleting}
              >
                <MaterialIcons name="save" size={20} color="white" />
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Guardando..." : "Actualizar Recurso"}
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmarEliminacion}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deleteButtonPressed,
                ]}
                disabled={isSubmitting || isDeleting}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={20}
                  color="#ef4444"
                />
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? "Eliminando..." : "Eliminar Permanentemente"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
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

  // Header
  header: {
    backgroundColor: "#16a34a",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: { padding: 4 },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },

  scrollContent: { padding: 16, paddingBottom: 40 },

  card: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },

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
    paddingVertical: 12,
    color: "#1f2937",
    fontSize: 14,
  },
  textArea: { height: 100 },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },

  buttonContainer: { marginTop: 16, gap: 12 },
  submitButton: {
    backgroundColor: "#16a34a",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonPressed: { backgroundColor: "#15803d" },
  submitButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  deleteButton: {
    backgroundColor: "#fef2f2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    gap: 8,
  },
  deleteButtonPressed: { backgroundColor: "#fee2e2" },
  deleteButtonText: { color: "#ef4444", fontWeight: "bold", fontSize: 16 },
});
