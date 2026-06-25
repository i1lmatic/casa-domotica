# Casa Domótica — Backend + ESP32 + Mosquitto

Proyecto del curso de Autómatas. Sistema domótico con FastAPI (backend), Mosquitto (broker MQTT),
ESP32 (actuador/sensor) y React (frontend, en desarrollo aparte).

Este README explica **cómo correr todo en otra laptop** desde cero, incluyendo el firewall de Windows
(parte que más dolores de cabeza da y casi nadie documenta).

---

## Arquitectura general

```
[Frontend React]  ──HTTP──▶  [Backend FastAPI :8000]  ──MQTT──▶  [Mosquitto :1883]
                                       ▲                                │
                                       │                                ▼
                                   Swagger /docs                    [ESP32]
                                                                  (suscribe/comanda)
```

- El **frontend** llama al backend por HTTP (`/api/...`).
- El **backend** publica comandos y escucha telemetría por MQTT al broker local.
- El **ESP32** se suscribe a topics MQTT y reacciona (enciende LED, lee sensores, etc.).
- El **broker Mosquitto** corre en la misma laptop que el backend (127.0.0.1).

---

## Requisitos previos (la laptop que corre el backend)

| Requisito | Versión recomendada | Notas |
|---|---|---|
| Python | 3.10+ (probado con 3.14.1) | Necesario para FastAPI |
| pip | incluido con Python | Para instalar dependencias |
| Mosquitto broker | 2.x (instalador oficial de Windows) | Escucha en 1883 |
| Arduino IDE | 2.x + soporte ESP32 | Para flashear el ESP32 |
| Placa ESP32 | WROOM DevKit V1 u otra | Con cable USB |

No hace falta Windows — en Linux/Mac cambia sólo el comando del venv (`python3 -m venv`) y el firewall.

---

## 1) Instalar y configurar Mosquitto (broker MQTT)

### 1.1 Descargar e instalar
- Windows: <https://mosquitto.org/download/>
- Durante la instalación, **tildar "Install as a service"** (arranca solo al iniciar Windows).

### 1.2 Configurar `mosquitto.conf`
Abrir como **Administrador**:
```
C:\Program Files\mosquitto\mosquitto.conf
```
Agregar al final (si no están ya):
```
listener 1883
allow_anonymous true
```
Sin esto, Mosquitto en v2.x rechaza conexiones por defecto.

### 1.3 (Re)iniciar el servicio
PowerShell **como Administrador**:
```powershell
Stop-Service mosquitto
Start-Service mosquitto
Get-Service mosquitto          # debe decir Running
netstat -an | findstr :1883    # debe aparecer 0.0.0.0:1883 LISTENING
```

### 1.4 Abrir el puerto 1883 en el firewall de Windows ⚠️ CRÍTICO

Sin esto, **el ESP32 nunca logra conectarse al broker** (error `-2` en el Monitor Serie).
Windows bloquea por defecto las conexiones entrantes en redes no confiablesa.

PowerShell **como Administrador**:
```powershell
New-NetFirewallRule -DisplayName "Mosquitto MQTT 1883" -Direction Inbound -Protocol TCP -LocalPort 1883 -Action Allow -Profile Any -PolicyStore "PersistentStore"
```

Verificar:
```powershell
Get-NetFirewallRule -DisplayName "Mosquitto MQTT 1883" | Select-Object DisplayName, Enabled, Action
# Debe mostrar Enabled=True, Action=Allow
```

**Problema frecuente (laptops administradas por universidad / GPO)**: la regla se borra sola al reiniciar.
Si te pasa, subí a la versión " script + Programador de tareas" (ver sección 7 más abajo).

### 1.5 Marcar la red Wi-Fi como "Privada"
Windows trata las redes "Públicas" con más restricciones. Para que el ESP32 (en la LAN) llegue al broker:
```
Configuración → Red e Internet → Wi-Fi → Propiedades → Perfil de red → Privado
```
O por PowerShell (admin):
```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
```

---

## 2) Correr el backend (FastAPI)

### 2.1 Crear el entorno virtual e instalar dependencias
Desde la raíz del proyecto:
```powershell
# Crear venv (sólo la primera vez)
python -m venv backend-casadomotica\venv

# Activar e instalar
backend-casadomotica\venv\Scripts\python.exe -m pip install -r backend-casadomotica\requirements.txt
```

### 2.2 Arrancar el backend
```powershell
backend-casadomotica\venv\Scripts\uvicorn main:app --reload
```
Abrir en el navegador:
- Swagger: <http://127.0.0.1:8000/docs>
- Health: <http://127.0.0.1:8000/api/health>

Si `mqtt_conectado` sale `true` en `/api/health` → todo OK.

### 2.3 (Opcional) Abrir el backend a otros PCs de la LAN
Si otra persona va a correr el frontend en su laptop y necesita llamar a tu backend,
tenés que escuchar en todas las interfaces (no solo localhost) y abrir el puerto 8000:

```powershell
# Arrancar escuchando en 0.0.0.0
backend-casadomotica\venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

PowerShell **como Administrador**:
```powershell
New-NetFirewallRule -DisplayName "Backend FastAPI 8000" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow -Profile Any -PolicyStore "PersistentStore"
```

La otra persona apuntará su frontend a `http://<TU_IP_LAN>:8000/api` (ver sección 4).

---

## 3) Flashear el ESP32

### 3.1 Instalar librerías en Arduino IDE
- `PubSubClient` (Nick O'Leary) → cliente MQTT
- (Para fases futuras) `DHT sensor library`, `ESP32Servo`, `Adafruit_SSD1306`, `NewPing`

### 3.2 Configurar el sketch
Abrir `esp32/led_prueba/led_prueba.ino` y ajustar **3 valores** (líneas 5–12):

```cpp
const char* ssid = "UNAMAD WIFI";          // tu SSID Wi-Fi
const char* password = "12345678";          // tu password Wi-Fi
const char* mqtt_server = "40.0.2.141";     // IP DE LA LAPTOP DONDE CORRE MOSQUITTO
const char* topic_led = "casa/sala/luz";
```

**Crítico**: el ESP32 **sólo soporta Wi-Fi de 2.4 GHz**. Si tu red es exclusivamente 5 GHz,
el ESP32 jamás conectará (error tipo `1` o `6` en el Monitor Serie). Usá un hotspot del
celular (2.4 GHz WPA2) como plan B.

### 3.3 Subir el sketch
- Seleccionar la placa (Ej. "ESP32 DevKit Module") y el puerto COM correcto.
- **Cerrar el Monitor Serie antes de subir** (sino ocupa el COM y la subida falla con
  "Could not open COMxx, the port is busy").
- Click en Subir (▶). Al final dirá "Hard resetting via RTS pin...".
- Abrir el Monitor Serie a **115200 baudios** y presionar el botón **RST/EN** de la placa.

### 3.4 Verificar la conexión
En el Monitor Serie deberías ver:
```
>> RESULTADO: WIFI CONECTADO OK
   IP del ESP32: 40.0.x.x
...
Conectando a Mosquitto (intento 1/6)... OK - ¡Conectado!
Suscrito a: casa/sala/luz
```

Cuando mandés un comando desde Swagger (`POST /api/rooms/sala/devices/luz` con `{"action":"ON"}`),
el Monitor Serie imprimirá `>> MENSAJE MQTT RECIBIDO` y el LED se encenderá.

---

## 4) Cómo saber la IP de la laptop (y por qué cambia)

La IP del Wi-Fi casi siempre es **dinámica** (la asigna el router por DHCP). Cada vez que
reiniciás o te reconectás al Wi-Fi, la IP puede cambiar. Eso rompe el `mqtt_server` del ESP32.

Consultar IP actual:
```powershell
Get-NetIPAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4 | Select-Object IPAddress
# o más simple:
ipconfig | findstr "IPv4"
```

Esa IP es la que hay que:
1. Escribir en `esp32/led_prueba/led_prueba.ino` (línea 9: `mqtt_server`).
2. Pasarle a la persona que corra el frontend, como `VITE_API_URL=http://<IP>:8000/api`.

**Recomendación para la demo**: fijar **IP estática** en Windows la noche previa:
```
Configuración → Red e Internet → Wi-Fi → Propiedades → Asignación IP → Editar → Manual → IPv4 ON
```
Con IP fija no tenés que reflashear el ESP32 ni avisarle a nadie cada vez.

---

## 5) Probar todo end-to-end (sin frontend todavía)

1. Arrancar Mosquitto (servicio, ya running).
2. Arrancar el backend: `uvicorn main:app --reload` (debe decir `mqtt_conectado:true`).
3. Subir el sketch al ESP32.
4. Abrir Swagger: <http://127.0.0.1:8000/docs>.
5. `POST /api/rooms/sala/devices/luz` → body `{"action":"ON"}` → Execute.
6. El LED físico del ESP32 se enciende.
7. `GET /api/rooms/sala` → el estado del dispositivo `luz` ahora dice `"ON"`.
8. Para probar telemetría sin HW: publicar manual con `mosquitto_pub`:

```powershell
& "C:\Program Files\mosquitto\mosquitto_pub.exe" -h 127.0.0.1 -p 1883 -t "casa/cocina/temperatura" -m "24.5"
```

Y luego `GET /api/telemetry/cocina` → tiene que devolver `{"temperatura":24.5}`.

---

## 6) Endpoints disponibles

| Método | Ruta | Body |Para qué |
|---|---|---|---|
| GET | `/api/health` | — | Health-check + estado MQTT |
| GET | `/api/rooms` | — | Lista todas las habitaciones con sus dispositivos y estado |
| GET | `/api/rooms/{room}` | — | Una habitación puntual |
| POST | `/api/rooms/{room}/devices/{device}` | `{"action":"ON"}` | Enviar comando a un dispositivo |
| GET | `/api/telemetry` | — | Telemetría de todas las habitaciones |
| GET | `/api/telemetry/{room}` | — | Telemetría de una habitación |

Acciones válidas según `type` del dispositivo:
- `light`, `relay`, `buzzer` → `ON`, `OFF`
- `servo` → `OPEN`, `CLOSE`
- `motor_dc` → `UP`, `DOWN`, `STOP`
- `7seg` (TV simulado) → `ON`, `OFF`, `CHANNEL<N>` (N = 1..9)

---

## 7) Si el firewall se borra solo (laptops administradas)

Esto nos pasó: la regla de firewall quedaba creada pero se eliminaba al iniciar sesión por
una GPO de la universidad. Solución robusta: un script que la recrea en cada inicio de sesión.

### 7.1 Crear `C:\Scripts\fix-firewall.ps1`
```powershell
# Recrea las reglas de firewall si no existen (en cada login)
$acciones = @(
  @{ Nombre="Mosquitto MQTT 1883";  Puerto="1883" },
  @{ Nombre="Backend FastAPI 8000"; Puerto="8000" }
)
foreach ($a in $acciones) {
  $existe = Get-NetFirewallRule -DisplayName $a.Nombre -ErrorAction SilentlyContinue
  if (-not $existe) {
    New-NetFirewallRule -DisplayName $a.Nombre -Direction Inbound -Protocol TCP `
      -LocalPort $a.Puerto -Action Allow -Profile Any -PolicyStore "PersistentStore"
    Write-Host "Regla creada: $($a.Nombre)"
  }
}
```

### 7.2 Programar la tarea (admin)
```powershell
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\Scripts\fix-firewall.ps1"
$trigger = New-ScheduledTaskTrigger -AtLogOn
Register-ScheduledTask -TaskName "FixFirewallDomotica" -Action $action -Trigger $trigger -RunLevel Highest -Force
```

Así, cada vez que inicies sesión, el script recrea las reglas si no están → el ESP32
siempre puede llegar al broker.

---

## 8) Estructura del backend

```
backend-casadomotica/
├── main.py                     ← entrada (lifespan MQTT + routers)
├── requirements.txt
├── venv/                        ← ignorado por git
└── app/
    ├── __init__.py
    ├── config.py                ← catálogo de habitaciones/dispositivos + broker
    ├── state.py                 ← estado en memoria + última telemetría
    ├── schemas.py               ← modelos Pydantic (validación request/response)
    ├── mqtt_client.py           ← cliente MQTT persistente (on_message + publish)
    └── routers/
        ├── __init__.py
        ├── rooms.py             ← GET /api/rooms, /api/rooms/{room}
        ├── devices.py           ← POST /api/rooms/{room}/devices/{device}
        ├── telemetry.py         ← GET /api/telemetry
        └── health.py            ← GET /api/health
```

- **`config.py`** define qué habitaciones/dispositivos existen + topics MQTT (`casa/<room>/<device>`).
- **`state.py`** guarda en memoria el estado actual + última telemetría (sin BD).
- **`mqtt_client.py`** es el único que habla MQTT; creado en el lifespan de FastAPI.
- **`schemas.py`** valida con Pydantic y alimenta la documentación Swagger.
- **`routers/*`** son las "ventanillas HTTP" que coordinan todo lo de arriba.

---

## 9) Troubleshooting rápido

| Síntoma en ESP32 | Causa probable | Fix |
|---|---|---|
| `........` infinitos, nunca conecta Wi-Fi | SSID/password equivocados, o red solo 5 GHz | Revisar credenciales; usar hotspot celular 2.4 GHz |
| `WIFI CONECTADO OK` pero MQTT `-2` | Firewall bloquea 1883 o IP del broker mal | Crear regla de firewall (sección 1.4) + verificar IP (sección 4) |
| MQTT `-4` (timeout) | Broker no responde / no está corriendo | `Start-Service mosquitto` + comprobar `netstat -an \| findstr :1883` |
| Swagger no carga | Backend no está corriendo | `uvicorn main:app --reload` |
| `mqtt_conectado:false` en `/api/health` | Backend no pudo conectar a Mosquitto | Verificar que Mosquitto esté running y escuche en 1883 |
| `Could not open COMxx` al subir sketch | Monitor Serie está abierto | Cerrar Monitor Serie → subir → abrir después |
| Monitor Serie en blanco | Baud rate != 115200, o no reseteaste el ESP32 | 115200 baud + presionar RST/EN |
| Regla de firewall se borra sola | GPO / antivirus | Script + Task Scheduler (sección 7) |

---

## 10) Qué falta (roadmap)

- **Frontend React** (rama separada): wirear switches a `POST /api/...`, polling de telemetría,
  badge "Sistema Online" reactivo, plano de casa interactivo.
- **ESP32 firmware nuevo** (`ala_norte` + `ala_sur`): estructura declarativa multi-dispositivo,
  DHT11, LM35, HC-SR04, servo, L298N+motoreductor, 7-seg, OLED, PIR, MQ-2, buzzer.
- **Montaje en perfboard** soldado (no protoboard) tras validar en protoboard.

---

## 11) Comandos resumen (cheat-sheet)

```powershell
# === Mosquitto ===
Start-Service mosquitto                          # arrancar broker (admin)
Stop-Service mosquitto                           # parar broker (admin)
netstat -an | findstr :1883                      # verificar que escucha

# === Firewall (admin) ===
New-NetFirewallRule -DisplayName "Mosquitto MQTT 1883" -Direction Inbound -Protocol TCP -LocalPort 1883 -Action Allow -Profile Any -PolicyStore "PersistentStore"
New-NetFirewallRule -DisplayName "Backend FastAPI 8000" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow -Profile Any -PolicyStore "PersistentStore"

# === Red ===
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private   # marcar red como Private (admin)
Get-NetIPAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4 | Select-Object IPAddress   # ver IP actual

# === Backend ===
python -m venv backend-casadomotica\venv                                                                     # crear venv (una vez)
backend-casadomotica\venv\Scripts\python.exe -m pip install -r backend-casadomotica\requirements.txt         # instalar deps
backend-casadomotica\venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000                       # arrancar backend (LAN)

# === Probar telemetría manual ===
& "C:\Program Files\mosquitto\mosquitto_pub.exe" -h 127.0.0.1 -p 1883 -t "casa/cocina/temperatura" -m "24.5"
```

---

## 12) Licencia / autores

Proyecto del curso de Autómatas, 2026-I. Repo: <https://github.com/i1lmatic/casa-domotica>.