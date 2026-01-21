#!/usr/bin/env bash
set -euo pipefail

log() {
  printf "\n==> %s\n" "$1"
}

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Falta el comando requerido: $1"
    exit 1
  fi
}

require curl
require jq

API_BASE="${API_BASE:-https://porton-api-production.up.railway.app/api}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@porton.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-CHANGE_ME_PASSWORD}"
DEVICE_ID="${DEVICE_ID:-porton-001}"
DEVICE_NAME="${DEVICE_NAME:-Porton Principal}"
DEVICE_LOCATION="${DEVICE_LOCATION:-Entrada}"
USER_EMAIL="${USER_EMAIL:-user@porton.com}"
MQTT_HOST="${MQTT_HOST:-}"
MQTT_PORT="${MQTT_PORT:-1883}"
MQTT_USER="${MQTT_USER:-}"
MQTT_PASS="${MQTT_PASS:-}"

if [ -n "${MQTT_HOST}" ]; then
  log "Verificando MQTT en ${MQTT_HOST}:${MQTT_PORT}"
  if command -v timeout >/dev/null 2>&1; then
    if timeout 3 bash -c "cat < /dev/null > /dev/tcp/${MQTT_HOST}/${MQTT_PORT}" 2>/dev/null; then
      echo "MQTT TCP OK"
    else
      echo "No se pudo conectar a ${MQTT_HOST}:${MQTT_PORT}"
    fi
  else
    echo "No existe 'timeout', se omite verificacion TCP."
  fi
fi

log "Login admin en API"
token="$(
  curl -s -X POST "${API_BASE}/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}" \
  | jq -r '.access_token // empty'
)"

if [ -z "${token}" ]; then
  echo "No se pudo obtener token. Revisa ADMIN_EMAIL/ADMIN_PASSWORD/API_BASE."
  exit 1
fi

log "Buscar usuario por email: ${USER_EMAIL}"
user_id="$(
  curl -s -H "Authorization: Bearer ${token}" "${API_BASE}/users" \
  | jq -r --arg email "${USER_EMAIL}" '.[] | select(.email==$email) | .id' \
  | head -n 1
)"

if [ -z "${user_id}" ]; then
  echo "No se encontró usuario con email ${USER_EMAIL}."
  exit 1
fi

log "Buscar dispositivo por deviceId: ${DEVICE_ID}"
device_uuid="$(
  curl -s -H "Authorization: Bearer ${token}" "${API_BASE}/devices" \
  | jq -r --arg deviceId "${DEVICE_ID}" '.[] | select(.deviceId==$deviceId) | .id' \
  | head -n 1
)"

if [ -z "${device_uuid}" ]; then
  log "Crear dispositivo ${DEVICE_ID}"
  create_payload="{\"deviceId\":\"${DEVICE_ID}\",\"name\":\"${DEVICE_NAME}\",\"location\":\"${DEVICE_LOCATION}\"}"
  device_uuid="$(
    curl -s -X POST "${API_BASE}/devices" \
      -H "Authorization: Bearer ${token}" \
      -H "Content-Type: application/json" \
      -d "${create_payload}" \
    | jq -r '.id // empty'
  )"
fi

if [ -z "${device_uuid}" ]; then
  echo "No se pudo obtener ID del dispositivo."
  exit 1
fi

log "Crear permiso (userId=${user_id}, deviceId=${device_uuid})"
perm_payload="{\"userId\":\"${user_id}\",\"deviceId\":\"${device_uuid}\"}"
curl -s -X POST "${API_BASE}/permissions" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d "${perm_payload}" >/dev/null

log "Enviar comando OPEN a ${DEVICE_ID}"
open_payload="{\"deviceId\":\"${DEVICE_ID}\"}"
curl -s -X POST "${API_BASE}/gates/open" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d "${open_payload}"

if [ -n "${MQTT_HOST}" ] && command -v mosquitto_sub >/dev/null 2>&1; then
  log "Escuchando eventos en portones/${DEVICE_ID}/events por 5s"
  if [ -n "${MQTT_USER}" ] && [ -n "${MQTT_PASS}" ]; then
    timeout 5 mosquitto_sub -h "${MQTT_HOST}" -p "${MQTT_PORT}" \
      -u "${MQTT_USER}" -P "${MQTT_PASS}" -t "portones/${DEVICE_ID}/events" || true
  else
    timeout 5 mosquitto_sub -h "${MQTT_HOST}" -p "${MQTT_PORT}" \
      -t "portones/${DEVICE_ID}/events" || true
  fi
fi

printf "\n\nOK. Revisar logs del NodeMCU en Serial Monitor.\n"
