import Toggle from '../../ui/Toggle/Toggle'
import styles from './IluminacionDevice.module.css'

export default function IluminacionDevice({ roomId, state, onToggle, onSetBrillo }) {
  const { active, brillo } = state

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>💡</span>
          <div>
            <h4 className={styles.title}>Iluminación</h4>
            <p className={styles.sub}>{active ? `Brillo: ${brillo}%` : 'Apagado'}</p>
          </div>
        </div>
        <Toggle active={active} onChange={() => onToggle(roomId)} color="green" />
      </div>

      <div className={`${styles.body} ${active ? styles.bodyOn : ''}`}>
        <div className={styles.bulbVisual}>
          <div className={styles.glow} style={{ opacity: active ? brillo / 100 : 0 }} />
          <BulbSVG active={active} brillo={brillo} />
        </div>

        <div className={styles.sliderSection}>
          <span className={styles.sliderLabel}>Brillo</span>
          <div className={styles.sliderRow}>
            <span className={styles.sliderIcon}>☀️</span>
            <input
              type="range"
              className={styles.slider}
              min={10}
              max={100}
              value={brillo}
              disabled={!active}
              onChange={e => onSetBrillo(roomId, Number(e.target.value))}
              style={{ '--pct': `${brillo}%` }}
            />
            <span className={styles.sliderValue}>{brillo}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BulbSVG({ active, brillo }) {
  const color = active ? `hsl(45, 95%, ${40 + brillo * 0.3}%)` : '#d0d0d8'
  const shadow = active ? `0 0 ${brillo / 5}px 4px rgba(253,203,110,0.5)` : 'none'
  return (
    <svg width="54" height="54" viewBox="0 0 48 48" style={{ filter: active ? `drop-shadow(${shadow})` : 'none' }}>
      <path
        d="M24 4C16.27 4 10 10.27 10 18c0 5.52 3.04 10.33 7.5 12.9V34a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3.1C34.96 28.33 38 23.52 38 18c0-7.73-6.27-14-14-14z"
        fill={color}
      />
      <rect x="19" y="36" width="10" height="3" rx="1.5" fill={active ? '#f9a825' : '#bdbdbd'} />
      <rect x="20" y="39" width="8" height="3" rx="1.5" fill={active ? '#f57f17' : '#9e9e9e'} />
    </svg>
  )
}
