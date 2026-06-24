import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard, MapPin, Stethoscope, Pill,
  Activity, Search, Bell, Star,
  ChevronRight,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  HeartPulse,
  Plus,
  Twitter,
  Linkedin,
  Instagram,
  Zap,
  ShieldCheck,
  CheckCircle2,
  User,
  Clock,
  Users,
  Settings,
  Building2,
  LibraryBig,
  BookOpenText,
  Salad,
  ClipboardList
} from 'lucide-react';
import Header from '../Components/Header';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
  const [symptom, setSymptom] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user || { currentUser: null });
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("App installed");
    }
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/doctors/getdoctor`);
        setDoctors(response.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load medical professionals.");
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-medical-bg">

      <div className="flex-1 w-full ">
        <Header />

        <main className="p-4 md:p-8 max-w-screen mx-auto pt-3 md:pt-20 lg:pt-8">
          {/* Welcome Banner Card */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-premium p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/40 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary-light/60 transition-colors duration-700 pointer-events-none" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">
                    AI Powered Smart HealthCare platform
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                  Welcome back, <span className="text-primary">{currentUser?.username || "Guest"}</span>
                </h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-md leading-relaxed">
                  Your regional medical nodes and patient support hubs are fully synchronized. System security checks are nominal.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Activity size={16} className="text-primary" /> Live Pulse: Synchronized
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <ShieldCheck size={16} className="text-accent" /> Security: E2E Encrypted
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-premium p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">Portal Directories</h3>
                <span className="text-[9px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full uppercase">Live Nodes</span>
              </div>

              <div className="space-y-2.5">
                <NavLink to="/hospital" className="group block">
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-primary-light/30 border border-transparent hover:border-primary-light rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Nearby Hospitals</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Active ERs & emergency nodes</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </NavLink>

                <NavLink to="/medical" className="group block">
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-secondary-light/30 border border-transparent hover:border-secondary-light rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-secondary">
                        <HeartPulse size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Pharmacies</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Find prescription locations</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </NavLink>

                {/* Added Admin Panel Route */}
                <NavLink to="/medicinefinder" className="group block">
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-200/50 border border-transparent hover:border-slate-300 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-slate-700">
                        <Pill size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">AI Medicine Analysis</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Get a Medice Information</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </NavLink>
              </div>
            </div>
          </section>

          {/* Quick Stats Banner */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsWidget icon={<Users className="text-primary" />} label="Specialists" value="142" desc="Verified Doctors" />
            <StatsWidget icon={<MapPin className="text-secondary" />} label="Medical Centers" value="38" desc="Nearby Units" />
            <StatsWidget icon={<Activity className="text-accent" />} label="Daily Inquiries" value="1,894" desc="+22% this week" />
            <StatsWidget icon={<Clock className="text-amber-500" />} label="Avg Consultation" value="15m" desc="Immediate triage" />
          </section>

          {/* Main Content Split: Inner Hero and Resources */}
          <section className="mb-8">
            <div className="relative w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm overflow-hidden flex flex-col lg:flex-row gap-8 items-center">

              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[100px] pointer-events-none" />

              {/* Content Area (Cleaned up: removed redundant card classes) */}
              <div className="flex-1 relative z-10">
                <h1 className="relative z-10 text-xl md:text-2xl lg:text-2xl font-bold tracking-tight text-slate-900 mb-4 leading-none">
                  Healthcare Reimagined.
                </h1>
                <p className="relative z-10 text-slate-500 text-xs md:text-sm max-w-md mb-8 leading-relaxed font-semibold">
                  Integrating verified medical networks, safety directories, and real-time medical vaults into a seamless clinical console.
                </p>

                <div className="relative z-10 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/medicinefinder')} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md shadow-primary/10 transition-all active:scale-95">
                    AI Medicine Analysis
                  </button>
                  <button onClick={() => navigate('/doctors')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 border border-slate-200">
                    Consult Doctors
                  </button>
                </div>
              </div>

              {/* Integrated Volunteer Teaser */}
              <div className="lg:w-72 shrink-0 bg-indigo-600 p-6 rounded-2xl text-white relative z-10 shadow-lg">
                <p className="text-indigo-200 text-[9px] font-black uppercase tracking-widest mb-2">Network Expansion</p>
                <h4 className="font-bold text-lg leading-tight mb-2">Volunteer Network</h4>
                <p className="text-indigo-100 text-xs font-medium mb-6 leading-relaxed">
                  Join 120+ active specialists providing digital guidance.
                </p>
                <NavLink to="/doctormailtoadmin">
                  <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-sm">
                    Register as Volunteer
                  </button>
                </NavLink>
              </div>
            </div>
          </section>
          {/* Section 1: Clinical Directories & Locators */}

          <section className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">Clinical Directories & Locators</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <HubCard
                to="/hospital"
                icon={<Building2 size={24} />}
                title="Hospitals Nearby"
                desc="Fetch live capacity stats and ER availability."
                accentColor="text-primary hover:border-primary/40"
              />
              <HubCard
                to="/medical"
                icon={<Pill size={24} />}
                title="Medical Locator"
                desc="Find nearby medical shops and drug distributors."
                accentColor="text-secondary hover:border-secondary/40"
              />
              <HubCard
                to="/medicinefinderourdata"
                icon={<LibraryBig size={24} />}
                title="Medicine Vault"
                desc="Lookup chemistry profiles, and drug interactions."
                accentColor="text-indigo-600 hover:border-indigo-600/40"
              />
              <HubCard
                to="/diseasedesc"
                icon={<BookOpenText size={24} />}
                title="Medical Encyclopedia"
                desc="Comprehensive knowledge base of diseases."
                accentColor="text-emerald-600 hover:border-emerald-600/40"
              />
            </div>
          </section>

          {/* Section 2: Health Management & Diagnostics */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">Health Management & Diagnostics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <HubCard
                to="/patient"
                icon={<Stethoscope size={24} />}
                title="Disease Management"
                desc="Log symptoms to receive personalized recovery steps."
                accentColor="text-rose-500 hover:border-rose-500/40"
              />
              <HubCard
                to="/diet"
                icon={<Salad size={24} />}
                title="Today's Diet Planner"
                desc="Customized nutritional and meal tracking."
                accentColor="text-lime-600 hover:border-lime-600/40"
              />
              <HubCard
                to="/symptoms"
                icon={<ClipboardList size={24} />}
                title="Symptom Collections"
                desc="Browse databases of common indicator profiles."
                accentColor="text-orange-500 hover:border-orange-500/40"
              />
              <HubCard
                to="/precaution"
                icon={<ShieldAlert size={24} />}
                title="Precautionary Measures"
                desc="Vital guidelines and preventative health steps."
                accentColor="text-cyan-600 hover:border-cyan-600/40"
              />
            </div>
          </section>

          {/* Verified Professionals Listing */}
          <section className="mb-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-premium">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Expertise Doctor Consultant</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Verified Practitioners</p>
              </div>
              <NavLink to="/doctors" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </NavLink>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {doctors.map((doc) => (
                <DocCard
                  key={doc._id}
                  name={doc.name}
                  spec={doc.specialty || doc.specialization}
                  rate={doc.rating || "5.0"}
                  img={doc.image}
                />
              ))}
            </div>
          </section>

          {/* Banner bottom: Free Consultations */}
          <section className="mb-8">
            <div className="relative w-full overflow-hidden bg-white text-slate-900 rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              {/* Subtle Decorative Blob */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[100px] pointer-events-none" />

              <div className="text-center md:text-left space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 text-[9px] font-black uppercase tracking-wider">
                  <HeartPulse size={12} className="animate-pulse" /> Community Health
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  Access digital guidance <br className="hidden md:inline" /> without costs
                </h3>
                <p className="text-slate-500 text-xs font-semibold max-w-md">
                  Consult with certified clinical volunteers online. High-quality support is just a few clicks away.
                </p>
              </div>

              <NavLink to="/doctors" className="shrink-0 w-full md:w-auto relative z-10">
                <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                  Consult Volunteer Doctors <ArrowRight size={15} />
                </button>
              </NavLink>
            </div>
          </section>

          {/* Simple Footer */}
          <footer className="py-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="text-primary w-5 h-5" />
              <span className="font-bold text-slate-800 text-xs tracking-tight uppercase">
                Health<span className="text-primary">Care</span> Systems
              </span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
              © {new Date().getFullYear()} HealthCare Systems • Secure Clinical Environment
            </p>
          </footer>

          {showInstall && (
            <button
              onClick={handleInstallClick}
              className="fixed bottom-20 right-6 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 z-50 border border-primary/20 flex items-center gap-2"
            >
              <Zap size={14} /> Install App
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

// Helper components
const StatsWidget = ({ icon, label, value, desc }) => (
  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">{label}</p>
      <p className="text-lg font-black text-slate-800 leading-none mb-0.5">{value}</p>
      <p className="text-[9px] text-slate-400 font-semibold leading-none">{desc}</p>
    </div>
  </div>
);

const HubCard = ({ to, icon, title, desc, accentColor }) => (
  <NavLink to={to} className="group block h-full">
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-0.5">
      <div>
        <div className={`text-2xl ${accentColor} mb-3 shrink-0`}>{icon}</div>
        <h4 className="font-bold text-slate-800 text-sm mb-1.5 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-slate-400 text-[11px] font-semibold leading-relaxed mb-4">{desc}</p>
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider mt-auto pt-4 ${accentColor}`}>
        Access Directory <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  </NavLink>
);

const DocCard = ({ name, spec, rate, img }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
    <div className="flex items-start gap-3.5 mb-3">
      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-50 border border-slate-150 flex items-center justify-center font-bold text-primary uppercase shrink-0">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          name ? name.split(' ').map(n => n[0]).join('') : 'DR'
        )}
      </div>
      <div className="overflow-hidden min-w-0">
        <h4 className="font-bold text-slate-800 text-xs truncate leading-tight group-hover:text-primary transition-colors">{name}</h4>
        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-semibold">{spec || "Medical Specialist"}</p>
      </div>
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
      <div className="flex items-center gap-0.5">
        <Star size={12} className="fill-amber-400 text-amber-400" />
        <span className="text-[10px] font-black text-slate-700">{rate}</span>
      </div>
      <NavLink to="/doctors">
        <button className="bg-primary-light/50 text-primary hover:bg-primary hover:text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all select-none">
          Consult
        </button>
      </NavLink>
    </div>
  </div>
);

export default Dashboard;