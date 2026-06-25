import Toggle from '../../ui/Toggle/Toggle'
import styles from './ClimateCard.module.css'

export default function ClimateCard({ device, onToggle }) {
  const { temp = 22, maxTemp = 30, units = 3 } = device
  const pct = ((temp - 10) / (maxTemp - 10)) * 100
  const angle = -130 + (pct / 100) * 260

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{device.label}</h3>
          <p className={styles.room}>{device.room}</p>
        </div>
        <Toggle active={device.active} onChange={() => onToggle(device.id)} color="green" />
      </div>

      <div className={styles.gaugeWrapper}>
        <div className={styles.maxLabel}>{maxTemp}°</div>
        <div className={styles.gauge}>
          <svg viewBox="0 0 120 80" className={styles.gaugeSvg}>
            <path
              d="M 10 75 A 55 55 0 0 1 110 75"
              fill="none"
              stroke="#ede9fe"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 10 75 A 55 55 0 0 1 110 75"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${pct * 1.72} 172`}
            />
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a29bfe" />
                <stop offset="100%" stopColor="#6c5ce7" />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.tempDisplay}>
            <span className={styles.tempValue}>{temp}°C</span>
          </div>
        </div>
        <div className={styles.minLabel}>1°</div>
      </div>

      <p className={styles.units}>{units} Aires acondicionados</p>
    </div>
  )
}
