import Sidebar from './components/Sidebar/Sidebar'
import TopBar from './components/TopBar/TopBar'
import ApartmentView from './components/ApartmentView/ApartmentView'
import RoomPanel from './components/RoomPanel/RoomPanel'
import BottomBar from './components/BottomBar/BottomBar'
import { useDeviceState } from './hooks/useDeviceState'
import styles from './App.module.css'

function App() {
  const state = useDeviceState()

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.viewWrapper}>
            <TopBar />
            <ApartmentView
              sensors={state.sensors}
              rooms={state.rooms}
              selectedRoom={state.selectedRoom}
              onRoomSelect={state.setSelectedRoom}
            />
            <BottomBar devices={state.quickDevices} onToggle={state.toggleQuickDevice} />
          </div>
          <RoomPanel
            rooms={state.rooms}
            selectedRoom={state.selectedRoom}
            roomDevices={state.roomDevices}
            onClose={() => state.setSelectedRoom(null)}
            onToggleIluminacion={state.toggleIluminacion}
            onSetBrillo={state.setBrillo}
            onToggleVentilacion={state.toggleVentilacion}
            onSetVelocidad={state.setVelocidad}
            onTogglePuerta={state.togglePuertaGaraje}
          />
        </div>
      </div>
    </div>
  )
}

export default App
