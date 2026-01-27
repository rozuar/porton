# MQTT Broker - Mosquitto

Broker MQTT para comunicación con NodeMCU y API.

## Tecnología

- Mosquitto 2.x (Docker)

## Estructura

```
source/mqtt/
├── Dockerfile          # Imagen Docker
├── mosquitto.conf      # Configuración Mosquitto
├── entrypoint.sh       # Script de inicio
└── README.md          # Este archivo
```

## Deploy en Railway

1. Crea un servicio Docker en Railway
2. Apunta a `source/mqtt`
3. Railway usará el `Dockerfile` para construir la imagen
4. Expone el puerto `1883` (TCP)
5. Activa el **TCP Proxy** para exponer un host público para la NodeMCU

## Variables de Entorno (Opcionales)

Si quieres autenticación, define en Railway:
- `MQTT_USER` - Usuario
- `MQTT_PASS` - Contraseña

Si no defines estas variables, Mosquitto queda abierto (solo para pruebas).

## Configuración para API

- **Host interno**: Usa el host interno del servicio MQTT en Railway
- **Puerto**: `1883`
- **Usuario/Contraseña**: Mismo par del broker (si está configurado)

## Configuración para NodeMCU

- **Host público**: Usa el host público del TCP Proxy (sin `tcp://`)
- **Puerto**: Puerto del TCP Proxy (ej: `16444`)
- **Usuario/Contraseña**: Mismo par del broker (si está configurado)

## Topics Usados

- Comando: `portones/{deviceId}/command`
- Estado: `portones/{deviceId}/status`
- Eventos: `portones/{deviceId}/events`

## Más Información

- [Documentación MQTT Mosquitto Railway](../../docs/mqtt-mosquitto-railway.md)
