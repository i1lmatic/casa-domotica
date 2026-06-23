import { useState, useCallback } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

const ROOMS_CONFIG = [
  {
    id: 'sala',
    label: 'Sala',
    emoji: '🛋️',
    devices: ['iluminacion', 'ventilacion'],
  },
  {
    id: 'dormitorio',
    label: 'Dormitorio',
    emoji: '🛏️',
    devices: ['iluminacion', 'ventilacion'],
  },
  {
    id: 'cocina',
    label: 'Cocina',
    emoji: '🍳',
    devices: ['iluminacion', 'ventilacion'],
  },
  {
    id: 'bano',
    label: 'Baño',
    emoji: '🚿',
    devices: ['iluminacion'],
  },
  {
    id: 'garaje',
    label: 'Garaje',
    emoji: '🚗',
    devices: ['iluminacion', 'puerta_garaje'],
  },
]

const buildRoomState = () => {
  const state = {}
  ROOMS_CONFIG.forEach(room => {
    state[room.id] = {
      iluminacion: { active: false, brillo: 70 },
      ventilacion: { active: false, velocidad: 'media' },
      puerta_garaje: { abierta: false, en_movimiento: false },
    }
  })
  return state
}

export const ROOMS = ROOMS_CONFIG

export function useDeviceState() {
  const [roomDevices, setRoomDevices] = useState(buildRoomState)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [quickDevices, setQuickDevices] = useState([
    { id: 'doorlock', label: 'Cerradura', status: 'Bloqueado', icon: 'lock', active: false },
    { id: 'humidifier', label: 'Humidificador', status: 'Modo Eco', icon: 'drop', active: true },
    { id: 'doorbell', label: 'Timbre', status: 'Silenciado', icon: 'bell', active: false },
  ])
  const sensors = { humidity: 47, liveUser: 'Mike R.' }

  const toggleQuickDevice = useCallback((id) => {
    setQuickDevices(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d))
  }, [])

  const toggleIluminacion = useCallback(async (roomId) => {
    setRoomDevices(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        iluminacion: { ...prev[roomId].iluminacion, active: !prev[roomId].iluminacion.active },
      },
    }))
    const isNowOn = !roomDevices[roomId]?.iluminacion?.active
    if (roomId === 'sala') {
      try {
        await fetch(`${API_BASE}/api/led?accion=${isNowOn ? 'ON' : 'OFF'}`, { method: 'POST' })
      } catch {
        // backend offline — UI persiste igual
      }
    }
  }, [roomDevices])

  const setBrillo = useCallback((roomId, brillo) => {
    setRoomDevices(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], iluminacion: { ...prev[roomId].iluminacion, brillo } },
    }))
  }, [])

  const toggleVentilacion = useCallback((roomId) => {
    setRoomDevices(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        ventilacion: { ...prev[roomId].ventilacion, active: !prev[roomId].ventilacion.active },
      },
    }))
  }, [])

  const setVelocidad = useCallback((roomId, velocidad) => {
    setRoomDevices(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], ventilacion: { ...prev[roomId].ventilacion, velocidad } },
    }))
  }, [])

  const togglePuertaGaraje = useCallback((roomId) => {
    setRoomDevices(prev => {
      const actual = prev[roomId].puerta_garaje
      return {
        ...prev,
        [roomId]: {
          ...prev[roomId],
          puerta_garaje: { abierta: !actual.abierta, en_movimiento: false },
        },
      }
    })
  }, [])

  return {
    rooms: ROOMS_CONFIG,
    roomDevices,
    selectedRoom,
    setSelectedRoom,
    quickDevices,
    sensors,
    toggleQuickDevice,
    toggleIluminacion,
    setBrillo,
    toggleVentilacion,
    setVelocidad,
    togglePuertaGaraje,
  }
}
