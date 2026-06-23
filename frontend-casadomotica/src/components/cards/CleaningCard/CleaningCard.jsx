import Toggle from '../../ui/Toggle/Toggle'
import Knob from '../../ui/Knob/Knob'
import styles from './CleaningCard.module.css'

export default function CleaningCard({ device, onToggle }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{device.label}</h3>
          <p className={styles.room}>{device.room}</p>
        </div>
        <Toggle active={device.active} onChange={() => onToggle(device.id)} color="green" />
      </div>

      <div className={styles.knobRow}>
        <button className={styles.arrowBtn}>‹</button>
        <Knob value={device.value} size={72} />
        <button className={styles.arrowBtn}>›</button>
      </div>

      <div className={styles.footer}>
        <button className={styles.footerBtn}>★</button>
        <button className={styles.ecoBtn}>
          <HomeIcon /> Modo Eco
        </button>
        <button className={styles.footerBtn}>🗑</button>
      </div>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
