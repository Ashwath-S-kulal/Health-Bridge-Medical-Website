import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, Stethoscope, Pill,
  Activity, Zap, HeartPulse, Menu, X, User
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <HeartPulse size={18} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Health Care</span>
        </div>

        <button onClick={toggleSidebar}>
          <div className="  text-gray-600 p-1 rounded-xl border-1 border-white">
            {isOpen ? <X size={25} /> : <Menu size={25} />}
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}




      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col p-6 z-[60]
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) w-64
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
        lg:translate-x-0
      `}>

        <div className="flex items-center justify-between mb-10">
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-3 group cursor-pointer pl-2">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Health<span className="text-blue-600"> Care</span>
              </h1>
            </div>
          </NavLink>
         
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
          <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/patienthub" icon={<Zap size={20} />} label="Patient Hub" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/nearbyfacility" icon={<MapPin size={20} />} label="Nearby Facilities" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/doctors" icon={<Stethoscope size={20} />} label="Consult Doctors" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/medicinefinderourdata" icon={<Pill size={20} />} label="Medicine Vault" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/diseasevault" icon={<Activity size={20} />} label="Disease Vault" onClick={() => setIsOpen(false)} />
        </nav>

        <div className="mt-8 bg-blue-50 p-5 rounded-2xl text-white relative overflow-hidden border border-gray-300 shadow-2xl">
          <div className="relative z-10">
            <p className="text-[9px] uppercase tracking-[0.2em] text-blue-400 mb-1 font-black">24/7 Support</p>
            <h4 className="font-bold text-sm mb-4 leading-tight text-sky-400">Emergency?</h4>
            <button className="w-full bg-rose-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20">
              Call SOS
            </button>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-xs  tracking-wide
      ${isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1 mx-2'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }
    `}
  >
    <span className={({ isActive }) => isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;