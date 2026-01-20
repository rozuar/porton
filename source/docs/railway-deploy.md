# Deploy en Railway (API + MQTT + DB)

## Servicios necesarios
- API (NestJS) en `source/api`
- PostgreSQL (plugin de Railway)
- MQTT Broker (Mosquitto o EMQX)
- Backoffice (Next.js) en `source/web` (opcional en Railway o Vercel)

## 1) PostgreSQL
1. Crea un servicio de PostgreSQL en Railway.
2. Copia el `DATABASE_URL` que te entrega Railway.

## 2) MQTT Broker
### Opcion A: Mosquitto
1. Crea un servicio nuevo (Docker) en Railway.
2. Imagen sugerida: `eclipse-mosquitto:2`.
3. Expone el puerto `1883` (TCP).
4. Habilita usuario/clave si quieres.
5. Activa el **TCP Proxy** para exponer un host publico para la NodeMCU.

### Opcion B: EMQX
1. Crea un servicio nuevo (Docker) en Railway.
2. Imagen sugerida: `emqx/emqx:5`.
3. Expone el puerto `1883` (TCP).
4. Activa el **TCP Proxy** para exponer un host publico para la NodeMCU.

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
1. Crea un servicio y apunta a `source/web`.
2. Variables de entorno:
   - `NEXT_PUBLIC_API_URL` (URL publica del servicio API)

## 5) Verificacion rapida
1. En el backoffice, ingresa como `admin@porton.com`.
2. Crea un dispositivo con `deviceId` igual al del NodeMCU.
3. Asigna permisos al usuario.
4. Desde el dashboard, usa "Abrir".

## Topics MQTT usados
- Comando: `portones/{deviceId}/command`
- Estado: `portones/{deviceId}/status`
# Deploy en Railway (API + MQTT + DB)

## Servicios necesarios
- API (NestJS) en `source/api`
- PostgreSQL (plugin de Railway)
- MQTT Broker (Mosquitto o EMQX)
- Backoffice (Next.js) en `source/web` (opcional en Railway o Vercel)

## 1) PostgreSQL
1. Crea un servicio de PostgreSQL en Railway.
2. Copia el `DATABASE_URL` que te entrega Railway.

## 2) MQTT Broker
### Opcion A: Mosquitto
1. Crea un servicio nuevo (Docker) en Railway.
2. Imagen sugerida: `eclipse-mosquitto:2`.
3. Expone el puerto `1883` (TCP).
4. Habilita usuario/clave si quieres.
5. Activa el **TCP Proxy** para exponer un host publico para la NodeMCU.

### Opcion B: EMQX
1. Crea un servicio nuevo (Docker) en Railway.
2. Imagen sugerida: `emqx/emqx:5`.
3. Expone el puerto `1883` (TCP).
4. Activa el **TCP Proxy** para exponer un host publico para la NodeMCU.

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
1. Crea un servicio y apunta a `source/web`.
2. Variables de entorno:
   - `NEXT_PUBLIC_API_URL` (URL publica del servicio API)

## 5) Verificacion rapida
1. En el backoffice, ingresa como `admin@porton.com`.
2. Crea un dispositivo con `deviceId` igual al del NodeMCU.
3. Asigna permisos al usuario.
4. Desde el dashboard, usa "Abrir".

## Topics MQTT usados
- Comando: `portones/{deviceId}/command`
- Estado: `portones/{deviceId}/status`

