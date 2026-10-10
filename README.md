# Aplicación de Recursos de Aprendizaje

Aplicación multiplataforma para consultar recursos educativos. Estudiantes pueden explorar recursos, guardarlos en favoritos y calificarlos; docentes pueden crear, actualizar y eliminar recursos. La aplicación móvil y web consume la API REST de [api-recursos](https://github.com/MadeInRodri/api-recursos).

## 1. Información del estudiante y contexto

### Información académica

- **Estudiante:** Rodrigo Alexis Mejía Rivas
- **Institución:** Universidad Don Bosco
- **Carrera o programa:** Ing. en Ciencias de la computación
- **Asignatura:** Desarrollo de Software Multiplataforma
- **Docente:** Alexander Alberto Siguenza Campos
- **Periodo académico:** 4to año - 2do ciclo

### Contexto de la aplicación

El frontend ofrece interfaces según el rol seleccionado al registrarse: **Estudiante** o **Docente**. La sesión se inicia con la API y se conserva localmente para que la navegación dirija al usuario a las pantallas correspondientes a su rol.

La aplicación puede ejecutarse en Android, iOS y web. El backend y su base de datos se despliegan por separado; este proyecto no incluye un servidor ni una base de datos.

## 2. Tecnologías y arquitectura

### Tecnologías principales

| Tecnología o librería                | Uso en el proyecto                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Expo SDK 57**                      | Herramientas y módulos para desarrollar la aplicación multiplataforma.                      |
| **React Native 0.86** y **React 19** | Interfaz para Android, iOS y web.                                                           |
| **Expo Router**                      | Navegación basada en archivos y grupos de rutas para autenticación, estudiantes y docentes. |
| **TypeScript 6**                     | Tipado estático; el proyecto tiene `strict` activado.                                       |
| **Axios**                            | Comunicación HTTP con la API REST.                                                          |
| **Zustand**                          | Estado global de autenticación.                                                             |
| **AsyncStorage**                     | Persistencia local del estado de sesión a través del middleware de persistencia de Zustand. |
| **React Hook Form**                  | Gestión y validación de formularios de autenticación y recursos.                            |
| **React Native Toast Message**       | Notificaciones de éxito, error e información.                                               |
| **Expo Vector Icons**                | Iconos de la interfaz.                                                                      |
| **React Native Web**                 | Compatibilidad con la plataforma web.                                                       |

El proyecto también declara módulos de Expo y React Native para enlaces, imágenes, pantalla de inicio, fuentes, gestos, animaciones, áreas seguras y navegación nativa. Las dependencias y versiones instaladas se encuentran en [`package.json`](./package.json).

### Organización

```text
src/
├── app/
│   ├── _layout.tsx             # Layout raíz y control de sesión/rutas
│   ├── index.tsx               # Redirección inicial por estado y rol
│   ├── (auth)/                 # Inicio de sesión y registro
│   ├── (tabs)/                 # Recursos y favoritos del estudiante
│   └── (docente)/              # Gestión de recursos del docente
├── config/
│   └── toastConfig.tsx         # Apariencia de las notificaciones
├── services/
│   ├── api.ts                  # Cliente HTTP e inclusión del token
│   └── recursos.ts             # Tipos y operaciones de recursos
├── store/
│   └── useAuthStore.ts         # Sesión persistida con Zustand
└── styles/
    └── global.css              # Variables globales de estilos web
```

Las pantallas viven en `src/app/`, donde los grupos `(auth)`, `(tabs)` y `(docente)` organizan los flujos por función y rol. La capa `services` encapsula las solicitudes HTTP; el almacén de autenticación persiste el token y el usuario en el dispositivo. El layout raíz espera a que se restaure la sesión antes de redirigir al inicio de sesión o a la pantalla correspondiente.

## 3. Instalación y configuración local

### Requisitos previos

- Node.js y npm.
- Un emulador/dispositivo Android o iOS para probar la app nativa, o un navegador para probar la versión web.
- Una instancia accesible de la API de recursos.

### Obtener e instalar el proyecto

```bash
git clone https://github.com/MadeInRodri/frontend-recursos.git
cd frontend-recursos
npm install
```

### Configurar la conexión con la API

Crea un archivo `.env` en la raíz del proyecto:

```dotenv
EXPO_PUBLIC_API_URL=https://tu-api.example.com
```

Configura el valor como la URL base del backend, sin añadir `/api` al final. Para desarrollo local, reemplaza el ejemplo por la dirección donde la API sea accesible. En un teléfono físico, `localhost` apunta al propio teléfono; usa una dirección de red accesible desde el dispositivo o una URL HTTPS.

Las variables `EXPO_PUBLIC_*` se incorporan al código cliente y no son secretas. No guardes contraseñas, claves privadas ni credenciales en ellas. El `.env` está excluido del control de versiones por [`.gitignore`](./.gitignore).

### Ejecutar la aplicación

Inicia Expo:

```bash
npm run start
```

También puedes iniciar directamente una plataforma:

```bash
npm run android
npm run ios
npm run web
```

Los comandos de Android e iOS requieren el entorno de desarrollo correspondiente o un dispositivo conectado. Para abrir la aplicación web en el navegador se usa el script `web`.

### Comprobaciones

```bash
npm run lint
npx tsc --noEmit
```

## 4. Funcionalidades

| Rol        | Funcionalidad                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Público    | Crear una cuenta como estudiante o docente e iniciar sesión.                                           |
| Estudiante | Consultar recursos, abrir sus enlaces, agregarlos a favoritos y calificarlos de una a cinco estrellas. |
| Estudiante | Consultar la lista de favoritos.                                                                       |
| Docente    | Consultar los recursos, crear nuevos, editar sus datos y eliminarlos.                                  |

La aplicación consume los endpoints de autenticación y recursos del backend. Las operaciones que requieren sesión envían el token almacenado por la aplicación.

## 5. Despliegue

No hay un despliegue configurado o una URL publicada para este frontend en el repositorio. El archivo [`app.json`](./app.json) habilita la salida web estática (`web.output: "static"`), pero todavía no existe `eas.json` ni un flujo EAS de CI/CD. El despliegue del backend también es independiente; configura `EXPO_PUBLIC_API_URL` con una API accesible antes de compilar o publicar el frontend.

### Publicar la versión web con EAS Hosting

Con una cuenta de Expo y EAS CLI disponible:

```bash
npx expo export --platform web
npx eas-cli@latest deploy
```

El primer comando genera la versión web estática en `dist/`; el segundo publica una implementación de vista previa y muestra su URL. Para publicar la versión de producción:

```bash
npx eas-cli@latest deploy --prod
```

### Crear builds móviles con EAS Build

Configura EAS Build una vez y luego genera el build de la plataforma deseada:

```bash
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android
npx eas-cli@latest build --platform ios
```

EAS puede solicitar configuración de credenciales de firma. Para publicar en Google Play o App Store también se necesitan las cuentas de desarrollador correspondientes. Consulta la [guía de builds para tiendas](https://docs.expo.dev/deploy/build-project/) y la [guía de despliegue web](https://docs.expo.dev/deploy/web/) de Expo.

## 6. Enlaces del proyecto

- **Repositorio de esta API:** [MadeInRodri/api-recursos](https://github.com/MadeInRodri/api-recursos)
- **Deploy de la API:** [Railway(api-recursos)](https://api-recursos-production.up.railway.app)
- **Repositorio de la aplicación móvil:** [MadeInRodri/frontend-recursos](https://github.com/MadeInRodri/frontend-recursos)
- **Video explicativo:** [MadeInRodri/api-recursos](https://youtu.be/OWIHBBx5LD0)