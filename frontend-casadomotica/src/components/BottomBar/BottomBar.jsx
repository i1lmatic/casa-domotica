import Toggle from '../ui/Toggle/Toggle'
import styles from './BottomBar.module.css'

const ICONS = {
  lock: LockIcon,
  drop: DropIcon,
  bell: BellIcon,
}

export default function BottomBar({ devices, onToggle }) {
  return (
    <div className={styles.bar}>
      {devices.map(device => {
        const Icon = ICONS[device.icon] ?? LockIcon
        return (
          <div key={device.id} className={styles.item}>
            <div className={styles.iconWrap}>
              <Icon />
            </div>
            <div className={styles.info}>
              <span className={styles.label}>{device.label}</span>
              <span className={styles.status}>{device.status}</span>
            </div>
            <Toggle
              active={device.active}
              onChange={() => onToggle(device.id)}
              color={device.active ? 'green' : 'dark'}
            />
          </div>
        )
      })}
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function DropIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
