"""Endpoint de control de dispositivos: POST /api/rooms/{room}/devices/{device}."""

from fastapi import APIRouter, HTTPException
from .. import state
from ..config import ROOMS, TV_CHANNELS
from ..schemas import DeviceCommand, CommandResponse, ErrorResponse
from .. import mqtt_client

router = APIRouter(prefix="/api", tags=["devices"])


def _validar_accion(room: str, device: str, action: str) -> bool:
    """Valida que la accion sea permitida para el dispositivo."""
    dev = ROOMS.get(room, {}).get("devices", {}).get(device)
    if not dev:
        return False
    allowed = dev["actions"]
    # tipo TV admite CHANNEL<N> ademas de ON/OFF
    if dev["type"] == "7seg" and action.startswith("CHANNEL"):
        try:
            n = int(action[len("CHANNEL"):])
            return 1 <= n <= 9
        except ValueError:
            return False
    return action in allowed


@router.post(
    "/rooms/{room}/devices/{device}",
    response_model=CommandResponse,
    responses={404: {"model": ErrorResponse}, 400: {"model": ErrorResponse}},
    summary="Enviar comando a un dispositivo",
)
def controlar_dispositivo(room: str, device: str, comando: DeviceCommand):
    # Validar existencia
    if room not in ROOMS:
        raise HTTPException(status_code=404, detail=f"Habitacion '{room}' no existe")
    if device not in ROOMS[room]["devices"]:
        raise HTTPException(status_code=404, detail=f"Dispositivo '{device}' no existe en {room}")

    action = comando.action.upper()

    if not _validar_accion(room, device, action):
        dev = ROOMS[room]["devices"][device]
        raise HTTPException(
            status_code=400,
            detail=f"Accion '{action}' no valida para {device} ({dev['type']}). Validas: {dev['actions']}",
        )

    # Publicar al broker
    enviado = mqtt_client.publish_command(room, device, action)

    # Actualizar estado en memoria
    state.set_device_state(room, device, action)

    topic = f"casa/{room}/{device}"
    return CommandResponse(
        status="success",
        room=room,
        device=device,
        action=action,
        topic=topic,
        enviado=enviado,
    )