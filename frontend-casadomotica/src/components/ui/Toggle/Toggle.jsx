import styles from './Toggle.module.css'

export default function Toggle({ active, onChange, color = 'green' }) {
  return (
    <button
      className={`${styles.toggle} ${active ? styles.on : ''} ${styles[color]}`}
      onClick={() => onChange?.(!active)}
      aria-pressed={active}
      role="switch"
    >
      <span className={styles.thumb} />
    </button>
  )
}
