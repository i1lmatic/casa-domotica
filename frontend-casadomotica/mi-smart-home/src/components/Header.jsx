// components/Header.jsx
export default function Header() {
  return (
    <header className="flex justify-between items-end border-b border-[#D9D2BF] pb-6">
      <div>
        <p className="text-[#8C846D] uppercase tracking-[0.2em] text-xs font-bold">Smart Home System</p>
        <h1 className="text-4xl font-light text-[#5F6A8C]">Panel de <span className="font-bold">Control</span></h1>
      </div>
      <div className="text-right">
        <span className="px-4 py-2 bg-[#BFC5D9]/30 rounded-full text-[#5F6A8C] text-sm font-medium border border-[#BFC5D9]">
          ● Sistema Online
        </span>
      </div>
    </header>
  );
}