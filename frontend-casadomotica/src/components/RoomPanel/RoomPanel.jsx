import IluminacionDevice from '../devices/IluminacionDevice/IluminacionDevice'
import VentilacionDevice from '../devices/VentilacionDevice/VentilacionDevice'
import PuertaGaraje from '../devices/PuertaGaraje/PuertaGaraje'
import styles from './RoomPanel.module.css'

const DEVICE_COMPONENTS = {
  iluminacion: IluminacionDevice,
  ventilacion: VentilacionDevice,
  puerta_garaje: PuertaGaraje,
}

const ROOM_DEVICES_MAP = {
  sala:       ['iluminacion', 'ventilacion'],
  dormitorio: ['iluminacion', 'ventilacion'],
  cocina:     ['iluminacion', 'ventilacion'],
  bano:       ['iluminacion'],
  garaje:     ['iluminacion', 'puerta_garaje'],
}

export default function RoomPanel({
  rooms,
  selectedRoom,
  roomDevices,
  onClose,
  onToggleIluminacion,
  onSetBrillo,
  onToggleVentilacion,
  onSetVelocidad,
  onTogglePuerta,
}) {
  const room = rooms.find(r => r.id === selectedRoom)
  const isOpen = !!room

  return (
    <aside className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
      {isOpen && room && (
        <>
          {/* ── Encabezado del cuarto ── */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.emoji}>{room.emoji}</span>
              <div>
                <h2 className={styles.roomTitle}>{room.label}</h2>
                <p className={styles.roomSub}>
                  {ROOM_DEVICES_MAP[room.id]?.length ?? 0} dispositivos
                </p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose} title="Cerrar">
              <CloseIcon />
            </button>
          </div>

          {/* ── Lista de dispositivos del cuarto ── */}
          <div className={styles.deviceList}>
            {(ROOM_DEVICES_MAP[room.id] ?? []).map(deviceId => {
              const Component = DEVICE_COMPONENTS[deviceId]
              if (!Component) return null
              const deviceState = roomDevices[room.id]?.[deviceId]
              if (!deviceState) return null

              return (
                <Component
                  key={deviceId}
                  roomId={room.id}
                  state={deviceState}
                  onToggle={
                    deviceId === 'iluminacion' ? onToggleIluminacion
                    : deviceId === 'ventilacion' ? onToggleVentilacion
                    : onTogglePuerta
                  }
                  onSetBrillo={onSetBrillo}
                  onSetVelocidad={onSetVelocidad}
                />
              )
            })}
          </div>
        </>
      )}

      {/* Estado vacío cuando ningún cuarto está seleccionado */}
      {!isOpen && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🏠</span>
          <p>Selecciona un cuarto en el plano para ver sus dispositivos</p>
        </div>
      )}
    </aside>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
