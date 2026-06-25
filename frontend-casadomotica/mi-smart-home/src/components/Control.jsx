// components/ControlPanel.jsx
import { useState } from 'react';

export default function Control({ room }) {
  return (
    <div className="bg-[#FFFEFA] rounded-[2rem] p-8 shadow-xl border border-[#D9D2BF] h-full transition-all">
      <p className="text-[#8C846D] text-xs font-bold uppercase tracking-widest mb-2">Especificaciones</p>
      <h2 className="text-3xl font-bold text-[#5F6A8C] mb-8">{room.name}</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-[#BFC5D9]/20 p-4 rounded-2xl border border-[#BFC5D9]/50">
          <p className="text-[#8C846D] text-[10px] font-bold">TEMPERATURA</p>
          <p className="text-2xl font-bold text-[#5F6A8C]">{room.temp}°C</p>
        </div>
        <div className="bg-[#BFC5D9]/20 p-4 rounded-2xl border border-[#BFC5D9]/50">
          <p className="text-[#8C846D] text-[10px] font-bold">HUMEDAD</p>
          <p className="text-2xl font-bold text-[#5F6A8C]">45%</p>
        </div>
      </div>

      <h3 className="text-[#5F6A8C] font-bold mb-4">Dispositivos</h3>
      <div className="space-y-3">
        {room.devices.map((device) => (
          <div key={device} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#D9D2BF] shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[#5F6A8C] font-medium">{device}</span>
            <input type="checkbox" className="w-10 h-5 bg-[#D9D2BF] rounded-full appearance-none checked:bg-[#5F6A8C] transition-colors cursor-pointer relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5 after:transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}