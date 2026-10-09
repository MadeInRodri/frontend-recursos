import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  agregarAFavoritos,
  calificarRecurso,
  getRecursos,
  Recurso,
} from "../../services/recursos";

export default function RecursosScreen() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar recursos al montar la pantalla
  useEffect(() => {
    cargarRecursos();
  }, []);

  const cargarRecursos = async () => {
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
  };

  // Función para abrir el enlace del recurso[cite: 1, 2]
  const handleAcceder = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show({
        type: "error",
        text1: "Enlace no válido",
        text2: "No se puede abrir este recurso.",
      });
    }
  };

  // Función para agregar a favoritos[cite: 1, 2]
  const handleAgregarFavorito = async (id: number) => {
    try {
      const response = await agregarAFavoritos(id);
      Toast.show({
        type: "success",
        text1: "¡Añadido!",
        text2: response.mensaje || "Recurso agregado a tus favoritos.",
      });
    } catch (error: any) {
      // Captura el error de duplicidad de la API si ya está en favoritos[cite: 2]
      const errorMessage =
        error.response?.data?.error || "Error al agregar a favoritos.";
      Toast.show({
        type: "error",
        text1: "Aviso",
        text2: errorMessage,
      });
    }
  };

  // Función para calificar el recurso (1 a 5 estrellas)[cite: 2]
  const handleCalificar = async (id: number, puntuacion: number) => {
    try {
      const response = await calificarRecurso(id, puntuacion);
      Toast.show({
        type: "success",
        text1: "¡Gracias!",
        text2: response.mensaje || `Calificaste con ${puntuacion} estrellas.`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al calificar.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Cargando recursos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Explorar Recursos</Text>
        </View>

        <View style={styles.gridContainer}>
          {recursos.map((recurso) => (
            <View key={recurso.id} style={styles.card}>
              {/* Imagen del recurso o placeholder si es null[cite: 2] */}
              {recurso.imagen ? (
                <Image
                  source={{ uri: recurso.imagen }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="image" size={48} color="#9ca3af" />
                </View>
              )}

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

                {/* Botón de Acceder */}
                <Pressable
                  onPress={() => handleAcceder(recurso.enlace)}
                  style={({ pressed }) => [
                    styles.accessButton,
                    pressed && styles.accessButtonPressed,
                  ]}
                >
                  <Text style={styles.accessButtonText}>
                    Acceder al recurso
                  </Text>
                  <MaterialIcons name="open-in-new" size={16} color="white" />
                </Pressable>

                {/* Estrellas y botón de favorito */}
                <View style={styles.footerRow}>
                  {/* Calificación interactiva (1 a 5 estrellas)[cite: 2] */}
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable
                        key={star}
                        onPress={() => handleCalificar(recurso.id, star)}
                        style={styles.starPressable}
                      >
                        <MaterialIcons
                          name="star-outline"
                          size={24}
                          color="#eab308"
                        />
                      </Pressable>
                    ))}
                  </View>

                  {/* Botón de Agregar a Favoritos[cite: 1] */}
                  <Pressable
                    onPress={() => handleAgregarFavorito(recurso.id)}
                    style={({ pressed }) => [
                      styles.favoriteButton,
                      pressed && styles.favoriteButtonPressed,
                    ]}
                  >
                    <MaterialIcons name="star" size={20} color="#16a34a" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {recursos.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>
              No hay recursos disponibles por ahora.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  loadingText: {
    marginTop: 12,
    color: "#15803d",
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1f2937",
    borderBottomWidth: 2,
    borderBottomColor: "#bbf7d0",
    paddingBottom: 8,
    alignSelf: "flex-start",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%", // Mantiene el layout en dos columnas
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#dcfce7",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#f3f4f6",
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    padding: 12,
  },
  titleRow: {
    flexDirection: "column",
    marginBottom: 4,
  },
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
  description: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
    height: 32, // Fija la altura para alinear mejor las tarjetas
  },
  accessButton: {
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  accessButtonPressed: {
    backgroundColor: "#15803d",
  },
  accessButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },
  footerRow: {
    alignItems: "flex-end",
  },
  starsContainer: {
    flexDirection: "row",
  },
  starPressable: {
    padding: 2,
  },
  favoriteButton: {
    backgroundColor: "#f0fdf4",
    padding: 6,
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  favoriteButtonPressed: {
    backgroundColor: "#dcfce7",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#6b7280",
    marginTop: 12,
    fontWeight: "bold",
  },
});
