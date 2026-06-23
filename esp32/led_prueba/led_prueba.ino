#include <WiFi.h>
#include <PubSubClient.h>

// 1. Configuración de tu red local
const char* ssid = "Sinchiroca 5G";
const char* password = "QWerty#123";

// 2. IP de tu laptop (donde corre Mosquitto y FastAPI)
const char* mqtt_server = "192.168.1.3"; // <-- CAMBIA POR TU IP REAL

// El canal que definimos en el main.py de FastAPI
const char* topic_led = "casa/sala/led"; 
const int PIN_LED = 2; // El pin GPIO 2 que acabamos de cablear

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n¡WiFi Conectado!");
}

// Esta función se ejecuta CADA VEZ que mandas algo desde Swagger
void callback(char* topic, byte* payload, unsigned int length) {
  String mensaje = "";
  for (int i = 0; i < length; i++) {
    mensaje += (char)payload[i];
  }
  
  Serial.println("Comando recibido: " + mensaje);

  // Aquí el ESP32 reacciona al String que envía el Backend
  if (mensaje == "ON") {
    digitalWrite(PIN_LED, HIGH); // Enciende el LED
  } else if (mensaje == "OFF") {
    digitalWrite(PIN_LED, LOW);  // Apaga el LED
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a Mosquitto...");
    if (client.connect("ESP32_Dashboard")) {
      Serial.println("¡Conectado!");
      client.subscribe(topic_led); // Se suscribe al canal del LED
    } else {
      delay(5000);
    }
  }
}

void setup() {
  pinMode(PIN_LED, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // Mantiene la escucha MQTT activa
}