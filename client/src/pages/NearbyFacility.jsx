import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Pill, Navigation, ChevronRight } from 'lucide-react';
import Sidebar from '../Components/Sidebar';

export default function NearbyFacility() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 w-full pt-20 lg:ml-64 p-4 sm:p-6 md:p-8 transition-all duration-300">
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Nearby Support</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">Find the fastest route to medical assistance.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">

          <NavLink to="/hospital" className="group">
            <div className="h-full bg-white p-6 md:p-8 rounded-[30px] md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-cyan-50 rounded-full -mr-8 -mt-8 md:-mr-10 md:-mt-10 group-hover:bg-cyan-100 transition-colors" />

              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-cyan-200 transition-transform">
                  <MapPin size={24} className="md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Find Hospitals</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
                  Locate nearest emergency rooms, specialty clinics, and hospitals with live availability.
                </p>
                <div className="flex items-center gap-2 text-cyan-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                  Start Fetching <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </NavLink>

          <NavLink to="/medical" className="group">
            <div className="h-full bg-white p-6 md:p-8 rounded-[30px] md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-rose-50 rounded-full -mr-8 -mt-8 md:-mr-10 md:-mt-10 group-hover:bg-rose-100 transition-colors" />

              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#F43F5E] text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-rose-200 transition-transform">
                  <Pill size={24} className="md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Find Medicals</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
                  Browse local pharmacies for medicine availability and 24/7 delivery options.
                </p>
                <div className="flex items-center gap-2 text-[#F43F5E] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                  Start Fetching <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </NavLink>

        </div>

        <div className="bg-[#0F172A] rounded-xl md:rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
          <div className="text-center md:text-left">
            <h4 className="text-lg md:text-xl font-bold mb-2">Instant Location Fetching</h4>
            <p className="text-slate-400 text-xs md:text-sm max-w-sm">
              Enable GPS to find specialized care within a 5km radius instantly.
            </p>
          </div>
          <button className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-md md:rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
            <Navigation size={16} /> Enable GPS
          </button>
        </div>

      </main>
    </div>
  );
}