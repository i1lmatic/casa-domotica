"""Endpoint de salud: GET /api/health."""

from fastapi import APIRouter
from ..schemas import HealthOut
from .. import mqtt_client

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthOut, summary="Estado del backend y del broker MQTT")
def estado():
    return HealthOut(
        status="online",
        proyecto="backend-casadomotica",
        mqtt_conectado=mqtt_client.is_connected(),
    )