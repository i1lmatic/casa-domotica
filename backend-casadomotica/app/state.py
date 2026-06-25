"""Estado en memoria del backend: dispositivos + ultima telemetria."""

from datetime import datetime
from .config import ROOMS, DEFAULT_STATE


# estado de actuadores: state["dispositivos"][room][device] = "ON" | "OFF" | ...
dispositivos: dict = {}

# ultima telemetria: telemetria[room][sensor] = valor
telemetria: dict = {}

# timestamp de la ultima actualizacion por room/sensor
ultima_actualizacion: dict = {}


def _init_estado():
    """Inicializa el dict de dispositivos con el estado por defecto de cada uno."""
    dispositivos.clear()
    telemetria.clear()
    ultima_actualizacion.clear()
    for room_id, room in ROOMS.items():
        dispositivos[room_id] = {}
        telemetria[room_id] = {}
        ultima_actualizacion[room_id] = {}
        for dev_id, dev in room["devices"].items():
            dispositivos[room_id][dev_id] = DEFAULT_STATE.get(dev["type"], "OFF")


def get_device_state(room: str, device: str) -> str | None:
    return dispositivos.get(room, {}).get(device)


def set_device_state(room: str, device: str, value: str):
    if room not in dispositivos:
        dispositivos[room] = {}
    dispositivos[room][device] = value
    ultima_actualizacion.setdefault(room, {})
    ultima_actualizacion[room][f"dev:{device}"] = datetime.now().isoformat()


def set_telemetry(room: str, sensor: str, value):
    if room not in telemetria:
        telemetria[room] = {}
    telemetria[room][sensor] = value
    ultima_actualizacion.setdefault(room, {})
    ultima_actualizacion[room][f"tel:{sensor}"] = datetime.now().isoformat()


def get_room_state(room: str) -> dict | None:
    if room not in ROOMS:
        return None
    return {
        "room": room,
        "label": ROOMS[room]["label"],
        "icon": ROOMS[room]["icon"],
        "devices": {
            dev_id: {
                "label": dev["label"],
                "type": dev["type"],
                "icon": dev["icon"],
                "actions": dev["actions"],
                "state": dispositivos.get(room, {}).get(dev_id, DEFAULT_STATE.get(dev["type"], "OFF")),
            }
            for dev_id, dev in ROOMS[room]["devices"].items()
        },
    }


def get_all_rooms_state() -> list[dict]:
    return [get_room_state(r) for r in ROOMS.keys()]


def get_room_telemetry(room: str) -> dict | None:
    if room not in ROOMS:
        return None
    return {
        "room": room,
        "label": ROOMS[room]["label"],
        "telemetry": telemetria.get(room, {}),
    }


def get_all_telemetry() -> list[dict]:
    return [get_room_telemetry(r) for r in ROOMS.keys()]


# Inicializar al importar
_init_estado()