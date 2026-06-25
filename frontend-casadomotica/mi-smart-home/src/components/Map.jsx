// components/HouseMap.jsx
export default function Map({ onSelectRoom, activeRoom }) {
  const rooms = [
    { id: 'sala', name: 'Sala de Estar', temp: 22, devices: ['Luz Techo', 'Smart TV'], pos: 'top-1/2 left-1/4' },
    { id: 'cocina', name: 'Cocina', temp: 24, devices: ['Foco Barra', 'Extractor'], pos: 'top-1/4 left-2/3' },
    { id: 'cuarto', name: 'Habitación', temp: 21, devices: ['Luz Mesa', 'Persianas'], pos: 'top-2/3 left-2/3' },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#D9D2BF]/50 h-[500px] relative">
      <h3 className="text-[#8C846D] text-sm font-bold mb-6">PLANO INTERACTIVO</h3>
      
      <div className="relative w-full h-[350px] bg-[#FFFEFA] rounded-2xl border-2 border-[#D9D2BF] overflow-hidden">
        {/* Aquí iría tu imagen SVG de fondo */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center text-4xl font-bold">MAPA</div>

        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`absolute ${room.pos} transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl transition-all duration-300
              ${activeRoom === room.id 
                ? 'bg-[#5F6A8C] text-white shadow-lg scale-110' 
                : 'bg-[#BFC5D9]/50 text-[#5F6A8C] hover:bg-[#BFC5D9]'}`}
          >
            <div className="text-[10px] font-bold uppercase">{room.name}</div>
            <div className="text-xl font-bold">{room.temp}°C</div>
          </button>
        ))}
      </div>
    </div>
  );
}