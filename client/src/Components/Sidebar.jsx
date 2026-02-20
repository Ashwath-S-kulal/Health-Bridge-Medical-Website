import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, Stethoscope, Pill, 
  Activity, Zap, HeartPulse, Menu, X 
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- Mobile Trigger Button --- */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-slate-100 text-slate-600"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- Backdrop (Mobile only) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col p-6 z-40
        transition-transform duration-300 ease-in-out w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        
        {/* Logo Section */}
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0 pl-2 mb-10">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <HeartPulse className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Health<span className="text-blue-600"> Bridge</span>
            </h1>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/patient" icon={<Zap size={20} />} label="Patient Hub" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/nearbyfacility" icon={<MapPin size={20} />} label="Nearby Facilities" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/doctors" icon={<Stethoscope size={20} />} label="Consult Doctors" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/medicinefinderourdata" icon={<Pill size={20} />} label="Medicine Vault" onClick={() => setIsOpen(false)} />
          <SidebarLink to="/diseasevault" icon={<Activity size={20} />} label="Disease Vault" onClick={() => setIsOpen(false)} />
        </nav>

        {/* Emergency Card */}
        <div className="mt-auto bg-[#0F172A] p-5 rounded-[24px] text-white hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Emergency Support</p>
          <h4 className="font-bold text-sm mb-4 leading-tight">Need immediate help?</h4>
          <button className="w-full bg-[#F43F5E] py-3 rounded-xl text-xs font-black uppercase hover:bg-rose-600 transition-colors">
            Call SOS
          </button>
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
      flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm 
      ${isActive 
        ? 'bg-blue-50 text-blue-600 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }
    `}
  >
    {icon} <span>{label}</span>
  </NavLink>
);

export default Sidebar;