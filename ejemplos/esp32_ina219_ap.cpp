#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_INA219.h>

// Direcciones I2C típicas: 0x40, 0x41, 0x44.
// Ajusta segun el cableado de los INA219 (A0/A1).
constexpr uint8_t kIna219Addresses[] = {0x40, 0x41, 0x44};
constexpr size_t kSensorCount = sizeof(kIna219Addresses) / sizeof(kIna219Addresses[0]);

Adafruit_INA219 ina[kSensorCount];

const char *apSsid = "ESP32-INA219";
const char *apPass = "clave123"; // Cambia por una contraseña segura.

WebServer server(80);

struct InaReading {
  float busVoltageV;
  float shuntVoltageMV;
  float currentMA;
  float powerMW;
};

InaReading readSensor(Adafruit_INA219 &sensor) {
  InaReading reading{};
  reading.busVoltageV = sensor.getBusVoltage_V();
  reading.shuntVoltageMV = sensor.getShuntVoltage_mV();
  reading.currentMA = sensor.getCurrent_mA();
  reading.powerMW = sensor.getPower_mW();
  return reading;
}

String renderJson() {
  String json = "{\n  \"mediciones\": [\n";
  for (size_t i = 0; i < kSensorCount; ++i) {
    InaReading r = readSensor(ina[i]);
    json += "    {\\\"id\\\": " + String(i + 1) + ", ";
    json += "\\\"v_bus\\\": " + String(r.busVoltageV, 3) + ", ";
    json += "\\\"v_shunt\\\": " + String(r.shuntVoltageMV, 3) + ", ";
    json += "\\\"c_ma\\\": " + String(r.currentMA, 3) + ", ";
    json += "\\\"p_mw\\\": " + String(r.powerMW, 3) + "}";
    if (i + 1 != kSensorCount) json += ",\n"; else json += "\n";
  }
  json += "  ]\n}";
  return json;
}

void handleRoot() {
  server.send(200, "application/json", renderJson());
}

void setup() {
  Serial.begin(115200);
  Wire.begin();

  for (size_t i = 0; i < kSensorCount; ++i) {
    if (!ina[i].begin(kIna219Addresses[i])) {
      Serial.printf("INA219 %u no encontrado en 0x%02X\n", i + 1, kIna219Addresses[i]);
    } else {
      // Configuración opcional: rango de bus de 16V y ganancia de 2A aprox.
      ina[i].setCalibration_32V_2A();
    }
  }

  WiFi.mode(WIFI_AP);
  bool apOk = WiFi.softAP(apSsid, apPass);
  if (apOk) {
    Serial.printf("Punto de acceso activo: %s\n", apSsid);
    Serial.print("IP: ");
    Serial.println(WiFi.softAPIP());
  } else {
    Serial.println("Error al crear el AP");
  }

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
  delay(10); // Pequeño respiro para el MCU.
}
