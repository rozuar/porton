# Estructura del Proyecto - Carpetas Separadas

Cada servicio está en su propia carpeta dentro de `source/` para facilitar el deploy independiente en Railway.

## Estructura de Carpetas

```
source/
├── api/              # API Backend (NestJS)
├── backoffice/       # Backoffice Next.js (Administración)
├── web/              # Control Portón HTML (Standalone)
├── android/          # App Android
├── mqtt/             # MQTT Broker (Mosquitto)
└── infra/            # Infraestructura (NodeMCU firmware)
```

## Servicios y Carpetas

### 1. API (`source/api/`)
- **Tecnología**: NestJS + PostgreSQL
- **Propósito**: Backend API REST
- **Deploy**: Servicio independiente en Railway
- **Root Directory**: `source/api`

### 2. Backoffice (`source/backoffice/`)
- **Tecnología**: Next.js 14 + React + TypeScript
- **Propósito**: Panel de administración
- **Deploy**: Servicio independiente en Railway
- **Root Directory**: `source/backoffice`
- **Variable**: `NEXT_PUBLIC_API_URL`

### 3. Control Portón (`source/web/`)
- **Tecnología**: HTML5 + CSS3 + JavaScript
- **Propósito**: Control simple del portón
- **Deploy**: Servicio independiente en Railway
- **Root Directory**: `source/web`

### 4. App Android (`source/android/`)
- **Tecnología**: Kotlin + Jetpack Compose
- **Propósito**: App móvil Android
- **Deploy**: No se despliega en Railway (APK)

### 5. MQTT Broker (`source/mqtt/`)
- **Tecnología**: Mosquitto (Docker)
- **Propósito**: Broker MQTT para comunicación
- **Deploy**: Servicio Docker en Railway
- **Root Directory**: `source/mqtt`
- **Variables opcionales**: `MQTT_USER`, `MQTT_PASS`

### 6. Infraestructura (`source/infra/`)
- **Contenido**: Firmware NodeMCU
- **Propósito**: Código para dispositivos IoT
- **Deploy**: No se despliega (se sube al NodeMCU)

## Deploy en Railway

Cada servicio se despliega de forma independiente:

| Servicio | Carpeta | Tipo | Variables |
|----------|---------|------|-----------|
| API | `source/api` | Node.js | `DATABASE_URL`, `JWT_SECRET`, `MQTT_HOST`, etc. |
| Backoffice | `source/backoffice` | Next.js | `NEXT_PUBLIC_API_URL` |
| Web | `source/web` | Static | Ninguna |
| MQTT | `source/mqtt` | Docker | `MQTT_USER`, `MQTT_PASS` (opcionales) |

## Ventajas de Carpetas Separadas

### ✅ Independencia Total
- Cada servicio puede desplegarse independientemente
- Actualizaciones sin afectar otros servicios
- Escalado independiente

### ✅ Claridad
- Fácil identificar qué carpeta corresponde a qué servicio
- Estructura clara y organizada
- Fácil navegación

### ✅ Mantenibilidad
- Código organizado por propósito
- Equipos pueden trabajar en paralelo
- Fácil de entender y mantener

### ✅ Deploy Simplificado
- Railway apunta directamente a cada carpeta
- No hay confusión sobre qué archivos pertenecen a qué servicio
- Configuración clara en `railway.toml` de cada carpeta

## Configuración Railway

Para cada servicio en Railway:

1. **API**: Root Directory = `source/api`
2. **Backoffice**: Root Directory = `source/backoffice`
3. **Web**: Root Directory = `source/web`
4. **MQTT**: Root Directory = `source/mqtt`

Cada carpeta tiene su propio `railway.toml` con la configuración específica.

## Más Información

- [Arquitectura del Proyecto](./ARQUITECTURA.md)
- [Guía de Deploy en Railway](./docs/railway-deploy.md)
- [Backoffice README](./backoffice/README.md)
- [Web README](./web/README.md)
- [MQTT README](./mqtt/README.md)
