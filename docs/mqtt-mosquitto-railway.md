# Mosquitto en Railway (con o sin auth)

## Deploy
1. En Railway: **New Service → Deploy Docker Image**
2. Selecciona este repo y apunta a `infra/mosquitto`.
3. Railway construira la imagen con el `Dockerfile`.
4. Habilita **TCP Proxy** para el puerto `1883`.

## Variables opcionales (auth)
Si quieres usuario/clave, define en el servicio:
- `MQTT_USER`
- `MQTT_PASS`

Si no defines esas variables, Mosquitto queda abierto (solo para pruebas).

## Valores para usar en la API
- `MQTT_HOST`: host **interno** del servicio Mosquitto (no el TCP Proxy)
- `MQTT_PORT`: `1883`
- `MQTT_USERNAME` / `MQTT_PASSWORD`: mismo par del broker

## Valores para la NodeMCU
- `MQTT_HOST`: host **publico** del TCP Proxy (sin `tcp://`)
- `MQTT_PORT`: puerto del TCP Proxy
- `MQTT_USER` / `MQTT_PASS`: mismo par del broker

## Topics
- `portones/{deviceId}/command`
- `portones/{deviceId}/status`

