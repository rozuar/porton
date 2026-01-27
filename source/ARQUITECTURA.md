# Arquitectura del Proyecto Portón

Este documento describe la arquitectura separada del proyecto.

## Estructura General

```
source/
├── api/              # API Backend (NestJS)
├── backoffice/       # Backoffice Next.js (Administración)
├── web/              # Control Portón HTML (Standalone)
├── android/          # App Android
├── mqtt/             # MQTT Broker (Mosquitto)
└── infra/            # Infraestructura (NodeMCU firmware)
```

## Separación de Arquitecturas

### 1. API Backend (`source/api/`)

**Tecnología**: NestJS + PostgreSQL

**Responsabilidades**:
- Autenticación JWT
- Gestión de usuarios
- Gestión de dispositivos
- Gestión de permisos
- Comunicación MQTT
- Logs del sistema

**Deploy**: Servicio independiente en Railway

### 2. Backoffice (`source/backoffice/`)

**Tecnología**: Next.js 14 + React + TypeScript

**Responsabilidades**:
- Administración de usuarios
- Administración de dispositivos
- Administración de permisos
- Visualización de logs
- Solo para administradores

**Deploy**: Servicio independiente en Railway
- Root Directory: `source/backoffice`
- Variable: `NEXT_PUBLIC_API_URL`

### 3. Control Portón (`source/web/`)

**Tecnología**: HTML5 + CSS3 + JavaScript vanilla

**Responsabilidades**:
- Login de usuarios
- Control del portón
- Interfaz simple y rápida

**Deploy**: Servicio independiente en Railway
- Root Directory: `source/web`
- Usa `serve` para archivos estáticos
- No requiere variables de entorno

## Deploy en Railway

### Servicios Necesarios

1. **API** (`source/api/`)
   - Servicio: `porton-api`
   - Root Directory: `source/api`

2. **Backoffice** (`source/backoffice/`)
   - Servicio: `porton-backoffice`
   - Root Directory: `source/backoffice`
   - Variable: `NEXT_PUBLIC_API_URL`

3. **Control Portón** (`source/web/`)
   - Servicio: `porton-web`
   - Root Directory: `source/web`

4. **MQTT Broker** (`source/mqtt/`)
   - Servicio: `porton-mqtt`
   - Root Directory: `source/mqtt`

5. **PostgreSQL**
   - Plugin de Railway

## URLs Resultantes

Después del deploy:

- **API**: `https://porton-api.railway.app`
- **Backoffice**: `https://porton-backoffice.railway.app`
- **Control Portón**: `https://porton-web.railway.app/porton.html`
- **MQTT**: `tcp://porton-mqtt.railway.app:1883`

## Ventajas de la Separación

### ✅ Independencia
- Cada servicio puede desplegarse independientemente
- Actualizaciones sin afectar otros servicios
- Escalado independiente

### ✅ Tecnologías Específicas
- Backoffice usa Next.js (SSR/SSG)
- Web usa HTML estático (más rápido)
- Cada uno optimizado para su propósito

### ✅ Seguridad
- Backoffice solo para administradores
- Web accesible para todos los usuarios
- Separación de responsabilidades

### ✅ Mantenibilidad
- Código organizado por propósito
- Fácil de entender y mantener
- Equipos pueden trabajar en paralelo

## Flujo de Usuarios

### Administrador
1. Accede a `https://porton-backoffice.railway.app`
2. Inicia sesión
3. Gestiona usuarios, dispositivos, permisos
4. Ve logs del sistema

### Usuario Regular
1. Accede a `https://porton-web.railway.app/porton.html`
2. Inicia sesión
3. Abre el portón si tiene permisos

## Comunicación entre Servicios

```
Usuario/Admin
    ↓
[Backoffice/Web] → HTTP/REST → [API] → MQTT → [NodeMCU]
    ↓                              ↓
  JWT Token                    PostgreSQL
```

## Más Información

- [Backoffice README](./backoffice/README.md)
- [Web README](./web/README.md)
- [API README](./api/README.md)
- [Railway Deploy Guide](./docs/railway-deploy.md)
