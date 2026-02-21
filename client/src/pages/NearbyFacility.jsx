import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Pill, Navigation, ChevronRight, Stethoscope, ArrowRight } from 'lucide-react';
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
            <div className="h-full bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
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
            <div className="h-full bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
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

        <div className="max-w-screen mx-auto mt-12 bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row">

            <div className="lg:w-1/3 bg-slate-900 p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full -mr-16 -mt-16" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Stethoscope className="text-cyan-400" size={24} />
                </div>
                <h3 className="text-white text-2xl font-black tracking-tight leading-tight">
                  Verified <br /> Specialist <br /> Network
                </h3>
              </div>

              <div className="relative z-10 mt-10 lg:mt-0">
                <div className="flex -space-x-3 mb-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      className="w-10 h-10 rounded-full border-4 border-slate-900 object-cover"
                      alt="doctor"
                    />
                  ))}
                </div>
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">
                  Active Volunteers: +
                </p>
              </div>
            </div>

            {/* Message & Action Side */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full mb-6 border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Free Consultation Available</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">
                  Experiencing health problems? <br />
                  <span className="text-slate-400">Get a professional opinion.</span>
                </h2>

                <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed mb-8">
                  Consult with our <span className="text-slate-900 font-bold">verified volunteer doctors</span> for any medical concerns. We bridge the gap between you and high-quality healthcare, absolutely free of charge.
                </p>

                <NavLink
                  to="/doctors">
                  <button className="group flex items-center gap-4 bg-slate-900 hover:bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-slate-200">
                    Find a Consultant
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </NavLink>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}