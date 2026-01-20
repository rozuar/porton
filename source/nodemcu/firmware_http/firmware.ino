#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// ===== Configuracion =====
const char* WIFI_SSID = "TU_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD";

// Token simple para proteger el endpoint
const char* ACCESS_TOKEN = "cambia_este_token";

// Relay
const int RELAY_PIN = D1; // GPIO5
const int RELAY_ACTIVE_MS = 600;
const bool RELAY_ACTIVE_HIGH = true;

ESP8266WebServer server(80);
bool gateBusy = false;
unsigned long gateStartedAt = 0;
const unsigned long GATE_LOCK_MS = 10000;

void pulseRelay() {
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? HIGH : LOW);
  delay(RELAY_ACTIVE_MS);
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? LOW : HIGH);
}

void handleOpen() {
  const String token = server.arg("token");
  if (token.length() == 0 || token != ACCESS_TOKEN) {
    server.send(403, "application/json", "{\"ok\":false,\"error\":\"forbidden\"}");
    return;
  }

  if (gateBusy) {
    server.send(409, "application/json", "{\"ok\":false,\"error\":\"busy\"}");
    return;
  }

  gateBusy = true;
  gateStartedAt = millis();
  pulseRelay();
  server.send(200, "application/json", "{\"ok\":true}");
}

void handleStatus() {
  String payload = String("{\"ok\":true,\"busy\":") + (gateBusy ? "true" : "false") + "}";
  server.send(200, "application/json", payload);
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? LOW : HIGH);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  server.on("/open", handleOpen);
  server.on("/status", handleStatus);
  server.begin();
}

void loop() {
  server.handleClient();

  if (gateBusy && (millis() - gateStartedAt) >= GATE_LOCK_MS) {
    gateBusy = false;
  }
}
