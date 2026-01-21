# Checklist: rotacion de credenciales

Este documento resume los pasos despues de exponer secretos y reescribir historial.

## 1) Rotar credenciales expuestas
- Cambiar credenciales del WiFi usado por el NodeMCU.
- Cambiar usuario/clave del broker MQTT (Railway Mosquitto).
- Cambiar passwords de usuarios de prueba si siguen activos.
- Rotar cualquier token o API key asociado al proyecto.

## 2) Actualizar configuraciones
- Actualizar `WIFI_SSID` / `WIFI_PASSWORD` en `source/nodemcu/firmware/firmware.ino` antes de flashear.
- Actualizar `MQTT_HOST` / `MQTT_PORT` / `MQTT_USER` / `MQTT_PASS` en `source/nodemcu/firmware/firmware.ino`.
- Actualizar variables en Railway para la API:
  - `MQTT_HOST` (host interno del broker)
  - `MQTT_PORT`
  - `MQTT_USERNAME`
  - `MQTT_PASSWORD`

## 3) Rehacer clones despues del rewrite
Si habia otros clones:
- Opcion A: volver a clonar el repo desde cero.
- Opcion B: actualizar el clone existente:
  - `git fetch --all`
  - `git reset --hard origin/main`

## 4) Verificacion minima
- Re-deploy de la API en Railway.
- Probar apertura con `scripts/provision-nodemcu.sh`.
- Confirmar eventos en logs (backoffice o API).
