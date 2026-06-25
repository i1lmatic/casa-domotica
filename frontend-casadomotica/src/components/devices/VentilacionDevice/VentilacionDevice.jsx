import Toggle from '../../ui/Toggle/Toggle'
import styles from './VentilacionDevice.module.css'

const VELOCIDADES = [
  { id: 'baja', label: 'Baja' },
  { id: 'media', label: 'Media' },
  { id: 'alta', label: 'Alta' },
]

export default function VentilacionDevice({ roomId, state, onToggle, onSetVelocidad }) {
  const { active, velocidad } = state

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>🌀</span>
          <div>
            <h4 className={styles.title}>Ventilación</h4>
            <p className={styles.sub}>{active ? `Velocidad: ${velocidad}` : 'Apagado'}</p>
          </div>
        </div>
        <Toggle active={active} onChange={() => onToggle(roomId)} color="green" />
      </div>

      <div className={`${styles.body} ${active ? styles.bodyOn : ''}`}>
        <div className={styles.fanVisual}>
          <div
            className={styles.fan}
            style={{ animationDuration: active ? (velocidad === 'alta' ? '0.5s' : velocidad === 'media' ? '1s' : '2s') : '0s', animationPlayState: active ? 'running' : 'paused' }}
          >
            💨
          </div>
        </div>

        <div className={styles.speedSection}>
          <span className={styles.speedLabel}>Velocidad</span>
          <div className={styles.speedBtns}>
            {VELOCIDADES.map(v => (
              <button
                key={v.id}
                className={`${styles.speedBtn} ${velocidad === v.id && active ? styles.speedBtnActive : ''}`}
                onClick={() => { if (active) onSetVelocidad(roomId, v.id) }}
                disabled={!active}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
