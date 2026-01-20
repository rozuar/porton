#!/bin/sh
set -e

CONF="/mosquitto/config/mosquitto.conf"
PASSWD_FILE="/mosquitto/config/passwords"

if [ -n "${MQTT_USER}" ] && [ -n "${MQTT_PASS}" ]; then
  mosquitto_passwd -b -c "${PASSWD_FILE}" "${MQTT_USER}" "${MQTT_PASS}"
  if ! grep -q "^password_file" "${CONF}"; then
    printf "\nallow_anonymous false\npassword_file %s\n" "${PASSWD_FILE}" >> "${CONF}"
  fi
fi

exec /usr/sbin/mosquitto -c "${CONF}"
