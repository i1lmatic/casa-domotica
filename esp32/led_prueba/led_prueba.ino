#include <WiFi.h>
#include <PubSubClient.h>

// 1. Configuración de tu red local
const char* ssid = "UNAMAD WIFI";
const char* password = "12345678";

// 2. IP de tu laptop (donde corre Mosquitto y FastAPI)
const char* mqtt_server = "40.0.1.59";

// El canal que definimos en el main.py de FastAPI
const char* topic_led = "casa/sala/led"; 
const int PIN_LED = 5; // El pin GPIO 2 que acabamos de cablear

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.begin(115200);
  Serial.println();
  Serial.println("======================================");
  Serial.println("  DIAGNOSTICO DE CONEXION WIFI");
  Serial.println("======================================");
  Serial.print("Intentando conectar a SSID: \"");
  Serial.print(ssid);
  Serial.println("\"");
  Serial.print("Password usado: \"");
  Serial.print(password);
  Serial.println("\"");
  Serial.println("NOTA: el ESP32 solo soporta 2.4 GHz.");
  Serial.println("      Si la red es solo 5 GHz, NUNCA conectara.");
  Serial.println("--------------------------------------");
  Serial.print("Conectando");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int intentos = 0;
  const int MAX_INTENTOS = 20; // 20 x 500ms = 10 segundos
  while (WiFi.status() != WL_CONNECTED && intentos < MAX_INTENTOS) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  Serial.println();
  Serial.println("--------------------------------------");

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(">> RESULTADO: WIFI CONECTADO OK");
    Serial.print("   IP del ESP32: ");
    Serial.println(WiFi.localIP());
    Serial.print("   RSSI (señal): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println(">> RESULTADO: NO SE PUDO CONECTAR AL WIFI");
    Serial.print("   Codigo de error WiFi.status() = ");
    Serial.println(WiFi.status());
    Serial.println("   Significado del codigo:");
    Serial.println("     1  = SSID no disponible (la red no existe o NO es 2.4 GHz)");
    Serial.println("     2  = Scan terminado (reintentar)");
    Serial.println("     3  = Conexion exitosa");
    Serial.println("     4  = Conexion perdida");
    Serial.println("     5  = Password incorrecto o asociacion fallida");
    Serial.println("     6  = Desasociado / NO hay red 2.4 GHz con ese SSID");
    Serial.println("     255 = Estado inicial");
    Serial.println();
    Serial.println("   PROBABLE CAUSA:");
    Serial.println("   - Si codigo=1 o 6 -> la red UNAMAD WIFI es SOLO 5 GHz,");
    Serial.println("     el ESP32 no la ve. Usa un hotspot de celular (2.4 GHz).");
    Serial.println("   - Si codigo=5     -> password incorrecto, revisa credenciales.");
  }
  Serial.println("======================================");
}

// LED interno de la placa ESP32 (suele estar en GPIO 2) para diagnostico
const int PIN_LED_INTERNAL = 2;

// Esta función se ejecuta CADA VEZ que mandas algo desde Swagger
void callback(char* topic, byte* payload, unsigned int length) {
  String mensaje = "";
  for (int i = 0; i < length; i++) {
    mensaje += (char)payload[i];
  }

  Serial.println();
  Serial.println(">> MENSAJE MQTT RECIBIDO");
  Serial.print("   Topic: ");
  Serial.println(topic);
  Serial.print("   Payload: \"");
  Serial.print(mensaje);
  Serial.println("\"");
  Serial.print("   PIN_LED configurado como: ");
  Serial.println(PIN_LED);
  Serial.print("   Estado del pin ANTES: ");
  Serial.println(digitalRead(PIN_LED));

  // Aquí el ESP32 reacciona al String que envía el Backend
  if (mensaje == "ON") {
    digitalWrite(PIN_LED, HIGH);
    digitalWrite(PIN_LED_INTERNAL, HIGH); // tambien enciende el LED onboard
    Serial.println("   >> Accion: ENCENDER LED");
  } else if (mensaje == "OFF") {
    digitalWrite(PIN_LED, LOW);
    digitalWrite(PIN_LED_INTERNAL, LOW); // tambien apaga el LED onboard
    Serial.println("   >> Accion: APAGAR LED");
  } else {
    Serial.println("   >> Accion: COMANDO NO RECONOCIDO");
  }

  Serial.print("   Estado del pin DESPUES: ");
  Serial.println(digitalRead(PIN_LED));
  Serial.println("--------------------------------------");
}

void reconnect() {
  int intentos = 0;
  const int MAX_INTENTOS_MQTT = 6; // 6 x 5000ms = 30 seg
  while (!client.connected() && intentos < MAX_INTENTOS_MQTT) {
    Serial.print("Conectando a Mosquitto (intento ");
    Serial.print(intentos + 1);
    Serial.print("/");
    Serial.print(MAX_INTENTOS_MQTT);
    Serial.print(")... ");
    int estado = client.connect("ESP32_Dashboard");
    if (estado) {
      Serial.println("OK - ¡Conectado!");
      client.subscribe(topic_led); // Se suscribe al canal del LED
      Serial.print("Suscrito a: ");
      Serial.println(topic_led);
    } else {
      Serial.print("FALLO. Codigo estado MQTT = ");
      Serial.println(client.state());
      Serial.println("  -4 = timeout (broker no responde / firewall bloquea 1883)");
      Serial.println("  -2 = fallo de red (WiFi caido)");
      Serial.println("   1 = protocolo incorrecto");
      Serial.println("   2 = ID cliente en uso");
      Serial.println("   5 = no autorizado");
      delay(5000);
      intentos++;
    }
  }
  if (!client.connected()) {
    Serial.println(">> NO se pudo conectar al broker MQTT tras varios intentos.");
    Serial.println("   Verifica: Mosquitto corriendo, IP del broker correcta,");
    Serial.println("   y firewall de Windows permitiendo inbound TCP 1883.");
  }
}

void setup() {
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_LED_INTERNAL, OUTPUT); // LED onboard para diagnostico
  setup_wifi();

  // Si el WiFi no conecto, no intentes MQTT (no tiene sentido)
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println();
    Serial.println(">> WiFi NO disponible. MQTT omitido.");
    Serial.println("   Revisa las causas del diagnostico arriba.");
    Serial.println("   El ESP32 se queda en bucle sin hacer nada.");
    return;
  }

  Serial.println();
  Serial.println("  CONFIGURANDO MQTT");
  Serial.print("Broker: ");
  Serial.print(mqtt_server);
  Serial.print("  Puerto: 1883  Topic: ");
  Serial.println(topic_led);
  Serial.println("--------------------------------------");
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    return; // Si no hay WiFi, no procesamos MQTT
  }
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // Mantiene la escucha MQTT activa
}