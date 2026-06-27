import paho.mqtt.client as mqtt

MQTT_BROKER = "192.168.18.24"  # IP de tu laptop
MQTT_PORT = 1883
TOPIC_LED = "casa/sala/luz"

def on_connect(client, userdata, flags, rc, properties=None):
    print("✅ ESP32 Simulado conectado")
    client.subscribe(TOPIC_LED)
    print(f"📡 Escuchando: {TOPIC_LED}")

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print(f"\n📨 Recibido: {payload}")
    if payload == "ON":
        print("💡 LED ENCENDIDO")
    elif payload == "OFF":
        print(" LED APAGADO")

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

print("🔄 Conectando...")
client.connect(MQTT_BROKER, MQTT_PORT, 60)

try:
    client.loop_forever()
except KeyboardInterrupt:
    print("\n🛑 Simulador detenido manualmente")
    client.disconnect()