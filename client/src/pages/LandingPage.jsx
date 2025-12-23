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
    Plus
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { UserPlus, ArrowRight, Stethoscope } from 'lucide-react';

const UltraMedicalHub = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="min-h-screen bg-[#F0F4F8] text-[#1A2B3B] font-sans selection:bg-blue-100 overflow-x-hidden">
            <Header />
            <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pt-20">
                <main className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 bg-white p-10 md:p-16 rounded-[40px] shadow-xl border border-slate-200 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl" />
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8 w-fit">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                                Next Generation Care
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
                                Health Care <br />
                                <span className="text-blue-600">for everyone.</span>
                            </h1>
                            <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
                                Combining world-class clinical expertise with advanced AI to provide personalized health journeys.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                                    Get Started
                                </button>
                                <button className="bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-blue-600 p-10 rounded-[40px] text-white flex flex-col justify-between shadow-xl shadow-blue-200">
                            <div className="mt-10 mb-10">
                                <div className="relative p-6 bg-white/10 rounded-[30px] border-2 border-white/20 overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-400 blur-[40px] opacity-50" />
                                    <h4 className="text-lg font-extrabold mb-2">Medical Professionals</h4>
                                    <p className="text-sm text-blue-50 leading-relaxed mb-6">
                                        Are you a licensed Doctor.? Help us save lives by joining our <span className='font-bold'>Volunteer Network. </span> 
                                        Simply send your credentials to our admin team to get verified.
                                    </p>
                                    <NavLink to="/doctormailtoadmin">
                                        <div className="inline-flex items-center justify-center w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                                            Register as Volunteer
                                        </div>
                                    </NavLink>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Patient Resources</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { title: "Emergency Care", desc: "Find 24/7 ER departments near you" },
                                        { title: "Bed Capacity", desc: "Check real-time hospital availability" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="h-2 w-2 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                                            <div>
                                                <div className="text-sm font-bold">{item.title}</div>
                                                <div className="text-[11px] text-blue-200 leading-tight">{item.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>


            <section className="max-w-7xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4">
                        <NavLink to="/hospital" className="block h-full">
                            <div
                                onMouseEnter={() => setHoveredIndex(0)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="h-[420px] group bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-700 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative z-10 transform transition-transform duration-500 group-hover:translate-x-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50 px-3 py-1 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                        Live Tracking
                                    </span>
                                    <h3 className="text-3xl font-black mt-4 leading-none transition-colors duration-700 text-slate-900 group-hover:text-blue-600">
                                        Nearby <br />Hospitals
                                    </h3>
                                </div>

                                <p className="relative z-10 text-sm font-medium leading-relaxed transition-colors duration-700 text-slate-400 group-hover:text-slate-600">
                                    Fetch real-time location data for ERs and specialty clinics with current wait times.
                                </p>
                                <div className="relative z-10 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-blue-600 font-bold text-sm">
                                    Explore More
                                </div>
                            </div>
                        </NavLink>
                    </div>

                    <div className="md:col-span-4">
                        <NavLink to="/medical" className="block h-full">
                            <div className="h-[420px] group bg-emerald-500 rounded-[3.5rem] p-10 shadow-xl hover:shadow-2xl hover:shadow-emerald-200 transition-all duration-700 flex flex-col justify-between overflow-hidden relative">
                                <div className="absolute -right-10 -top-10 text-[18rem] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">🧪</div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white">
                                        <Pill className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white leading-none mb-4">Medical <br />Locator</h3>
                                    <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-[200px]">Locate 24/7 pharmacies and medical supply chains nearby.</p>
                                </div>
                                <button className="relative z-10 w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                                    FIND STORES <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </NavLink>
                    </div>

                    <div className="md:col-span-4">
                        <NavLink to="/diseasedesc" className="block h-full">
                            <div className="h-[420px] group bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl transition-all duration-700 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 text-indigo-400 mb-6">
                                        <div className="h-[2px] w-8 bg-indigo-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Database</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white leading-none">Disease <br />Encyclopedia</h3>
                                </div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className="flex items-center gap-4 text-slate-400 group-hover:text-white transition-colors">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-widest">5,000+ Conditions</span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">Detailed clinical descriptions simplified for patients.</p>
                                </div>
                            </div>
                        </NavLink>
                    </div>

                    <div className="md:col-span-6">
                        <NavLink to="/symptoms" className="block">
                            <div className="group bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl flex items-center gap-8 hover:bg-rose-50 transition-colors duration-500 cursor-pointer">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-rose-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-rose-200 group-hover:scale-110 transition-transform flex-shrink-0">
                                    <Activity className="w-10 h-10" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Symptom Mapping</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 group-hover:text-rose-600">Analyze physical signals instantly</p>
                                </div>
                                <Plus className="hidden sm:block text-slate-200 group-hover:text-rose-500 w-10 h-10 group-hover:rotate-90 transition-all" />
                            </div>
                        </NavLink>
                    </div>

                    <div className="md:col-span-6">
                        <NavLink to="/precaution" className="block">
                            <div className="group bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl flex items-center gap-8 hover:bg-blue-50 transition-colors duration-500 cursor-pointer">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform flex-shrink-0">
                                    <ShieldAlert className="w-10 h-10" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Safety Protocols</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 group-hover:text-blue-600 transition-colors">Prevention & Hygiene Guides</p>
                                </div>
                                <Plus className="hidden sm:block text-slate-200 group-hover:text-blue-500 w-10 h-10 group-hover:rotate-90 transition-all" />
                            </div>
                        </NavLink>
                    </div>
                </div>


                <div className="w-full px-4 py-8 pb-0">
                    <div className="relative w-full overflow-hidden bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-indigo-100 group transition-all duration-500 hover:shadow-indigo-200">

                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 group-hover:bg-indigo-100 transition-colors duration-500" />
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-50 rounded-full blur-2xl opacity-50" />

                        <div className="relative flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-8">
                            <div className="flex-1 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                    <HeartPulse size={16} className="animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Health Support</span>
                                </div>

                                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                    Access Expert Care <br />
                                    <span className="text-indigo-600 md:text-4xl">Without the Cost.</span>
                                </h2>

                                <p className="text-slate-500 text-sm lg:text-base max-w-xl font-medium leading-relaxed">
                                    Connect with certified medical professionals offering their time and expertise for free. Your health shouldn't be limited by your budget.
                                </p>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-2">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">100% Free</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Verified Doctors</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Secure Portal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-full lg:w-auto">
                                <NavLink to="/doctors">
                                    <button
                                        className="group/btn relative w-full lg:w-auto flex items-center justify-center gap-4 bg-slate-900 hover:bg-indigo-600 text-white px-10 py-6 rounded-3xl transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Get Started</span>
                                            <span className="text-sm font-black uppercase tracking-widest">Find Free Volunteer Doctors</span>
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
                            <div className="absolute right-12 bottom-12 opacity-[0.03] pointer-events-none hidden xl:block">
                                <Stethoscope size={240} strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="w-full py-12 bg-white border-t border-slate-100 mt-20">
                <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                        <HeartPulse className="text-indigo-600" size={20} />
                        <span className="text-sm font-bold tracking-widest text-slate-900 uppercase">
                            Health<span className="text-indigo-600">Bridge</span>
                        </span>
                    </div>
                    <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-6 text-slate-300">
                            <a href="#" className="hover:text-indigo-500 transition-colors"><Twitter size={16} /></a>
                            <a href="#" className="hover:text-indigo-500 transition-colors"><Linkedin size={16} /></a>
                            <a href="#" className="hover:text-indigo-500 transition-colors"><Github size={16} /></a>
                        </div>

                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            © {new Date().getFullYear()} HealthBridge Systems • Secure Medical Network
                        </p>
                    </div>

                </div>
            </footer>

        </div>
    );
};

export default UltraMedicalHub;


