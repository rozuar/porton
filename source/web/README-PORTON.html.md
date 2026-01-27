# Servicio Web Portón - HTML Standalone

Este es un servicio web HTML standalone que replica la funcionalidad de la aplicación Android para controlar el acceso al portón.

## Características

- ✅ **Autenticación segura** con JWT
- ✅ **Login con email y contraseña**
- ✅ **Control de portón** con Device ID configurable
- ✅ **Persistencia de sesión** (localStorage)
- ✅ **UI moderna y responsive**
- ✅ **Manejo de errores** completo
- ✅ **Accesos rápidos** para pruebas (Admin, Usuario, Invitado)

## Uso

### Opción 1: Con serve

```bash
cd source/web
npx serve -s . -l 3000
```

Luego accede a: `http://localhost:3000/porton.html`

### Opción 2: Servir con un servidor HTTP simple

```bash
# Python 3
cd source/web
python3 -m http.server 8080

# Node.js (http-server)
npx http-server -p 8080

# PHP
php -S localhost:8080
```

Luego accede a: `http://localhost:8080/porton.html`

### Opción 3: Abrir directamente

Puedes abrir el archivo directamente en el navegador, pero ten en cuenta que:
- Las llamadas a la API pueden fallar por CORS si la API no permite requests desde `file://`
- Es mejor usar un servidor HTTP

## Configuración de la API

El archivo detecta automáticamente la URL de la API:

1. **Desarrollo (localhost)**: Usa `http://localhost:3000`
2. **Producción**: Usa `https://porton-api-production.up.railway.app`

### Personalizar la URL de la API

Puedes personalizar la URL de la API agregando un meta tag en el `<head>`:

```html
<meta name="api-url" content="https://tu-api.com" />
```

O modificar directamente en el JavaScript:

```javascript
const API_BASE_URL = 'https://tu-api-personalizada.com';
```

## Credenciales de Prueba

El servicio incluye botones de acceso rápido para pruebas:

- **Admin**: `admin@porton.com` / `CHANGE_ME_PASSWORD`
- **Usuario**: `user@porton.com` / `user123`
- **Invitado**: `guest@porton.com` / `guest123`

## Funcionalidades

### Login
- Validación de email y contraseña
- Manejo de errores de autenticación
- Persistencia de sesión en localStorage
- Recuperación automática de sesión al recargar

### Dashboard
- Campo para Device ID (por defecto: `porton-001`)
- Botón para abrir el portón
- Indicadores de estado (cargando, éxito, error)
- Bloqueo temporal después de abrir (10 segundos)
- Logout que limpia la sesión

## Seguridad

- ✅ Tokens JWT almacenados en localStorage
- ✅ Tokens enviados en header `Authorization: Bearer <token>`
- ✅ Validación de permisos en el backend
- ✅ Limpieza de sesión al hacer logout
- ⚠️ **Nota**: localStorage puede ser accesible por scripts maliciosos (XSS). En producción, considera usar httpOnly cookies.

## Endpoints de la API

El servicio utiliza los siguientes endpoints:

- `POST /api/auth/login` - Autenticación
- `POST /api/gates/open` - Abrir portón (requiere autenticación)

## Estructura del Proyecto

```
source/web/public/
├── porton.html          # Servicio web principal
└── access.html          # Servicio alternativo (conexión directa NodeMCU)
```

## Diferencias con la App Android

| Característica | App Android | Web HTML |
|---------------|-------------|----------|
| Autenticación | JWT | JWT ✅ |
| Persistencia | ViewModel | localStorage ✅ |
| UI Framework | Jetpack Compose | HTML/CSS/JS ✅ |
| Plataforma | Android | Web (cualquier navegador) ✅ |

## Solución de Problemas

### Error de CORS

Si ves errores de CORS, asegúrate de que:
1. La API tiene configurado CORS para permitir tu dominio
2. Estás usando un servidor HTTP (no `file://`)

### Token inválido

Si el token expira o es inválido:
1. Haz logout
2. Vuelve a iniciar sesión

### No se puede conectar a la API

Verifica:
1. Que la URL de la API sea correcta
2. Que la API esté en ejecución
3. Que no haya problemas de red/firewall

## Desarrollo

Para modificar el servicio:

1. Edita `porton.html`
2. Recarga la página en el navegador
3. Usa las herramientas de desarrollador (F12) para debuggear

## Licencia

Mismo que el proyecto principal.
