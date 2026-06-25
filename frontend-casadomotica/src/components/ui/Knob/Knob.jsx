import styles from './Knob.module.css'

export default function Knob({ value = 60, size = 80 }) {
  const angle = -140 + (value / 100) * 280

  return (
    <div className={styles.knob} style={{ width: size, height: size }}>
      <div
        className={styles.indicator}
        style={{ transform: `rotate(${angle}deg)` }}
      />
      <div className={styles.center} />
    </div>
  )
}
