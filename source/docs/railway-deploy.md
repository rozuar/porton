# Deploy en Railway (API + MQTT + DB + Backoffice + Web)

## Servicios necesarios
- API (NestJS) en `source/api`
- PostgreSQL (plugin de Railway)
- MQTT Broker (Mosquitto) en `source/mqtt`
- Backoffice (Next.js) en `source/backoffice`
- Control Portón (HTML) en `source/web`

## 1) PostgreSQL
1. Crea un servicio de PostgreSQL en Railway.
2. Copia el `DATABASE_URL` que te entrega Railway.

## 2) MQTT Broker
1. Crea un servicio nuevo (Docker) en Railway.
2. Apunta a `source/mqtt`.
3. Railway usará el `Dockerfile` para construir la imagen.
4. Expone el puerto `1883` (TCP).
5. Variables de entorno opcionales (para autenticación):
   - `MQTT_USER` - Usuario
   - `MQTT_PASS` - Contraseña
6. Activa el **TCP Proxy** para exponer un host publico para la NodeMCU.

## 3) API (NestJS)
1. Crea un servicio desde el repo y apunta a `source/api`.
2. Comandos:
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
3. Variables de entorno recomendadas:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `MQTT_HOST` (host interno del broker dentro de Railway)
   - `MQTT_PORT` (por defecto 1883)
   - `MQTT_USERNAME`
   - `MQTT_PASSWORD`

### Host MQTT interno vs externo
- **API**: usa el host interno del servicio MQTT en Railway (mas rapido y privado).
- **NodeMCU**: usa el host publico (TCP) que expone Railway.

## 4) Backoffice (Next.js)
1. Crea un servicio separado y apunta a `source/backoffice`.
2. Variables de entorno:
   - `NEXT_PUBLIC_API_URL` (URL publica del servicio API)
3. Railway detectará automáticamente Next.js y lo construirá.

## 5) Control Portón (HTML Standalone)
1. Crea un servicio separado y apunta a `source/web`.
2. No requiere variables de entorno (usa serve para archivos estáticos).
3. Railway usará `serve` para servir los archivos HTML.

## 6) Verificacion rapida
1. En el backoffice, ingresa como `admin@porton.com`.
2. Crea un dispositivo con `deviceId` igual al del NodeMCU.
3. Asigna permisos al usuario.
4. Desde el control portón web, usa "Abrir".

## URLs Resultantes

Después del deploy tendrás:
- **API**: `https://porton-api.railway.app`
- **Backoffice**: `https://porton-backoffice.railway.app`
- **Control Portón**: `https://porton-web.railway.app/porton.html`
- **MQTT**: `tcp://porton-mqtt.railway.app:1883`

## Topics MQTT usados
- Comando: `portones/{deviceId}/command`
- Estado: `portones/{deviceId}/status`

## Estructura de Servicios en Railway

```
Railway Project
├── porton-api          (source/api)
├── porton-postgres     (plugin)
├── porton-mqtt         (source/mqtt)
├── porton-backoffice   (source/backoffice)
└── porton-web          (source/web)
```

## Más Información

- [Arquitectura del Proyecto](../ARQUITECTURA.md)
- [Backoffice README](../backoffice/README.md)
- [Web README](../web/README.md)
