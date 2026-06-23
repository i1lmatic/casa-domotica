import { useState } from 'react'
import Toggle from '../../ui/Toggle/Toggle'
import styles from './LightingCard.module.css'

export default function LightingCard({ device, onToggle }) {
  const [brightness, setBrightness] = useState(device.value ?? 64)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{device.label}</h3>
          <p className={styles.room}>{device.room}</p>
        </div>
        <Toggle active={device.active} onChange={() => onToggle(device.id)} color="green" />
      </div>

      <div className={styles.bulbRow}>
        <button className={styles.arrowBtn}>‹</button>
        <div className={styles.bulbWrapper}>
          <div
            className={styles.bulbGlow}
            style={{ opacity: device.active ? brightness / 100 : 0.1 }}
          />
          <BulbIcon active={device.active} />
        </div>
        <button className={styles.arrowBtn}>›</button>
      </div>

      <div className={styles.sliderRow}>
        <input
          type="range"
          className={styles.slider}
          min={0}
          max={100}
          value={brightness}
          onChange={e => setBrightness(Number(e.target.value))}
        />
        <span className={styles.value}>{brightness}%</span>
      </div>
    </div>
  )
}

function BulbIcon({ active }) {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4C16.27 4 10 10.27 10 18c0 5.52 3.04 10.33 7.5 12.9V34a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3.1C34.96 28.33 38 23.52 38 18c0-7.73-6.27-14-14-14z"
        fill={active ? '#fdcb6e' : '#e0e0e0'}
      />
      <rect x="19" y="36" width="10" height="3" rx="1.5" fill={active ? '#f9a825' : '#bdbdbd'} />
      <rect x="20" y="39" width="8" height="3" rx="1.5" fill={active ? '#f57f17' : '#9e9e9e'} />
    </svg>
  )
}
