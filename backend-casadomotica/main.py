from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import paho.mqtt.client as mqtt

app = FastAPI(title="Backend Casa Domótica")

# Permitir que React se conecte en el futuro sin bloqueos de seguridad
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración del Broker MQTT que tienes en tu laptop
MQTT_BROKER = "127.0.0.1"  # Tu IP local o localhost
MQTT_PORT = 1883
MQTT_TOPIC_LED = "casa/sala/led"  # El canal exclusivo para el LED

def enviar_mensaje_mqtt(mensaje: str):
    """Se conecta al broker local, publica el texto y se desconecta"""
    # CORRECCIÓN AQUÍ: Se añade el parámetro de la versión de API para evitar errores en paho-mqtt v2+
    cliente = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
    
    cliente.connect(MQTT_BROKER, MQTT_PORT, 60)
    cliente.publish(MQTT_TOPIC_LED, mensaje)
    cliente.disconnect()

@app.get("/")
def inicio():
    return {"status": "online", "proyecto": "backend-casadomotica"}

@app.post("/api/led")
async def controlar_led(accion: str):
    """
    Endpoint para encender o apagar.
    Recibe 'ON' u 'OFF' como parámetro de texto.
    """
    comando = accion.upper() # Lo convierte a mayúsculas para evitar errores
    
    if comando in ["ON", "OFF"]:
        enviar_mensaje_mqtt(comando) # Envía el String "ON" u "OFF" al broker
        return {"status": "success", "enviado": comando}
    
    return {"status": "error", "mensaje": "Comando inválido. Usa ON u OFF."}