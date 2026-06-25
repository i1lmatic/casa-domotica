import styles from './ApartmentView.module.css'

/* Posiciones en % del contenedor .scene — ajustadas al render isométrico */
const ROOM_PINS = [
  { id: 'sala',       label: 'Sala',       emoji: '🛋️', top: '28%', left: '27%' },
  { id: 'garaje',     label: 'Garaje',     emoji: '🚗', top: '18%', left: '60%' },
  { id: 'bano',       label: 'Baño',       emoji: '🚿', top: '62%', left: '24%' },
  { id: 'cocina',     label: 'Cocina',     emoji: '🍳', top: '62%', left: '44%' },
  { id: 'dormitorio', label: 'Dormitorio', emoji: '🛏️', top: '56%', left: '64%' },
]

export default function ApartmentView({ sensors, selectedRoom, onRoomSelect }) {
  const humidity = sensors?.humidity ?? 47
  const liveUser = sensors?.liveUser ?? 'Mike R.'

  return (
    <div className={styles.wrapper}>
      <div className={styles.scene}>

        {/* ══ Casa 3D ══ */}
        <div className={styles.isoStage}>
          <div className={styles.isoWorld}>

            {/* — Suelo con cuadrícula — */}
            <div className={styles.floor} />

            {/* — Paredes laterales visibles — */}
            <div className={styles.wallFront} />
            <div className={styles.wallRight} />

            {/* — Habitaciones coloreadas en el suelo — */}
            <div className={`${styles.room} ${styles.rSala}`} />
            <div className={`${styles.room} ${styles.rGaraje}`} />
            <div className={`${styles.room} ${styles.rBano}`} />
            <div className={`${styles.room} ${styles.rCocina}`} />
            <div className={`${styles.room} ${styles.rDormitorio}`} />

            {/* — Divisores interiores — */}
            <div className={styles.divH} />
            <div className={styles.divV1} />
            <div className={styles.divV2} />

            {/* — Muebles con altura 3D — */}
            <div className={`${styles.mob} ${styles.sofa}`} />
            <div className={`${styles.mob} ${styles.sofaBack}`} />
            <div className={`${styles.mob} ${styles.bed}`} />
            <div className={`${styles.mob} ${styles.bedHead}`} />
            <div className={`${styles.mob} ${styles.table}`} />
            <div className={`${styles.mob} ${styles.car}`} />
            <div className={`${styles.mob} ${styles.toilet}`} />
          </div>
        </div>

        {/* ══ Pins tipo Google Maps ══ */}
        {ROOM_PINS.map(pin => (
          <button
            key={pin.id}
            className={`${styles.pin} ${selectedRoom === pin.id ? styles.pinActive : ''}`}
            style={{ top: pin.top, left: pin.left }}
            onClick={() => onRoomSelect(selectedRoom === pin.id ? null : pin.id)}
          >
            <div className={styles.bubble}>
              <span className={styles.pinEmoji}>{pin.emoji}</span>
              <span className={styles.pinLabel}>{pin.label}</span>
            </div>
            <div className={styles.pinTail} />
          </button>
        ))}

        {/* ══ Badge de humedad ══ */}
        <div className={styles.humBadge}>
          <span className={styles.humDot} />
          <span className={styles.humLabel}>Humedad</span>
          <span className={styles.humVal}>{humidity}%</span>
        </div>

        {/* ══ Cámara en vivo ══ */}
        <div className={styles.liveBadge}>
          <div className={styles.liveHeader}>
            <span className={styles.liveDot} /><span className={styles.liveTxt}>EN VIVO</span>
          </div>
          <div className={styles.liveThumb}><span className={styles.workerEmoji}>👷</span></div>
          <div className={styles.liveFooter}>
            <span>{liveUser}</span><span>🔊</span>
          </div>
        </div>

        {/* ══ Pin de cerradura ══ */}
        <button className={styles.lockPin}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </button>

      </div>
    </div>
  )
}
