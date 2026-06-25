"""Endpoints de habitaciones: GET /api/rooms y GET /api/rooms/{room}."""

from fastapi import APIRouter, HTTPException
from .. import state
from ..config import ROOMS
from ..schemas import RoomOut

router = APIRouter(prefix="/api", tags=["rooms"])


@router.get("/rooms", response_model=list[RoomOut], summary="Listar todas las habitaciones con sus dispositivos")
def listar_habitaciones():
    return state.get_all_rooms_state()


@router.get("/rooms/{room}", response_model=RoomOut, summary="Estado de una habitacion especifica")
def estado_habitacion(room: str):
    if room not in ROOMS:
        raise HTTPException(status_code=404, detail=f"Habitacion '{room}' no existe")
    return state.get_room_state(room)