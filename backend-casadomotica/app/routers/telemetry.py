"""Endpoints de telemetria: GET /api/telemetry y GET /api/telemetry/{room}."""

from fastapi import APIRouter, HTTPException
from .. import state
from ..config import ROOMS
from ..schemas import TelemetryOut

router = APIRouter(prefix="/api", tags=["telemetry"])


@router.get("/telemetry", response_model=list[TelemetryOut], summary="Telemetria de todas las habitaciones")
def toda_la_telemetria():
    return state.get_all_telemetry()


@router.get("/telemetry/{room}", response_model=TelemetryOut, summary="Telemetria de una habitacion")
def telemetria_habitacion(room: str):
    if room not in ROOMS:
        raise HTTPException(status_code=404, detail=f"Habitacion '{room}' no existe")
    return state.get_room_telemetry(room)