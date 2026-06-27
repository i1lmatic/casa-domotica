"""Configuracion central del backend: broker MQTT y catalogo de habitaciones/dispositivos."""

# Broker Mosquitto (corre en la misma laptop que el backend)
MQTT_BROKER = "192.168.18.24"
MQTT_PORT = 1883

# Prefijo para todos los topics de la casa
TOPIC_PREFIX = "casa"

# Estado inicial por defecto de cada actuador segun su tipo
DEFAULT_STATE = {
    "light": "OFF",
    "servo": "CLOSED",
    "motor_dc": "STOPPED",
    "buzzer": "OFF",
    "relay": "OFF",
    "7seg": "OFF",
}

# Catalogo de habitaciones y sus dispositivos.
# Cada dispositivo define: label (UI), type (logica), actions (acciones validas),
# icon (sugerencia para el frontend), topic_suffix (se arma como casa/<room>/<topic_suffix>).
ROOMS = {
    "garaje": {
        "label": "Garaje",
        "icon": "car",
        "devices": {
            "luz": {
                "label": "Luz",
                "type": "light",
                "actions": ["ON", "OFF"],
                "icon": "lightbulb",
            },
            "puerta": {
                "label": "Puerta automática",
                "type": "servo",
                "actions": ["OPEN", "CLOSE"],
                "icon": "door",
            },
            "alarma": {
                "label": "Alarma",
                "type": "buzzer",
                "actions": ["ON", "OFF"],
                "icon": "bell",
            },
        },
    },
    "cocina": {
        "label": "Cocina",
        "icon": "kitchen",
        "devices": {
            "luz": {
                "label": "Luz",
                "type": "light",
                "actions": ["ON", "OFF"],
                "icon": "lightbulb",
            },
            "ventilador": {
                "label": "Ventilador / Extractor",
                "type": "relay",
                "actions": ["ON", "OFF"],
                "icon": "fan",
            },
            "alarma": {
                "label": "Alarma por gas",
                "type": "buzzer",
                "actions": ["ON", "OFF"],
                "icon": "bell",
            },
        },
    },
    "banio": {
        "label": "Baño",
        "icon": "bath",
        "devices": {
            "luz": {
                "label": "Luz",
                "type": "light",
                "actions": ["ON", "OFF"],
                "icon": "lightbulb",
            },
            "extractor": {
                "label": "Extractor",
                "type": "relay",
                "actions": ["ON", "OFF"],
                "icon": "fan",
            },
        },
    },
    "dormitorio": {
        "label": "Dormitorio",
        "icon": "bed",
        "devices": {
            "luz": {
                "label": "Luz",
                "type": "light",
                "actions": ["ON", "OFF"],
                "icon": "lightbulb",
            },
            "cortinas": {
                "label": "Cortinas automáticas",
                "type": "motor_dc",
                "actions": ["UP", "DOWN", "STOP"],
                "icon": "curtains",
            },
        },
    },
    "sala": {
        "label": "Sala",
        "icon": "sofa",
        "devices": {
            "luz": {
                "label": "Luz",
                "type": "light",
                "actions": ["ON", "OFF"],
                "icon": "lightbulb",
            },
            "tv": {
                "label": "TV simulado",
                "type": "7seg",
                # ON/OFF + CHANNEL<N> con N=1..9 (se valida aparte)
                "actions": ["ON", "OFF", "CHANNEL"],
                "icon": "tv",
            },
        },
    },
}

# Dispositivos tipo TV: la accion CHANNEL va seguida de un numero 1..9
TV_CHANNELS = list(range(1, 10))

# Tipos de sensor (telemetria) que el backend escucha: topic -> campo del estado
# Se suscribe con wildcard casa/+/temperatura, etc.
TELEMETRY_TOPICS = [
    "temperatura",
    "humedad",
    "gas",
    "luz_ambiente",
    "distancia",
    "presencia",
    "puerta_estado",
    "cortinas_estado",
    "tv_canal",
    "tv_estado",
    "alarma_gas",
]