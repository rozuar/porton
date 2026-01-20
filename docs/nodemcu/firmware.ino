#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// ===== Configuracion =====
const char* WIFI_SSID = "TU_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD";

const char* MQTT_HOST = "TU_MQTT_HOST";
const int MQTT_PORT = 1883;
const char* MQTT_USER = "device_porton-001";
const char* MQTT_PASS = "CHANGE_ME_MQTT_SECRET";

const char* DEVICE_ID = "porton-001";

// Relay
const int RELAY_PIN = D1; // GPIO5
const int RELAY_ACTIVE_MS = 600;
const bool RELAY_ACTIVE_HIGH = true;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

String commandTopic;
String statusTopic;

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void publishStatus(const char* status) {
  String payload = String("{\"status\":\"") + status + "\"}";
  mqttClient.publish(statusTopic.c_str(), payload.c_str(), true);
}

void pulseRelay() {
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? HIGH : LOW);
  delay(RELAY_ACTIVE_MS);
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? LOW : HIGH);
}

void onMessage(char* topic, byte* payload, unsigned int length) {
  if (String(topic) != commandTopic) {
    return;
  }

  String body;
  body.reserve(length + 1);
  for (unsigned int i = 0; i < length; i++) {
    body += (char)payload[i];
  }

  if (body.indexOf("\"action\"") >= 0 && body.indexOf("OPEN") >= 0) {
    pulseRelay();
  }
}

void connectMqtt() {
  const String clientId = String("nodemcu_") + DEVICE_ID + "_" + String(ESP.getChipId());

  const String willPayload = "{\"status\":\"offline\"}";
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMessage);

  while (!mqttClient.connected()) {
    if (mqttClient.connect(
          clientId.c_str(),
          MQTT_USER,
          MQTT_PASS,
          statusTopic.c_str(),
          1,
          true,
          willPayload.c_str())) {
      mqttClient.subscribe(commandTopic.c_str(), 1);
      publishStatus("online");
    } else {
      delay(2000);
    }
  }
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? LOW : HIGH);

  commandTopic = String("portones/") + DEVICE_ID + "/command";
  statusTopic = String("portones/") + DEVICE_ID + "/status";

  connectWifi();
  connectMqtt();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWifi();
  }

  if (!mqttClient.connected()) {
    connectMqtt();
  }

  mqttClient.loop();
}

