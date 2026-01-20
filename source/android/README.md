## Porton Android

App movil para usuarios registrados. Incluye login y boton de apertura con bloqueo temporal.

### Configuracion
1. Abre el proyecto en Android Studio.
2. Edita `BuildConfig.API_BASE_URL` en `app/build.gradle` con la URL publica de la API.
3. Compila y ejecuta.

### Flujo
- Login con email y contrasena.
- Boton "Abrir" se pone verde al enviar comando.
- Se desactiva al cumplirse 10 segundos.

