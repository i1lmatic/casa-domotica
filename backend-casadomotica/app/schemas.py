"""Modelos Pydantic para validacion de request/response en la API."""

from typing import Optional
from pydantic import BaseModel, Field


class DeviceCommand(BaseModel):
    """Body del POST a /api/rooms/{room}/devices/{device}."""
    action: str = Field(..., description="Accion a ejecutar: ON, OFF, OPEN, CLOSE, UP, DOWN, STOP, CHANNEL<N>")


class DeviceOut(BaseModel):
    label: str
    type: str
    icon: str
    actions: list[str]
    state: str


class RoomOut(BaseModel):
    room: str
    label: str
    icon: str
    devices: dict[str, DeviceOut]


class TelemetryOut(BaseModel):
    room: str
    label: str
    telemetry: dict


class CommandResponse(BaseModel):
    status: str
    room: str
    device: str
    action: str
    topic: str
    enviado: bool


class ErrorResponse(BaseModel):
    status: str = "error"
    mensaje: str


class HealthOut(BaseModel):
    status: str
    proyecto: str
    mqtt_conectado: bool