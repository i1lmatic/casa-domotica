"""Backend Casa Domotica - FastAPI + MQTT.

Arranca una unica instancia del cliente MQTT persistente (via lifespan) que:
  - escucha telemetria de los ESP32 y la guarda en memoria (state)
  - publica comandos a los actuadores cuando el frontend llama a /api/...

La estructura modular es:
  app/config.py     -> catalogo de habitaciones/dispositivos + broker
  app/state.py      -> estado en memoria
  app/schemas.py    -> modelos Pydantic
  app/mqtt_client.py-> cliente MQTT persistente
  app/routers/*     -> endpoints HTTP
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import mqtt_client
from app.routers import rooms, devices, telemetry, health

# Configuracion de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("backend-casadomotica")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Arranca/detiene el cliente MQTT junto con el servidor."""
    logger.info("Arrancando backend Casa Domotica...")
    if mqtt_client.start_mqtt():
        logger.info("Cliente MQTT iniciado")
    else:
        logger.warning("Cliente MQTT no pudo iniciarse. Los endpoints seguiran funcionando sin publicar.")
    yield
    logger.info("Deteniendo backend...")
    mqtt_client.stop_mqtt()
    logger.info("Backend detenido")


app = FastAPI(
    title="Backend Casa Domotica",
    description="API para controlar dispositivos del hogar via MQTT",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS: permitir al frontend (React/Vite) conectarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(rooms.router)
app.include_router(devices.router)
app.include_router(telemetry.router)
app.include_router(health.router)


@app.get("/", tags=["root"], summary="Health-check raiz")
def inicio():
    return {"status": "online", "proyecto": "backend-casadomotica"}