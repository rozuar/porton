# Configuración de Servicios en Railway

Este documento detalla la configuración de cada servicio en Railway.

## Resumen de Servicios

| Servicio | Carpeta | Tipo | Root Directory | Variables Requeridas |
|----------|---------|------|----------------|---------------------|
| API | `source/api` | Node.js | `source/api` | `DATABASE_URL`, `JWT_SECRET`, `MQTT_HOST`, `MQTT_PORT`, `MQTT_USERNAME`, `MQTT_PASSWORD` |
| Backoffice | `source/backoffice` | Next.js | `source/backoffice` | `NEXT_PUBLIC_API_URL` |
| Web | `source/web` | Static HTML | `source/web` | Ninguna |
| MQTT | `source/mqtt` | Docker | `source/mqtt` | `MQTT_USER`, `MQTT_PASS` (opcionales) |
| PostgreSQL | - | Plugin | - | - |

## 1. API (NestJS)

### Configuración Railway

**Root Directory**: `source/api`

**railway.toml**:
```toml
[build]
cmd = "npm install && npm run build"

[deploy]
startCommand = "npm run start:prod"
```

### Variables de Entorno

```env
DATABASE_URL=postgresql://...          # Desde plugin PostgreSQL
JWT_SECRET=tu-secret-key              # Generar una clave segura
MQTT_HOST=porton-mqtt.railway.app     # Host interno del servicio MQTT
MQTT_PORT=1883                        # Puerto interno
MQTT_USERNAME=admin                   # Si MQTT tiene auth
MQTT_PASSWORD=password                # Si MQTT tiene auth
```

### Verificación

- ✅ `package.json` tiene `start:prod` script
- ✅ `railway.toml` usa `npm run start:prod`
- ✅ Build command: `npm install && npm run build`

## 2. Backoffice (Next.js)

### Configuración Railway

**Root Directory**: `source/backoffice`

**railway.toml**:
```toml
[build]
cmd = "npm install && npm run build"

[deploy]
startCommand = "npm run start"
```

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://porton-api.railway.app
```

### Verificación

- ✅ `package.json` tiene scripts: `build`, `start`
- ✅ `railway.toml` usa `npm run build` y `npm run start`
- ✅ Railway detectará automáticamente Next.js

## 3. Web (HTML Standalone)

### Configuración Railway

**Root Directory**: `source/web`

**railway.toml**:
```toml
[build]
cmd = "npm install"

[deploy]
startCommand = "npx serve -s . -l $PORT"
```

### Variables de Entorno

Ninguna requerida.

### Verificación

- ✅ `package.json` tiene script `start` (aunque Railway usa el de railway.toml)
- ✅ `railway.toml` usa `$PORT` (variable de Railway)
- ✅ `serve` se instala automáticamente con `npx`

## 4. MQTT Broker (Mosquitto)

### Configuración Railway

**Root Directory**: `source/mqtt`

**Tipo**: Docker

**Dockerfile**:
```dockerfile
FROM eclipse-mosquitto:2

COPY mosquitto.conf /mosquitto/config/mosquitto.conf
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

### Variables de Entorno (Opcionales)

```env
MQTT_USER=admin                       # Usuario para autenticación
MQTT_PASS=password                    # Contraseña para autenticación
```

Si no se definen, Mosquitto queda abierto (solo para pruebas).

### Configuración Adicional

1. **Puerto**: Expone `1883` (TCP)
2. **TCP Proxy**: Activar para exponer host público para NodeMCU
3. **Host interno**: Usado por API (más rápido y privado)
4. **Host público**: Usado por NodeMCU (TCP Proxy)

### Verificación

- ✅ `Dockerfile` existe y es correcto
- ✅ `mosquitto.conf` configurado
- ✅ `entrypoint.sh` maneja autenticación opcional

## 5. PostgreSQL

### Configuración Railway

**Tipo**: Plugin de Railway

No requiere configuración adicional, Railway lo gestiona automáticamente.

### Variables de Entorno

Railway proporciona automáticamente:
- `DATABASE_URL` - URL de conexión completa

## Checklist de Deploy

### Antes de Deployar

- [ ] Todos los servicios tienen `railway.toml` (excepto MQTT que usa Dockerfile)
- [ ] Variables de entorno configuradas
- [ ] Root Directory correcto en cada servicio
- [ ] Scripts en `package.json` coinciden con `railway.toml`

### Después de Deployar

- [ ] API responde en `/api/health` o similar
- [ ] Backoffice carga correctamente
- [ ] Web sirve `porton.html`
- [ ] MQTT acepta conexiones
- [ ] PostgreSQL accesible desde API

## URLs Esperadas

Después del deploy:

```
https://porton-api.railway.app          → API
https://porton-backoffice.railway.app   → Backoffice
https://porton-web.railway.app          → Web (HTML)
tcp://porton-mqtt.railway.app:1883     → MQTT (TCP Proxy)
```

## Troubleshooting

### API no inicia

- Verificar `DATABASE_URL` está configurada
- Verificar `JWT_SECRET` está configurada
- Revisar logs en Railway

### Backoffice no carga

- Verificar `NEXT_PUBLIC_API_URL` apunta a la API correcta
- Verificar que la API esté corriendo
- Revisar consola del navegador

### Web no sirve archivos

- Verificar que `porton.html` esté en la raíz de `source/web`
- Verificar que `serve` se instale correctamente
- Revisar logs en Railway

### MQTT no acepta conexiones

- Verificar que el puerto `1883` esté expuesto
- Verificar TCP Proxy activado
- Revisar logs del contenedor Docker

## Más Información

- [Guía de Deploy Completa](./docs/railway-deploy.md)
- [Arquitectura del Proyecto](./ARQUITECTURA.md)
- [Estructura de Carpetas](./ESTRUCTURA.md)
