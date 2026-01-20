# NodeMCU / ESP8266

## Objetivo
Conectar el NodeMCU al broker MQTT y activar el rele al recibir `OPEN`.

## Configuracion requerida
- `WIFI_SSID`
- `WIFI_PASSWORD`
- `MQTT_HOST`
- `MQTT_PORT`
- `MQTT_USER`
- `MQTT_PASS`
- `DEVICE_ID`

## Topics
- SUB: `portones/{deviceId}/command`
- PUB: `portones/{deviceId}/status`

## Cableado basico
- **Relay IN** -> `D1` (GPIO5)
- **Relay VCC** -> `5V`
- **Relay GND** -> `GND`
- Contacto seco del relay -> `COM` y `NO` de la central del porton

## Firmware
Usa el archivo `firmware.ino` y carga con Arduino IDE.
Si no tienes ArduinoJson instalado, el sketch igual funciona porque hace parsing simple.
# NodeMCU / ESP8266

## Objetivo
Conectar el NodeMCU al broker MQTT y activar el rele al recibir `OPEN`.

## Configuracion requerida
- `WIFI_SSID`
- `WIFI_PASSWORD`
- `MQTT_HOST`
- `MQTT_PORT`
- `MQTT_USER`
- `MQTT_PASS`
- `DEVICE_ID`

## Topics
- SUB: `portones/{deviceId}/command`
- PUB: `portones/{deviceId}/status`

## Cableado basico
- **Relay IN** -> `D1` (GPIO5)
- **Relay VCC** -> `5V`
- **Relay GND** -> `GND`
- Contacto seco del relay -> `COM` y `NO` de la central del porton

## Firmware
Usa el archivo `firmware.ino` y carga con Arduino IDE.
Si no tienes ArduinoJson instalado, el sketch igual funciona porque hace parsing simple.

