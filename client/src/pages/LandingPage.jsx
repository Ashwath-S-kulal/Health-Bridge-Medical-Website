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
  Instagram
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
  const [symptom, setSymptom] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/doctors/getdoctor');
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
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar />

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-12 md:pt-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Welcome back, <span>{currentUser.username}</span>
            </h1>
            <p className="text-slate-500 text-sm">How are you feeling today?</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <button onClick={() => navigate("/profile")} className="w-10 h-10 md:w-12 md:h-12 bg-white border border-slate-200 rounded-full overflow-hidden flex-shrink-0">
              <img src={currentUser.profilePicture} alt="profile" className="h-full w-full object-cover" />
            </button>
          </div>
        </header>

        {/* AI Banner - Stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="col-span-1 lg:col-span-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="relative z-10 max-w-md">
              <h2 className="text-xl md:text-2xl font-bold mb-3">AI Symptom Analysis</h2>
              <p className="text-blue-100 text-sm mb-6 md:mb-8">Input your symptoms to receive a personalized care protocol.</p>
              <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                <input
                  type="text"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="E.g. Persistent dry cough..."
                  className="bg-transparent flex-1 px-4 py-2 text-sm placeholder:text-blue-100 outline-none"
                />
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                  Analyze
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Nearby Support</h3>
            <div className="space-y-3 flex flex-col gap-2">
              <NavLink to="/hospital"><SupportItem icon={<MapPin className="text-cyan-500" size={18} />} label="Hospitals" /></NavLink>
              <NavLink to="/medical"><SupportItem icon={<Pill className="text-blue-500" size={18} />} label="Pharmacies" /></NavLink>
            </div>
          </div>
        </div>

        {/* Verified Professionals */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Verified Professionals</h3>
            <NavLink to="/doctors" className="text-cyan-600 text-sm font-semibold hover:underline">View all</NavLink>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {doctors.map((doc) => (
              <DocCard
                key={doc._id}
                name={doc.name}
                spec={doc.specialization}
                rate={doc.rating || "5.0"}
                initial={doc.name.split(' ').map(n => n[0]).join('')}
                img={doc.image}
                color="bg-cyan-50"
              />
            ))}
          </div>
        </div>

        {/* Inner Landing/Hero Section */}
        <div className="bg-[#F0F4F8] text-[#1A2B3B] selection:bg-blue-100">
          <div className="pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Hero Card */}
              <div className="lg:col-span-8 bg-white p-6 md:p-12 lg:p-16 rounded-[32px] md:rounded-[48px] shadow-xl border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-100 transition-colors duration-700" />
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 w-fit relative z-10">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                  Next Generation Care
                </span>
                <h1 className="relative z-10 text-3xl md:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  Health Care <br />
                  <span className="text-blue-600">for everyone.</span>
                </h1>
                <p className="relative z-10 text-sm md:text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
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

              {/* Volunteer Card */}
              <div className="lg:col-span-4 bg-blue-600 p-6 md:p-8 rounded-[32px] md:rounded-[48px] text-white flex flex-col justify-between shadow-xl shadow-blue-100 relative overflow-hidden">
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
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4">Patient Resources</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {[{ title: "Emergency Care", desc: "Find 24/7 ER departments" }, { title: "Bed Capacity", desc: "Real-time hospital availability" }].map((item, i) => (
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
                  <div className="pt-2">
                    <NavLink to="/doctors">
                      <div className="flex items-center justify-between w-full bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl hover:bg-white/20 transition-all group active:scale-[0.98]">
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Consultation</span>
                          <span className="text-sm font-bold text-white">Find Doctors</span>
                        </div>
                        <div className="bg-white text-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {/* Card 1: Nearby Hospitals */}
              <div className="lg:col-span-4">
                <NavLink to="/hospital" className="block h-full">
                  <div className="h-full min-h-[350px] group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Live Tracking</span>
                      <h3 className="text-3xl font-black mt-6 leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">Nearby <br />Hospitals</h3>
                    </div>
                    <p className="relative z-10 text-sm font-medium text-slate-400 group-hover:text-slate-600">Fetch real-time location data for ERs and clinics.</p>
                    <div className="relative z-10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-blue-600 font-bold text-sm flex items-center gap-2">
                      Explore More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card 2: Medical Locator */}
              <div className="lg:col-span-4">
                <NavLink to="/medical" className="block h-full">
                  <div className="h-full min-h-[350px] group bg-emerald-500 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-200 transition-all duration-700 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute -right-8 -top-8 text-[10rem] opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">🧪</div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white"><Pill className="w-8 h-8" /></div>
                      <h3 className="text-3xl font-black text-white leading-tight mb-4">Medical <br />Locator</h3>
                    </div>
                    <button className="relative z-10 w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                      FIND STORES <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </NavLink>
              </div>

              {/* Card 3: Medicine Finder */}
              <div className="lg:col-span-4">
                <NavLink to="/medicinefinder" className="block h-full">
                  <div className="h-full min-h-[350px] group bg-[#6366F1] rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-700 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute -right-10 -bottom-10 text-[8rem] opacity-10 group-hover:-rotate-12 transition-transform duration-1000 pointer-events-none">💊</div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white"><Search className="w-8 h-8" /></div>
                      <h3 className="text-3xl font-black text-white leading-tight mb-4">Medicine <br />Finder</h3>
                    </div>
                    <button className="relative z-10 w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                      SEARCH DRUGS <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </NavLink>
              </div>

              {/* Card 4: Disease Encyclopedia */}
              <div className="md:col-span-2 lg:col-span-12 xl:col-span-4">
                <NavLink to="/diseasedesc" className="block h-full">
                  <div className="h-full min-h-[300px] group bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl transition-all duration-700 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 text-indigo-400 mb-6">
                        <div className="h-[2px] w-8 bg-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Database</span>
                      </div>
                      <h3 className="text-3xl font-black text-white leading-tight">Disease <br />Encyclopedia</h3>
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">5,000+ Conditions</span>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card 5 & 6: Symptom & Safety */}
              <div className="md:col-span-1 lg:col-span-6 xl:col-span-4">
                <NavLink to="/symptoms" className="block h-full">
                  <div className="h-full min-h-[140px] group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl flex items-center gap-4 hover:bg-rose-50 transition-all duration-500">
                    <div className="w-16 h-16 bg-rose-500 rounded-[1.2rem] flex items-center justify-center text-white shrink-0"><Activity size={24} /></div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-lg font-black text-slate-900 truncate">Symptom Mapping</h4>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Analyze signals instantly</p>
                    </div>
                  </div>
                </NavLink>
              </div>

              <div className="md:col-span-1 lg:col-span-6 xl:col-span-4">
                <NavLink to="/precaution" className="block h-full">
                  <div className="h-full min-h-[140px] group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl flex items-center gap-4 hover:bg-blue-50 transition-all duration-500">
                    <div className="w-16 h-16 bg-blue-900 rounded-[1.2rem] flex items-center justify-center text-white shrink-0"><ShieldAlert size={24} /></div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-lg font-black text-slate-900 truncate">Safety Protocols</h4>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Prevention Guides</p>
                    </div>
                  </div>
                </NavLink>
              </div>
            </div>

            {/* Bottom Banner Section */}
            <div className="w-full mt-12">
              <div className="relative w-full overflow-hidden bg-white rounded-[32px] md:rounded-[48px] border border-slate-200 shadow-2xl group transition-all duration-500">
                <div className="relative flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 lg:p-16 gap-10">
                  <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <HeartPulse size={16} className="animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Health</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                      Access Expert Care <br />
                      <span className="text-indigo-600">Without the Cost.</span>
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                      Connect with certified medical professionals offering their time and expertise for free.
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-full lg:w-auto">
                    <NavLink to="/doctors" className="block">
                      <button className="group/btn relative w-full flex items-center justify-center gap-4 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-5 rounded-[24px] transition-all duration-300 active:scale-95">
                        <div className="flex flex-col items-start">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 text-left">Get Started</span>
                          <span className="text-sm font-black uppercase tracking-tight">Find Volunteer Doctors</span>
                        </div>
                        <ArrowRight size={20} />
                      </button>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full py-16 bg-white border-t border-slate-100 mt-12">
            <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-8">
                <HeartPulse className="text-indigo-600" size={24} />
                <span className="text-lg font-black tracking-widest text-slate-900 uppercase">
                  Health<span className="text-indigo-600">Bridge</span>
                </span>
              </div>
              <div className="flex gap-8 mb-10">
                <a href="#" className="text-slate-300 hover:text-indigo-500 transition-all"><Twitter size={20} /></a>
                <a href="#" className="text-slate-300 hover:text-indigo-500 transition-all"><Linkedin size={20} /></a>
                <a href="#" className="text-slate-300 hover:text-indigo-500 transition-all"><Instagram size={20} /></a>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center">
                © {new Date().getFullYear()} HealthBridge Systems • Secure Medical Network
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const SupportItem = ({ icon, label }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
    <div className="flex items-center gap-3">{icon} <span className="text-sm font-bold text-slate-700">{label}</span></div>
    <span className="text-[10px] font-bold text-slate-300">Find →</span>
  </div>
);

const DocCard = ({ name, spec, rate, initial, color, img }) => (
  <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start gap-4 mb-4">
      <div className={`w-12 h-12 rounded-xl overflow-hidden ${color} flex items-center justify-center font-bold text-cyan-700 uppercase shrink-0`}>
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          initial
        )}
      </div>
      <div className="overflow-hidden">
        <h4 className="font-bold text-slate-900 text-sm truncate">{name}</h4>
        <p className="text-xs text-slate-400 truncate">{spec}</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Star size={14} className="fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-bold text-slate-700">{rate}</span>
      </div>
      <NavLink to="/doctors">
        <button className="bg-cyan-50 text-cyan-600 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-cyan-500 hover:text-white transition-all">
          Take Consult
        </button>
      </NavLink>
    </div>
  </div>
);

export default Dashboard;