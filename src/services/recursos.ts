import api from "./api";

// Definimos las interfaces basadas en la estructura de la base de datos y la API
export interface Recurso {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  enlace: string;
  imagen?: string | null;
}

export interface RecursoInput {
  titulo: string;
  descripcion: string;
  tipo: string;
  enlace: string;
  imagen?: string | null;
}

// ==========================================
// PETICIONES COMPARTIDAS (Estudiantes y Docentes)
// ==========================================

// Obtener todos los recursos, con parámetros opcionales para buscar o filtrar
export const getRecursos = async (busqueda?: string, tipo?: string) => {
  const response = await api.get("/api/recursos", {
    params: { busqueda, tipo },
  });
  return response.data as Recurso[];
};

// ==========================================
// PETICIONES EXCLUSIVAS DEL DOCENTE (CRUD)
// ==========================================

// Crear un nuevo recurso
export const crearRecurso = async (data: RecursoInput) => {
  const response = await api.post("/api/recursos", data);
  return response.data;
};

// Actualizar un recurso existente
export const actualizarRecurso = async (id: number, data: RecursoInput) => {
  const response = await api.put(`/api/recursos/${id}`, data);
  return response.data;
};

// Eliminar un recurso
export const eliminarRecurso = async (id: number) => {
  const response = await api.delete(`/api/recursos/${id}`);
  return response.data;
};

// ==========================================
// PETICIONES EXCLUSIVAS DEL ESTUDIANTE
// ==========================================

// Obtener la lista de recursos favoritos del estudiante
export const getFavoritos = async () => {
  const response = await api.get("/api/recursos/favoritos");
  return response.data as Recurso[];
};

// Agregar un recurso a la lista de favoritos
export const agregarAFavoritos = async (id: number) => {
  const response = await api.post(`/api/recursos/${id}/favoritos`);
  return response.data;
};

// Calificar un recurso (1 a 5 estrellas)
export const calificarRecurso = async (id: number, puntuacion: number) => {
  const response = await api.post(`/api/recursos/${id}/calificar`, {
    puntuacion,
  });
  return response.data;
};
