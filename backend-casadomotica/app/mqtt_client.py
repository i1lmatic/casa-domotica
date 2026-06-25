"""Cliente MQTT persistente del backend.

Se crea una sola vez al arrancar el server (lifespan) y vive mientras corre el proceso.
Escucha telemetria de los ESP32 (on_message) y publica comandos a los actuadores.
"""

import logging
import paho.mqtt.client as mqtt

from .config import MQTT_BROKER, MQTT_PORT, TOPIC_PREFIX, TELEMETRY_TOPICS
from . import state

logger = logging.getLogger("backend-casadomotica")

# Cliente MQTT unico (se crea en start_mqtt)
_client: mqtt.Client | None = None


def _topic_command(room: str, device: str) -> str:
    return f"{TOPIC_PREFIX}/{room}/{device}"


def _on_connect(client, userdata, flags, reason_code, properties=None):
    """Se suscribe a todos los topics de telemetria al conectar."""
    if reason_code == 0:
        logger.info("MQTT conectado al broker %s:%s", MQTT_BROKER, MQTT_PORT)
        for suffix in TELEMETRY_TOPICS:
            topic = f"{TOPIC_PREFIX}/+/{suffix}"
            client.subscribe(topic)
            logger.info("Suscrito a %s", topic)
    else:
        logger.error("MQTT fallo al conectar, codigo=%s", reason_code)


def _on_disconnect(client, userdata, *args, **kwargs):
    logger.warning("MQTT desconectado")


def _on_message(client, userdata, msg):
    """Parsea el topic 'casa/<room>/<sensor>' y actualiza el estado en memoria."""
    try:
        topic = msg.topic
        payload = msg.payload.decode("utf-8", errors="replace").strip()
        parts = topic.split("/")
        # esperamos casa/<room>/<sensor>
        if len(parts) != 3:
            return
        _, room, sensor = parts
        valor = _parse_payload(payload)
        state.set_telemetry(room, sensor, valor)
        logger.info("Telemetria %s/%s = %s", room, sensor, valor)
    except Exception as e:
        logger.error("Error procesando mensaje MQTT %s: %s", topic, e)


def _parse_payload(payload: str):
    """Intenta convertir a int o float, si no deja como string."""
    try:
        return int(payload)
    except ValueError:
        pass
    try:
        return float(payload)
    except ValueError:
        pass
    # booleanos
    if payload.lower() in ("true", "on"):
        return True
    if payload.lower() in ("false", "off"):
        return False
    return payload


def start_mqtt() -> bool:
    """Crea y conecta el cliente MQTT. Llamar desde lifespan de FastAPI."""
    global _client
    _client = mqtt.Client(
        callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
        client_id="backend-casadomotica",
    )
    _client.on_connect = _on_connect
    _client.on_disconnect = _on_disconnect
    _client.on_message = _on_message
    try:
        _client.connect(MQTT_BROKER, MQTT_PORT, 60)
        _client.loop_start()  # hilo en background
        return True
    except Exception as e:
        logger.error("No se pudo conectar al broker MQTT: %s", e)
        _client = None
        return False


def stop_mqtt():
    """Detiene el cliente MQTT. Llamar al shutdown del server."""
    global _client
    if _client is not None:
        _client.loop_stop()
        _client.disconnect()
        _client = None


def publish_command(room: str, device: str, action: str) -> bool:
    """Publica un comando al topic casa/<room>/<device>. Devuelve True si se envio."""
    if _client is None:
        logger.error("Cliente MQTT no disponible, no se pudo publicar %s/%s/%s", room, device, action)
        return False
    topic = _topic_command(room, device)
    result = _client.publish(topic, action, qos=0, retain=False)
    logger.info("Publicado %s a %s (rc=%s)", action, topic, result.rc)
    return result.rc == mqtt.MQTT_ERR_SUCCESS


def is_connected() -> bool:
    if _client is None:
        return False
    return _client.is_connected()