# NodeMCU HTTP (endpoint local)

## Objetivo
Exponer un endpoint HTTP en el NodeMCU para abrir el porton.

## Endpoints
- `GET /open?token=TU_TOKEN`
- `GET /status`

## Configuracion
Edita en `firmware.ino`:
- `WIFI_SSID`
- `WIFI_PASSWORD`
- `ACCESS_TOKEN`
- `RELAY_PIN` (D1 por defecto)

## Notas
- El endpoint bloquea nuevas aperturas por 10 segundos.
- Usa este firmware solo en redes privadas.
