import { useState, useEffect } from "react";
import Header from "../Components/Header";
import {
  Database,
  Binary,
  FlaskConical,
  LayoutGrid,
  Fingerprint,
  Dna,
  Search,
  ArrowLeft
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";

const SymptomNavigator = () => {
  const [selectedDisease, setSelectedDisease] = useState("");
  const [uniqueDiseases, setUniqueDiseases] = useState([]);
  const [diseaseSymptoms, setDiseaseSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [cache, setCache] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/symptoms/list`)
      .then(res => res.json())
      .then(data => {
        setUniqueDiseases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const handleDiseaseChange = async (e) => {
    const disease = e.target.value;
    setSelectedDisease(disease);
    if (!disease) {
      setDiseaseSymptoms([]);
      return;
    }

    if (cache[disease]) {
      setDiseaseSymptoms(cache[disease]);
      return;
    }

    setFetchingDetails(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/symptoms?disease=${encodeURIComponent(disease)}`);
      const data = await res.json();
      const results = Array.isArray(data) ? data : [];
      setCache(prev => ({ ...prev, [disease]: results }));
      setDiseaseSymptoms(results);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetchingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      {/* Container: Responsive Margin */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <style>{`
          @keyframes loading-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .animate-loading-bar {
            animation: loading-slide 1.5s infinite linear;
          }
        `}</style>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12 relative z-10">
          
          {/* Top Nav */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-cyan-600 transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Directory
          </button>

          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-10 gap-8 border-b border-slate-200 pb-10">
            <div className="space-y-2">

              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">
                SYMPTOM <span className="text-cyan-600">COLLECTIONS</span>
              </h1>
              <div className="flex items-center gap-3 text-cyan-600 mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <Dna size={10} className="animate-pulse" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.4em]">
                  Symptoms Data Core
                </span>
              </div>
            </div>


            <div className="w-full lg:w-96">
              <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <Search size={12} /> Identifier Selection
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-cyan-400 rounded-xl blur opacity-10 group-hover:opacity-30 transition"></div>
                <select
                  value={selectedDisease}
                  onChange={handleDiseaseChange}
                  disabled={loading}
                  className="relative w-full bg-white border border-slate-300 py-4 px-5 rounded-xl text-slate-900 font-bold text-sm focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">
                    {loading ? "SCANNING..." : "SELECT PATHOLOGY..."}
                  </option>
                  {uniqueDiseases.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-600 font-bold">
                  ↓
                </div>
              </div>
            </div>
          </div>

          {!selectedDisease ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: <Database />, title: "Dataset", val: "Verified" },
                { icon: <Binary />, title: "Protocol", val: "v4.0.2" },
                { icon: <FlaskConical />, title: "Lab Status", val: "Online" }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-200 p-6 md:p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm hover:border-cyan-200 transition-colors">
                  <div className="text-cyan-500 mb-5 scale-125">{stat.icon}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {stat.title}
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</div>
                </div>
              ))}
            </div>
          ) : fetchingDetails ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-white rounded-[3rem] border border-slate-100">
              <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-cyan-500 animate-loading-bar"></div>
              </div>
              <span className="text-[10px] text-cyan-600 font-black tracking-[0.5em] animate-pulse">
                DECRYPTING CLINICAL PATTERNS
              </span>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-cyan-500/10 border border-cyan-500/20 px-5 py-3 rounded-2xl flex items-center gap-3">
                  <Fingerprint size={16} className="text-cyan-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                    ID: <span className="text-cyan-600 ml-1">{selectedDisease}</span>
                  </span>
                </div>

                <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3">
                  <LayoutGrid size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Variants: <span className="text-slate-900 ml-1">{diseaseSymptoms.length}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {diseaseSymptoms.map((row, idx) => (
                  <div key={idx} className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 hover:border-cyan-400 transition-all shadow-sm hover:shadow-xl hover:shadow-cyan-500/5">
                    <span className="absolute right-6 top-4 text-5xl sm:text-7xl font-black text-slate-50/80 pointer-events-none select-none group-hover:text-cyan-50 transition-colors">
                      {idx + 1}
                    </span>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Symptom Bundle
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {row.map((sym, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:bg-white transition-colors">
                            {sym}
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                          Analysis Verified
                        </span>
                        <Binary size={14} className="text-slate-200 group-hover:text-cyan-200 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SymptomNavigator;