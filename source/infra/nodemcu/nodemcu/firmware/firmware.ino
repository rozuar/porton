#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// ===== Configuracion =====
const char* WIFI_SSID = "zude-one";
const char* WIFI_PASSWORD = "..";

const char* MQTT_HOST = "";
const int MQTT_PORT = 16444;
const char* MQTT_USER = "admin";
const char* MQTT_PASS = "";

const char* DEVICE_ID = "porton-001";


// Relay
const int RELAY_PIN = D1; // GPIO5
const int RELAY_ACTIVE_MS = 600;
const bool RELAY_ACTIVE_HIGH = true;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

String commandTopic;
String statusTopic;

void logLine(const char* message) {
  Serial.print("[");
  Serial.print(millis());
  Serial.print("ms] ");
  Serial.println(message);
}

void logValue(const char* label, const char* value) {
  Serial.print("[");
  Serial.print(millis());
  Serial.print("ms] ");
  Serial.print(label);
  Serial.println(value);
}

void connectWifi() {
  logLine("WiFi: start");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  logLine("WiFi: connecting...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("WiFi connected, IP: ");
  Serial.println(WiFi.localIP());
  logValue("WiFi SSID: ", WIFI_SSID);
}

void publishStatus(const char* status) {
  String payload = String("{\"status\":\"") + status + "\"}";
  logValue("MQTT status payload: ", payload.c_str());
  mqttClient.publish(statusTopic.c_str(), payload.c_str(), true);
  Serial.print("STATUS publish: ");
  Serial.println(status);
}

void pulseRelay() {
  logLine("RELAY: pulse start");
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? HIGH : LOW);
  delay(RELAY_ACTIVE_MS);
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? LOW : HIGH);
  logLine("RELAY: pulse end");
}

void onMessage(char* topic, byte* payload, unsigned int length) {
  logValue("MQTT topic: ", topic);
  if (String(topic) != commandTopic) {
    Serial.println("MQTT: message ignored (topic mismatch)");
    return;
  }

  String body;
  body.reserve(length + 1);
  for (unsigned int i = 0; i < length; i++) {
    body += (char)payload[i];
  }

  Serial.print("MQTT: received ");
  Serial.println(body);
  if (body.indexOf("\"action\"") >= 0 && body.indexOf("OPEN") >= 0) {
    logLine("MQTT: OPEN received");
    pulseRelay();
    logLine("MQTT: OPEN executed");
  } else {
    Serial.println("MQTT: unsupported action");
  }
}

void connectMqtt() {
  const String clientId = String("nodemcu_") + DEVICE_ID + "_" + String(ESP.getChipId());

  logValue("MQTT host: ", MQTT_HOST);
  Serial.print("MQTT port: ");
  Serial.println(MQTT_PORT);
  logValue("MQTT user: ", MQTT_USER);
  const String willPayload = "{\"status\":\"offline\"}";
  logValue("MQTT will payload: ", willPayload.c_str());
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMessage);

  while (!mqttClient.connected()) {
    Serial.println("MQTT: connecting...");
    if (mqttClient.connect(
          clientId.c_str(),
          MQTT_USER,
          MQTT_PASS,
          statusTopic.c_str(),
          1,
          true,
          willPayload.c_str())) {
      mqttClient.subscribe(commandTopic.c_str(), 1);
      Serial.println("MQTT: connected");
      logValue("MQTT subscribed: ", commandTopic.c_str());
      publishStatus("online");
    } else {
      Serial.print("MQTT: connect failed, rc=");
      Serial.println(mqttClient.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  logLine("Booting...");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? LOW : HIGH);

  commandTopic = String("portones/") + DEVICE_ID + "/command";
  statusTopic = String("portones/") + DEVICE_ID + "/status";
  logValue("Command topic: ", commandTopic.c_str());
  logValue("Status topic: ", statusTopic.c_str());

  connectWifi();
  connectMqtt();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    logLine("WiFi: disconnected, reconnecting");
    connectWifi();
  }

  if (!mqttClient.connected()) {
    logLine("MQTT: disconnected, reconnecting");
    connectMqtt();
  }

  mqttClient.loop();
}
