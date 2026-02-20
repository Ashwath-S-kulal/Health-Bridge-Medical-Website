import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, ShieldCheck, Activity, Sparkles, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';

export default function DiseaseVault() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      {/* 1. Removed ml-64 (Sidebar is fixed, so we use lg:pl-64)
          2. Added w-full to ensure it fills space
      */}
      <main className="flex-1 w-full lg:pl-72 p-4 md:p-8 transition-all duration-300">
        
        {/* Header - Added padding-top for mobile to avoid overlap with trigger button */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-14 lg:mt-0 lg:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Disease Vault</h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">Global database for clinical insights and recovery.</p>
          </div>
        </header>

        {/* Navigation Grid - 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 md:mb-12">
          <VaultCard 
            to="/diseasedesc"
            icon={<BookOpen />}
            title="Encyclopedia"
            desc="Detailed descriptions, causes, and clinical background of 5,000+ conditions."
            accent="bg-blue-500"
          />

          <VaultCard 
            to="/precaution"
            icon={<ShieldCheck />}
            title="Safety Protocols"
            desc="Step-by-step precautions and preventive measures for viral and chronic illnesses."
            accent="bg-emerald-500"
          />

          <VaultCard 
            to="/symptoms"
            icon={<Activity />}
            title="Symptom Checker"
            desc="Analyze your current condition and map it against common medical indicators."
            accent="bg-cyan-500"
          />
        </div>

        {/* AI Insight Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Main Insight Card - stacks vertically on small screens */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-start gap-6">
            <div className="bg-yellow-100 p-4 rounded-2xl text-yellow-600 shrink-0">
              <Sparkles size={32} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Did you know?</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                Most seasonal allergies can be mitigated by tracking local pollen counts. 
                Our **Safety Protocols** section now includes a real-time environmental 
                trigger map for respiratory health.
              </p>
              <button className="mt-4 text-cyan-600 font-bold text-xs uppercase tracking-widest hover:underline">
                Read Research Paper
              </button>
            </div>
          </div>

          {/* Quick Stats - Stays prominent but adjusts width */}
          <div className="lg:col-span-4 bg-[#0F172A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Status</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Diseases Cataloged</span>
                <span className="font-bold text-lg">12,402</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Safety Guidelines</span>
                <span className="font-bold text-lg">850+</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- Reusable Card Component --- */
const VaultCard = ({ to, icon, title, desc, accent }) => (
  <NavLink to={to} className="group h-full">
    <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col justify-between">
      <div>
        <div className={`w-12 h-12 md:w-14 md:h-14 ${accent} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 md:mb-3">{title}</h3>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 font-medium">
          {desc}
        </p>
      </div>
      <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-colors ${accent.replace('bg-', 'text-')}`}>
        Access Vault <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </NavLink>
);