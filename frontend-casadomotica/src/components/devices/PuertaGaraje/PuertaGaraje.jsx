import styles from './PuertaGaraje.module.css'

export default function PuertaGaraje({ roomId, state, onToggle }) {
  const { abierta, en_movimiento } = state

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>🚪</span>
          <div>
            <h4 className={styles.title}>Puerta Automática</h4>
            <p className={`${styles.sub} ${abierta ? styles.subOpen : styles.subClosed}`}>
              {en_movimiento ? 'En movimiento...' : abierta ? 'Abierta' : 'Cerrada'}
            </p>
          </div>
        </div>
        <div className={`${styles.statusBadge} ${abierta ? styles.open : styles.closed}`}>
          {abierta ? '🔓' : '🔒'}
        </div>
      </div>

      <div className={styles.doorVisual}>
        <div className={`${styles.doorFrame}`}>
          <div className={`${styles.door} ${abierta ? styles.doorOpen : ''}`}>
            <div className={styles.doorHandle} />
            <div className={styles.doorPanel} />
            <div className={styles.doorPanel} />
          </div>
        </div>
        <div className={styles.doorGround} />
      </div>

      <button
        className={`${styles.mainBtn} ${abierta ? styles.mainBtnClose : styles.mainBtnOpen}`}
        onClick={() => onToggle(roomId)}
        disabled={en_movimiento}
      >
        {en_movimiento ? (
          <span className={styles.loading}>⏳ Procesando...</span>
        ) : abierta ? (
          <><CloseIcon /> Cerrar puerta</>
        ) : (
          <><OpenIcon /> Abrir puerta</>
        )}
      </button>
    </div>
  )
}

function OpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
