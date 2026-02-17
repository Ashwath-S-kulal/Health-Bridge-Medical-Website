import React, { useState } from 'react';
import {
    MapPin,
    Pill,
    BookOpen,
    Activity,
    ShieldAlert,
    Search,
    ChevronRight,
    HeartPulse,
    Plus,
    Github,
    Twitter,
    Linkedin,
    UserPlus,
    ArrowRight,
    Stethoscope
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';

const UltraMedicalHub = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="min-h-screen bg-[#F0F4F8] text-[#1A2B3B] font-sans selection:bg-blue-100 overflow-x-hidden">
            <Header />
            
            {/* Hero Section */}
            <div className="pt-24 pb-12 px-4 sm:px-6">
                <main className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Main Hero Card */}
                        <div className="lg:col-span-8 bg-white p-8 md:p-16 rounded-[32px] md:rounded-[48px] shadow-xl border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-100 transition-colors duration-700" />
                            
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 w-fit relative z-10">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                                Next Generation Care
                            </span>
                            
                            <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                                Health Care <br />
                                <span className="text-blue-600">for everyone.</span>
                            </h1>
                            
                            <p className="relative z-10 text-base md:text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
                                Combining world-class clinical expertise with advanced AI to provide personalized health journeys and real-time medical support.
                            </p>
                            
                            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                                <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                                    Get Started
                                </button>
                                <button className="bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Volunteer/Sidebar Card */}
                        <div className="lg:col-span-4 bg-blue-600 p-8 md:p-10 rounded-[32px] md:rounded-[48px] text-white flex flex-col justify-between shadow-xl shadow-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            
                            <div className="mb-10">
                                <div className="relative p-6 bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 overflow-hidden group">
                                    <h4 className="text-xl font-bold mb-3">Medical Professionals</h4>
                                    <p className="text-sm text-blue-50 leading-relaxed mb-6">
                                        Are you a licensed Doctor? Help us save lives by joining our <span className='font-bold underline decoration-blue-300'>Volunteer Network.</span>
                                    </p>
                                    <NavLink to="/doctormailtoadmin">
                                        <div className="inline-flex items-center justify-center w-full bg-white text-blue-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-md">
                                            Register as Volunteer
                                        </div>
                                    </NavLink>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Patient Resources</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { title: "Emergency Care", desc: "Find 24/7 ER departments near you" },
                                        { title: "Bed Capacity", desc: "Check real-time hospital availability" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start p-2 rounded-xl hover:bg-white/5 transition-colors">
                                            <div className="h-2 w-2 rounded-full bg-blue-300 mt-2 shrink-0" />
                                            <div>
                                                <div className="text-sm font-bold">{item.title}</div>
                                                <div className="text-[11px] text-blue-100/80 leading-tight">{item.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Nearby Hospitals */}
                    <div className="lg:col-span-1">
                        <NavLink to="/hospital" className="block h-full">
                            <div className="h-[400px] group bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50 px-3 py-1 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                        Live Tracking
                                    </span>
                                    <h3 className="text-3xl font-black mt-6 leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                                        Nearby <br />Hospitals
                                    </h3>
                                </div>
                                <p className="relative z-10 text-sm font-medium leading-relaxed text-slate-400 group-hover:text-slate-600">
                                    Fetch real-time location data for ERs and specialty clinics with current wait times.
                                </p>
                                <div className="relative z-10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-blue-600 font-bold text-sm flex items-center gap-2">
                                    Explore More <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </NavLink>
                    </div>

                    {/* Card 2: Medical Locator */}
                    <div className="lg:col-span-1">
                        <NavLink to="/medical" className="block h-full">
                            <div className="h-[400px] group bg-emerald-500 rounded-[2.5rem] p-8 md:p-10 shadow-xl hover:shadow-2xl hover:shadow-emerald-200 transition-all duration-700 flex flex-col justify-between overflow-hidden relative">
                                <div className="absolute -right-8 -top-8 text-[12rem] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">🧪</div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                        <Pill className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white leading-tight mb-4">Medical <br />Locator</h3>
                                    <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-[200px]">Locate 24/7 pharmacies and medical supply chains nearby.</p>
                                </div>
                                <button className="relative z-10 w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 group-hover:gap-4 transition-all active:scale-95 shadow-lg">
                                    FIND STORES <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </NavLink>
                    </div>

                    {/* Card 3: Medicine Finder */}
                    <div className="lg:col-span-1">
                        <NavLink to="/medicinefinder" className="block h-full">
                            <div className="h-[400px] group bg-[#6366F1] rounded-[2.5rem] p-8 md:p-10 shadow-xl hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-700 flex flex-col justify-between overflow-hidden relative">
                                <div className="absolute -right-10 -bottom-10 text-[10rem] opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000 pointer-events-none">💊</div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                                        <Search className="w-8 h-8 animate-pulse" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 bg-white/10 px-3 py-1 rounded-md mb-4 inline-block">FDA Database</span>
                                    <h3 className="text-3xl font-black text-white leading-tight mb-4">Medicine <br />Finder</h3>
                                    <p className="text-indigo-50 text-sm font-medium leading-relaxed max-w-[220px]">Search drug interactions, dosage, and safety warnings.</p>
                                </div>
                                <button className="relative z-10 w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 group-hover:gap-4 transition-all shadow-lg active:scale-95">
                                    SEARCH DRUGS <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </NavLink>
                    </div>

                    {/* Card 4: Disease Encyclopedia (Full width on md, 1/3 on lg) */}
                    <div className="md:col-span-2 lg:col-span-4">
                        <NavLink to="/diseasedesc" className="block h-full">
                            <div className="h-[300px] md:h-[400px] group bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl transition-all duration-700 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 text-indigo-400 mb-6">
                                        <div className="h-[2px] w-8 bg-indigo-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Database</span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">Disease <br />Encyclopedia</h3>
                                </div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className="flex items-center gap-4 text-slate-400 group-hover:text-white transition-colors">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-widest">5,000+ Conditions</span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium max-w-sm">Detailed clinical descriptions simplified for everyday patient understanding.</p>
                                </div>
                            </div>
                        </NavLink>
                    </div>

                    {/* Card 5: Symptom Mapping */}
                    <div className="md:col-span-1 lg:col-span-4">
                        <NavLink to="/symptoms" className="block h-full">
                            <div className="h-full min-h-[160px] group bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl flex items-center gap-6 hover:bg-rose-50 transition-all duration-500 cursor-pointer">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-rose-100 group-hover:scale-110 transition-transform shrink-0">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-black text-slate-900">Symptom Mapping</h4>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-rose-600 transition-colors">Analyze signals instantly</p>
                                </div>
                                <Plus className="hidden lg:block text-slate-200 group-hover:text-rose-500 w-8 h-8 group-hover:rotate-90 transition-all" />
                            </div>
                        </NavLink>
                    </div>

                    {/* Card 6: Safety Protocols */}
                    <div className="md:col-span-1 lg:col-span-4">
                        <NavLink to="/precaution" className="block h-full">
                            <div className="h-full min-h-[160px] group bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl flex items-center gap-6 hover:bg-blue-50 transition-all duration-500 cursor-pointer">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform shrink-0">
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-black text-slate-900">Safety Protocols</h4>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-blue-600 transition-colors">Prevention Guides</p>
                                </div>
                                <Plus className="hidden lg:block text-slate-200 group-hover:text-blue-500 w-8 h-8 group-hover:rotate-90 transition-all" />
                            </div>
                        </NavLink>
                    </div>
                </div>

                {/* Banner Section */}
                <div className="w-full mt-12">
                    <div className="relative w-full overflow-hidden bg-white rounded-[32px] md:rounded-[48px] border border-slate-200 shadow-2xl shadow-indigo-100 group transition-all duration-500 hover:shadow-indigo-200">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60" />
                        
                        <div className="relative flex flex-col lg:flex-row items-center justify-between p-8 md:p-16 gap-10">
                            <div className="flex-1 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                    <HeartPulse size={16} className="animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Health Support</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                    Access Expert Care <br />
                                    <span className="text-indigo-600">Without the Cost.</span>
                                </h2>

                                <p className="text-slate-500 text-base max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                                    Connect with certified medical professionals offering their time and expertise for free. Your health shouldn't be limited by your budget.
                                </p>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 pt-2">
                                    {['100% Free', 'Verified Doctors', 'Secure Portal'].map((text) => (
                                        <div key={text} className="flex items-center gap-2 text-slate-600">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-full lg:w-auto">
                                <NavLink to="/doctors" className="block">
                                    <button className="group/btn relative w-full flex items-center justify-center gap-4 bg-slate-900 hover:bg-indigo-600 text-white px-8 md:px-10 py-6 rounded-[24px] transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95">
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Get Started</span>
                                            <span className="text-sm md:text-base font-black uppercase tracking-tight">Find Volunteer Doctors</span>
                                        </div>
                                        <div className="bg-white/10 p-2 rounded-xl group-hover/btn:translate-x-1 transition-transform">
                                            <ArrowRight size={20} />
                                        </div>
                                    </button>
                                </NavLink>
                                <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                    Available 24/7 for consultation
                                </p>
                            </div>
                            
                            <div className="absolute right-12 bottom-0 opacity-[0.03] pointer-events-none hidden xl:block">
                                <Stethoscope size={300} strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-16 bg-white border-t border-slate-100 mt-12">
                <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8 opacity-80 hover:opacity-100 transition-opacity">
                        <HeartPulse className="text-indigo-600" size={24} />
                        <span className="text-lg font-black tracking-widest text-slate-900 uppercase">
                            Health<span className="text-indigo-600">Bridge</span>
                        </span>
                    </div>
                    
                    <div className="flex gap-8 mb-10">
                        {[Twitter, Linkedin, Github].map((Icon, i) => (
                            <a key={i} href="#" className="text-slate-300 hover:text-indigo-500 transition-all hover:scale-110">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>

                    <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center">
                        © {new Date().getFullYear()} HealthBridge Systems • Secure Medical Network
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default UltraMedicalHub;