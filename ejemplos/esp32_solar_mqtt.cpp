#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_INA219.h>

// ==========================
// CONFIGURACIÓN WIFI AP
// ==========================
const char *apSsid = "ESP32-SOLAR";
const char *apPassword = "12345678";  // Al menos 8 caracteres
IPAddress apIp(192, 168, 4, 1);
IPAddress apGateway(192, 168, 4, 1);
IPAddress apSubnet(255, 255, 255, 0);

// ==========================
// CONFIGURACIÓN MQTT (Broker en el host conectado al AP)
// ==========================
const char *brokerIp = "192.168.4.2";  // IP típica de tu laptop/PC al unirse al AP del ESP32
const int brokerPort = 1883;
const char *mqttTopic = "esp32/ina219";  // Tópico esperado por el logger/SQL/dashboard

// ==========================
// OBJETOS MQTT Y WIFI
// ==========================
WiFiClient espClient;
PubSubClient client(espClient);

// ==========================
// SENSORES INA219
// ==========================
Adafruit_INA219 sensorCircuito(0x40);  // A0=0, A1=0
Adafruit_INA219 sensorPanel1(0x44);    // A0=0, A1=1
Adafruit_INA219 sensorPanel2(0x41);    // A0=1, A1=0

struct MedicionIna {
  float voltajeV;
  float corrienteA;
  float potenciaW;
};

// ==========================
// CONEXIÓN MQTT
// ==========================
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.println("Conectando al broker MQTT...");
    // Usa la MAC para un ID único y evitar colisiones al reconectar
    String clientId = "ESP32_SOLAR_" + WiFi.macAddress();
    clientId.replace(":", "");

    if (client.connect(clientId.c_str())) {
      Serial.println("Conectado a Mosquitto!");
    } else {
      Serial.print("Fallo MQTT, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

MedicionIna leerSensor(Adafruit_INA219 &sensor) {
  MedicionIna lectura{};
  lectura.voltajeV = sensor.getBusVoltage_V();
  lectura.corrienteA = sensor.getCurrent_mA() / 1000.0f;  // Convierte mA a A
  lectura.potenciaW = lectura.voltajeV * lectura.corrienteA;  // Potencia estimada en W
  return lectura;
}

// ==========================
// PUBLICAR EN FORMATO COMPATIBLE
// ==========================
void publicarLecturas() {
  MedicionIna circuito = leerSensor(sensorCircuito);
  MedicionIna panel1 = leerSensor(sensorPanel1);
  MedicionIna panel2 = leerSensor(sensorPanel2);

  char payload[256];
  snprintf(payload, sizeof(payload),
           "{\"current_1\":%.3f,\"current_2\":%.3f,\"current_3\":%.3f,"
           "\"voltage_1\":%.3f,\"voltage_2\":%.3f,\"voltage_3\":%.3f,"
           "\"power_1\":%.3f,\"power_2\":%.3f,\"power_3\":%.3f}",
           circuito.corrienteA, panel1.corrienteA, panel2.corrienteA,
           circuito.voltajeV, panel1.voltajeV, panel2.voltajeV,
           circuito.potenciaW, panel1.potenciaW, panel2.potenciaW);

  client.publish(mqttTopic, payload);
  Serial.print("Publicado en ");
  Serial.print(mqttTopic);
  Serial.print(": ");
  Serial.println(payload);
}

// ==========================
// CONFIG INICIAL
// ==========================
void setup() {
  Serial.begin(115200);

  // Crear la red WiFi del ESP32 conservando la IP fija 192.168.4.1
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIp, apGateway, apSubnet);
  WiFi.softAP(apSsid, apPassword);
  Serial.println("WiFi AP creado.");
  Serial.print("IP del ESP32 (gateway para tu PC): ");
  Serial.println(WiFi.softAPIP());

  // I2C (ajusta pines si tu placa usa otros)
  Wire.begin(21, 22);

  // Inicializar sensores
  if (!sensorCircuito.begin()) Serial.println("ERROR: Sensor Circuito no detectado");
  if (!sensorPanel1.begin()) Serial.println("ERROR: Sensor Panel 1 no detectado");
  if (!sensorPanel2.begin()) Serial.println("ERROR: Sensor Panel 2 no detectado");

  sensorCircuito.setCalibration_32V_2A();
  sensorPanel1.setCalibration_32V_2A();
  sensorPanel2.setCalibration_32V_2A();

  client.setServer(brokerIp, brokerPort);
}

// ==========================
// LOOP PRINCIPAL
// ==========================
void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }

  client.loop();

  publicarLecturas();
  Serial.println("====================================");

  delay(2000);
}
