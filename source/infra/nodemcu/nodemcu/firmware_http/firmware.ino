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
    Serial.println("OPEN: forbidden");
    server.send(403, "application/json", "{\"ok\":false,\"error\":\"forbidden\"}");
    return;
  }

  if (gateBusy) {
    Serial.println("OPEN: busy");
    server.send(409, "application/json", "{\"ok\":false,\"error\":\"busy\"}");
    return;
  }

  Serial.println("OPEN: accepted");
  gateBusy = true;
  gateStartedAt = millis();
  pulseRelay();
  server.send(200, "application/json", "{\"ok\":true}");
}

void handleStatus() {
  Serial.println(gateBusy ? "STATUS: busy" : "STATUS: free");
  String payload = String("{\"ok\":true,\"busy\":") + (gateBusy ? "true" : "false") + "}";
  server.send(200, "application/json", payload);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Booting...");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_HIGH ? LOW : HIGH);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.print("WiFi connected, IP: ");
  Serial.println(WiFi.localIP());

  server.on("/open", handleOpen);
  server.on("/status", handleStatus);
  server.begin();
  Serial.println("HTTP server ready");
}

void loop() {
  server.handleClient();

  if (gateBusy && (millis() - gateStartedAt) >= GATE_LOCK_MS) {
    gateBusy = false;
    Serial.println("LOCK: timeout, ready");
  }
}
