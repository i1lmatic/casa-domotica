// App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import Control from './components/Control';

function App() {
  const [roomSelected, setRoomSelected] = useState({
    id: 'sala',
    name: 'Sala de Estar',
    temp: 22,
    devices: ['Luz Principal', 'Aire Acondicionado']
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] p-4 md:p-10 font-sans text-[#5F6A8C]">
      <div className="max-w-6xl mx-auto space-y-8">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Map onSelectRoom={setRoomSelected} activeRoom={roomSelected.id} />
          </div>
          <div className="lg:col-span-4">
            <Control room={roomSelected} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;