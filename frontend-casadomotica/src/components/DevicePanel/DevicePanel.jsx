import CleaningCard from '../cards/CleaningCard/CleaningCard'
import LightingCard from '../cards/LightingCard/LightingCard'
import ClimateCard from '../cards/ClimateCard/ClimateCard'
import styles from './DevicePanel.module.css'

const CARD_MAP = {
  cleaning: CleaningCard,
  lighting: LightingCard,
  climate: ClimateCard,
}

export default function DevicePanel({ devices = [], onToggle }) {
  return (
    <aside className={styles.panel}>
      {devices.map(device => {
        const Card = CARD_MAP[device.id]
        if (!Card) return null
        return <Card key={device.id} device={device} onToggle={onToggle} />
      })}
    </aside>
  )
}
